import { attributionSection, leadAttributionSchema } from "@/lib/lead-attribution";
import { randomUUID } from "node:crypto";
import nodemailer from "nodemailer";
import { z } from "zod";
import { checkSubmissionSecurity, sanitizeObject } from "@/lib/form-security";
import { leadNotification } from "@/lib/lead-notification";
import { serviceLeadRecipients } from "@/lib/service-lead-recipients";

export const runtime = "nodejs";

const inquiry = z.object({
  attribution: leadAttributionSchema,
  id: z.string().uuid(),
  property: z.enum(["Residential", "Commercial"]),
  ownership: z.enum(["Yes", "No"]),
  service: z.enum(["Leak or pipe repair", "Clogged drain or sewer", "Water heater", "Fixture or faucet", "Repiping", "Water Treatment", "Something else"]),
  name: z.string().min(2).max(100),
  phone: z.string().max(30).refine((phone) => phone.replace(/\D/g, "").length >= 7),
  email: z.string().email().max(150),
  formStartedAt: z.number(),
  turnstileToken: z.string().max(2048).optional(),
  website: z.string().max(200).optional(),
});

function env(key: string) {
  return process.env[key]?.trim().replace(/^(['"])(.*)\1$/, "$2").trim();
}

export function GET() {
  return Response.json({ siteKey: env("NEXT_PUBLIC_TURNSTILE_SITE_KEY") || "" }, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const requestId = randomUUID();
  const origin = request.headers.get("origin");
  if (!origin || request.headers.get("content-type")?.split(";")[0] !== "application/json") {
    return Response.json({ accepted: false }, { status: 403 });
  }

  let lead;
  try {
    if (Number(request.headers.get("content-length")) > 8192) {
      return Response.json({ accepted: false }, { status: 413 });
    }
    const body = await request.text();
    if (body.length > 8192) return Response.json({ accepted: false }, { status: 413 });
    lead = inquiry.parse(sanitizeObject(JSON.parse(body)));
  } catch {
    return Response.json({ accepted: false, message: "Please check your contact information." }, { status: 400 });
  }

  const security = await checkSubmissionSecurity({
    request, requestId, scope: "request-service", honeypot: lead.website,
    formStartedAt: lead.formStartedAt, formSessionId: lead.id, turnstileToken: lead.turnstileToken,
  });
  if (!security.ok) {
    return Response.json({ accepted: false, message: security.message }, { status: security.status });
  }

  const host = env("SMTP_HOST");
  const user = env("SMTP_USER");
  const pass = env("SMTP_PASSWORD")?.replace(/\s+/g, "");
  const from = env("SMTP_FROM");
  if (!host || !user || !pass || !from) {
    console.error("[request-service] SMTP configuration missing", { requestId });
    return Response.json({ accepted: false, message: "Online requests are temporarily unavailable. Please call us." }, { status: 503 });
  }

  const port = Number(env("SMTP_PORT") || "465");
  try {
    const transporter = nodemailer.createTransport({
      host, port, secure: port === 465 || env("SMTP_SECURE")?.toLowerCase() === "true",
      auth: { user, pass }, connectionTimeout: 7000, greetingTimeout: 7000, socketTimeout: 12000,
    });
    const delivery = await transporter.sendMail({
      from, to: serviceLeadRecipients, replyTo: lead.email,
      subject: `Website request for ${lead.service}`,
      ...leadNotification("New plumbing service inquiry", [
        attributionSection(lead.attribution),
        { title: "Contact details", rows: [["Name", lead.name], ["Phone", lead.phone], ["Email", lead.email]] },
        { title: "Service details", rows: [["Property", lead.property], ["Property owner", lead.ownership], ["Service", lead.service]] },
      ]),
    });
    if (!serviceLeadRecipients.every((recipient) => delivery.accepted.includes(recipient))) {
      console.error("[request-service] SMTP recipient rejected", { requestId, rejectedCount: delivery.rejected.length });
      return Response.json({ accepted: false, message: "We couldn’t confirm delivery. Please call us." }, { status: 502 });
    }
    console.info("[request-service] submitted to both recipients", { requestId });
    return Response.json({ accepted: true });
  } catch (error) {
    console.error("[request-service] SMTP delivery failed", { requestId, code: (error as { code?: string })?.code });
    return Response.json({ accepted: false, message: "We couldn’t send your request. Please try again or call us." }, { status: 502 });
  }
}
