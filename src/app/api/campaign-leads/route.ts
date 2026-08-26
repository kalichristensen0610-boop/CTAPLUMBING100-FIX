import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { campaignLeadSchema } from "@/lib/campaign-lead-schema";
import { campaignList } from "@/lib/campaigns";

export const runtime = "nodejs";
const attempts=new Map<string,{count:number;reset:number}>();
function env(name:string){const value=process.env[name]?.trim();if(!value)return undefined;return ((value.startsWith('"')&&value.endsWith('"'))||(value.startsWith("'")&&value.endsWith("'")))?value.slice(1,-1).trim():value}
function rateAllowed(ip:string){const now=Date.now();const item=attempts.get(ip);if(!item||item.reset<now){attempts.set(ip,{count:1,reset:now+10*60_000});return true}if(item.count>=8)return false;item.count++;return true}
function sameOrigin(request:Request){const origin=request.headers.get("origin");if(!origin)return true;try{const host=request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()||request.headers.get("host")?.trim();return Boolean(host&&new URL(origin).host.toLowerCase()===host.toLowerCase())}catch{return false}}
function safe(value:string|undefined){return value?.replace(/[\r\n]/g," ").slice(0,500)||"Not provided"}

export async function POST(request:Request){
  const requestId=randomUUID();console.info(`[campaign-leads:${requestId}] endpoint_received`,{contentType:request.headers.get("content-type")||"none"});
  if(!sameOrigin(request)){console.warn(`[campaign-leads:${requestId}] origin_rejected`);return NextResponse.json({success:false,message:"This request is not allowed.",requestId},{status:403})}
  const ip=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"local";if(!rateAllowed(ip))return NextResponse.json({success:false,message:"Too many requests. Please call us or try again later.",requestId},{status:429});
  const length=Number(request.headers.get("content-length")||0);if(length>30_000)return NextResponse.json({success:false,message:"The request is too large.",requestId},{status:413});
  let body:unknown;try{body=await request.json()}catch{return NextResponse.json({success:false,message:"The request could not be read.",requestId},{status:400})}
  const parsed=campaignLeadSchema.safeParse(body);if(!parsed.success){console.warn(`[campaign-leads:${requestId}] validation_failed`,{fields:Object.keys(parsed.error.flatten().fieldErrors)});return NextResponse.json({success:false,message:"Please complete every required field.",requestId},{status:400})}
  if(parsed.data.website)return NextResponse.json({success:true,message:"Thank you. Your request has been received.",requestId});
  const host=env("SMTP_HOST"),user=env("SMTP_USER"),password=env("SMTP_PASSWORD")?.replace(/\s+/g,""),from=env("SMTP_FROM"),recipient=env("LEAD_RECIPIENT"),cc=env("EMAIL_CC");
  if(!host||!user||!password||!from||!recipient){console.error(`[campaign-leads:${requestId}] smtp_configuration_missing`);if(process.env.NODE_ENV!=="production")return NextResponse.json({success:true,message:"Development mode: your request validated successfully. Configure SMTP for delivery.",requestId});return NextResponse.json({success:false,message:"Online requests are temporarily unavailable. Please call us instead.",requestId},{status:503})}
  const lead=parsed.data;const campaign=campaignList.find(item=>item.id===lead.campaignId);const port=Number(env("SMTP_PORT")||"465");
  try{const transporter=nodemailer.createTransport({host,port,secure:port===465||env("SMTP_SECURE")?.toLowerCase()==="true",auth:{user,pass:password}});await transporter.sendMail({from,to:recipient,cc,replyTo:lead.email,subject:`Campaign lead: ${campaign?.offerLabel||lead.campaignId}`,text:[`Campaign: ${lead.campaignId}`,`Landing page: ${safe(lead.landingPageUrl)}`,`Name: ${safe(lead.firstName)} ${safe(lead.lastName)}`,`Phone: ${safe(lead.phone)}`,`Email: ${safe(lead.email)}`,`Address or ZIP: ${safe(lead.location)}`,`Timing: ${lead.timing}`,`Issue: ${safe(lead.message)}`,`Required service contact consent: Yes`,`Optional promotional consent: ${lead.marketingConsent?"Yes":"No"}`,"",`UTM source: ${safe(lead.utmSource)}`,`UTM medium: ${safe(lead.utmMedium)}`,`UTM campaign: ${safe(lead.utmCampaign)}`,`UTM content: ${safe(lead.utmContent)}`,`UTM term: ${safe(lead.utmTerm)}`,`Google click ID: ${safe(lead.gclid)}`,`Meta click ID: ${safe(lead.fbclid)}`].join("\n")});console.info(`[campaign-leads:${requestId}] smtp_delivered`,{campaignId:lead.campaignId});return NextResponse.json({success:true,message:"Thank you. Your request was sent. Our team will follow up soon.",requestId})}
  catch(error){const e=error as {code?:string;message?:string};let message=e.message||"Unknown SMTP error";for(const secret of [password,user])if(secret)message=message.split(secret).join("[redacted]");console.error(`[campaign-leads:${requestId}] smtp_delivery_failed`,{code:e.code||"UNKNOWN",message:message.slice(0,500)});return NextResponse.json({success:false,message:"We could not send your request. Please call us or try again shortly.",requestId},{status:502})}
}
