import { createHash, randomUUID } from "node:crypto";
import { isApprovedServiceZip, outsideServiceAreaMessage } from "@/lib/service-area";

type Attempt = { count: number; reset: number };
const attempts = new Map<string, Attempt>();
const MIN_FORM_AGE_MS = 3_000;
const MAX_FORM_AGE_MS = 24 * 60 * 60_000;

export type SecurityInput = {
  request: Request;
  requestId: string;
  scope: string;
  honeypot?: string;
  formStartedAt?: number;
  formSessionId?: string;
  turnstileToken?: string;
  zipCode?: string;
  requireServiceArea?: boolean;
};

export type SecurityResult =
  | { ok: true }
  | { ok: false; silent?: boolean; status: number; code: string; message: string };

export function sanitizeText(value: unknown, max = 2_000) {
  if (typeof value !== "string") return value;
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

export function sanitizeObject(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeObject);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeObject(item)]));
  return sanitizeText(value);
}

export function clientIp(request: Request) {
  return request.headers.get("cf-connecting-ip")?.trim()
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")?.trim()
    || "local";
}

function rateAllowed(scope: string, ip: string, sessionId: string) {
  const now = Date.now();
  const normalizedSession = /^[a-zA-Z0-9_-]{8,100}$/.test(sessionId) ? sessionId : "none";
  const key = createHash("sha256").update(`${scope}:${ip}:${normalizedSession}`).digest("hex");
  const ipKey = createHash("sha256").update(`${scope}:${ip}`).digest("hex");
  for (const [candidate, limit] of [[key, 4], [ipKey, 10]] as const) {
    const item = attempts.get(candidate);
    if (!item || item.reset < now) attempts.set(candidate, { count: 1, reset: now + 15 * 60_000 });
    else if (item.count >= limit) return false;
    else item.count += 1;
  }
  return true;
}

async function verifyTurnstile(token: string, ip: string, requestId: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    console.warn(`[form-security:${requestId}] turnstile_configuration_missing`);
    return { ok: false, configured: false };
  }
  if (!token || token.length > 2_048) return { ok: false, configured: true };
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip, idempotency_key: randomUUID() }),
      signal: AbortSignal.timeout(8_000),
    });
    const result = await response.json() as { success?: boolean; "error-codes"?: string[] };
    if (!response.ok || !result.success) console.warn(`[form-security:${requestId}] turnstile_rejected`, { status: response.status, codes: result["error-codes"] || [] });
    return { ok: response.ok && result.success === true, configured: true };
  } catch (error) {
    console.error(`[form-security:${requestId}] turnstile_verification_failed`, { message: error instanceof Error ? error.message.slice(0, 160) : "Unknown error" });
    return { ok: false, configured: true };
  }
}

export async function checkSubmissionSecurity(input: SecurityInput): Promise<SecurityResult> {
  const origin = input.request.headers.get("origin");
  if (origin) {
    try {
      const host = input.request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() || input.request.headers.get("host")?.trim();
      if (!host || new URL(origin).host.toLowerCase() !== host.toLowerCase()) {
        console.warn(`[form-security:${input.requestId}] origin_rejected`, { scope: input.scope });
        return { ok: false, status: 403, code: "ORIGIN_REJECTED", message: "This request is not allowed." };
      }
    } catch {
      return { ok: false, status: 403, code: "ORIGIN_REJECTED", message: "This request is not allowed." };
    }
  }
  const ip = clientIp(input.request);
  if (input.honeypot) {
    console.warn(`[form-security:${input.requestId}] honeypot_rejected`, { scope: input.scope });
    return { ok: false, silent: true, status: 202, code: "ACCEPTED", message: "Thank you. Your request has been received." };
  }
  const age = Date.now() - Number(input.formStartedAt || 0);
  if (!Number.isFinite(age) || age < MIN_FORM_AGE_MS || age > MAX_FORM_AGE_MS) {
    console.warn(`[form-security:${input.requestId}] submission_timing_rejected`, { scope: input.scope, age });
    return { ok: false, status: 400, code: "SUBMISSION_TIMING", message: "Please wait a moment, review your information, and try again." };
  }
  if (!rateAllowed(input.scope, ip, input.formSessionId || "")) {
    console.warn(`[form-security:${input.requestId}] rate_limited`, { scope: input.scope });
    return { ok: false, status: 429, code: "RATE_LIMITED", message: "Too many requests. Please call us or try again later." };
  }
  if (input.requireServiceArea && (!input.zipCode || !isApprovedServiceZip(input.zipCode))) {
    console.info(`[form-security:${input.requestId}] outside_service_area`, { scope: input.scope, zipPrefix: input.zipCode?.slice(0, 3) || "none" });
    return { ok: false, status: 422, code: "OUTSIDE_SERVICE_AREA", message: outsideServiceAreaMessage };
  }
  const turnstile = await verifyTurnstile(input.turnstileToken || "", ip, input.requestId);
  if (!turnstile.configured && !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()) {
    console.warn(`[form-security:${input.requestId}] turnstile_not_enabled`, { scope: input.scope });
    return { ok: true };
  }
  if (!turnstile.ok) return { ok: false, status: turnstile.configured ? 400 : 503, code: turnstile.configured ? "BOT_CHECK_FAILED" : "BOT_CHECK_UNAVAILABLE", message: turnstile.configured ? "Please complete the security check and try again." : "Online requests are temporarily unavailable. Please call us instead." };
  return { ok: true };
}
