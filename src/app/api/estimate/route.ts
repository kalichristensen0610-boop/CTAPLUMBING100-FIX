import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { checkSubmissionSecurity, sanitizeText } from "@/lib/form-security";

export const runtime = "nodejs";
const schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  zipCode: z.string().trim().regex(/^\d{5}(?:-\d{4})?$/),
  service: z.enum(["Water Softener Installation", "Water Heater Installation", "Plumbing Repair", "Drain or Sewer Service", "Other Plumbing Service"]),
  smsTransactionalConsent: z.boolean(), smsMarketingConsent: z.boolean(), source: z.literal("estimate-a"), website: z.string().max(200),
  formStartedAt: z.coerce.number(), formSessionId: z.string().max(100), turnstileToken: z.string().max(2048),
});
function clean(name: string) { const value=process.env[name]?.trim(); if(!value)return undefined; return ((value.startsWith('"')&&value.endsWith('"'))||(value.startsWith("'")&&value.endsWith("'")))?value.slice(1,-1).trim():value; }
function sameOrigin(request:Request){const origin=request.headers.get("origin");if(!origin)return true;try{const host=request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()||request.headers.get("host")?.trim();return Boolean(host&&new URL(origin).host.toLowerCase()===host.toLowerCase())}catch{return false}}

export async function POST(request: Request) {
  const requestId=randomUUID();
  console.info(`[estimate:${requestId}] endpoint_received`,{contentType:request.headers.get("content-type")||"none"});
  if(!sameOrigin(request))return NextResponse.json({success:false,code:"ORIGIN_REJECTED",message:"This request is not allowed.",requestId},{status:403});
  let form:FormData;try{form=await request.formData()}catch{return NextResponse.json({success:false,code:"INVALID_FORM",message:"The request could not be read.",requestId},{status:400})}
  const parsed=schema.safeParse({name:sanitizeText(form.get("name"),100),phone:sanitizeText(form.get("phone"),30),zipCode:sanitizeText(form.get("zipCode"),10),service:sanitizeText(form.get("service"),100),smsTransactionalConsent:form.get("smsTransactionalConsent")==="true",smsMarketingConsent:form.get("smsMarketingConsent")==="true",source:form.get("source"),website:sanitizeText(form.get("website")||"",200),formStartedAt:form.get("formStartedAt"),formSessionId:sanitizeText(form.get("formSessionId"),100),turnstileToken:sanitizeText(form.get("turnstileToken"),2048)});
  if(!parsed.success)return NextResponse.json({success:false,accepted:false,code:"VALIDATION_ERROR",message:"Please complete every required field.",requestId},{status:400});
  const lead=parsed.data;
  const security=await checkSubmissionSecurity({request,requestId,scope:"estimate",honeypot:lead.website,formStartedAt:lead.formStartedAt,formSessionId:lead.formSessionId,turnstileToken:lead.turnstileToken,zipCode:lead.zipCode,requireServiceArea:true});
  if(!security.ok)return NextResponse.json({success:security.silent===true,accepted:false,code:security.code,message:security.message,requestId},{status:security.status});
  const host=clean("SMTP_HOST"),user=clean("SMTP_USER"),password=clean("SMTP_PASSWORD")?.replace(/\s+/g,""),from=clean("SMTP_FROM"),recipient=clean("LEAD_RECIPIENT"),cc=clean("EMAIL_CC");
  const missing=[["SMTP_HOST",host],["SMTP_USER",user],["SMTP_PASSWORD",password],["SMTP_FROM",from],["LEAD_RECIPIENT",recipient]].filter(([,value])=>!value).map(([name])=>name);
  if(missing.length){console.error(`[estimate:${requestId}] smtp_configuration_missing`,{missing});return NextResponse.json({success:false,code:"DELIVERY_NOT_CONFIGURED",message:"Online requests are temporarily unavailable. Please call us instead.",requestId},{status:503})}
  const port=Number(clean("SMTP_PORT")||"465");
  try{
    const transporter=nodemailer.createTransport({host,port,secure:port===465||clean("SMTP_SECURE")?.toLowerCase()==="true",auth:{user,pass:password}});
    await transporter.sendMail({from,to:recipient,cc,subject:`Estimate funnel request: ${lead.service}`,text:["Source: estimate-a paid advertising landing page",`Name: ${lead.name}`,`Phone: ${lead.phone}`,`ZIP code: ${lead.zipCode}`,`Service: ${lead.service}`,`Transactional SMS consent: ${lead.smsTransactionalConsent?"Yes":"No"}`,`Marketing SMS consent: ${lead.smsMarketingConsent?"Yes":"No"}`].join("\n")});
    console.info(`[estimate:${requestId}] smtp_delivered`);
    return NextResponse.json({success:true,accepted:true,code:"DELIVERED",message:"Thank you. Your estimate request was sent. We’ll follow up soon.",requestId});
  }catch(error){const e=error as {code?:string;message?:string};let message=e.message||"Unknown SMTP error";for(const secret of [password,user])if(secret)message=message.split(secret).join("[redacted]");console.error(`[estimate:${requestId}] smtp_delivery_failed`,{code:e.code||"UNKNOWN",message:message.slice(0,500)});return NextResponse.json({success:false,code:"DELIVERY_FAILED",message:"We could not send your estimate request. Please call us or try again shortly.",requestId},{status:502})}
}
