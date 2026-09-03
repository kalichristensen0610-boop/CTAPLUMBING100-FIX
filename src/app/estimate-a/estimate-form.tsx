"use client";

import { FormEvent, useCallback, useId, useRef, useState } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { SmsConsentFields } from "@/components/sms-consent-fields";
import { TurnstileField } from "@/components/turnstile-field";
import { getFormSessionId } from "@/lib/form-client";

const services = ["Water Softener Installation", "Water Heater Installation", "Plumbing Repair", "Drain or Sewer Service", "Other Plumbing Service"];

export function EstimateForm({ compact = false }: { compact?: boolean }) {
  const id = useId();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReset, setTurnstileReset] = useState(0);
  const startedAt = useRef(Date.now());
  const handleTurnstile = useCallback((token: string) => setTurnstileToken(token), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setSubmitting(true);
    setStatus(null);
    try {
      const data = new FormData(form); data.set("formStartedAt", String(startedAt.current)); data.set("formSessionId", getFormSessionId()); data.set("turnstileToken", turnstileToken);
      const response = await fetch("/api/estimate", { method: "POST", body: data });
      const text = await response.text();
      let result: { message?: string } = {};
      try { result = JSON.parse(text); } catch { result = { message: `The server returned an error (${response.status}). Please call us instead.` }; }
      if (!response.ok) throw new Error(result.message || "We could not send your estimate request.");
      if ((result as { accepted?: boolean }).accepted !== true) return;
      setStatus({ type: "success", message: result.message || "Thank you. Your estimate request has been sent." });
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please call us or try again.";
      console.error("Estimate form submission failed", { message });
      setStatus({ type: "error", message });
    } finally { setSubmitting(false); setTurnstileToken(""); setTurnstileReset((value) => value + 1); }
  }

  const field = "mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-navy outline-none transition focus:border-copper focus:ring-2 focus:ring-copper/25";
  return <form onSubmit={submit} className={`rounded-3xl bg-white ${compact ? "p-6" : "p-6 shadow-2xl sm:p-8"}`} noValidate>
    <h2 className="text-2xl font-black text-navy">Get My Free Estimate</h2>
    <p className="mt-2 text-sm leading-6 text-slate-600">Tell us what you need and our team will follow up.</p>
    <div className="mt-5 grid gap-4">
      <label htmlFor={`${id}-name`} className="text-sm font-bold text-navy">Full name *</label>
      <input id={`${id}-name`} name="name" className={`${field} !mt-[-.5rem]`} autoComplete="name" minLength={2} maxLength={100} required />
      <label htmlFor={`${id}-phone`} className="text-sm font-bold text-navy">Phone number *</label>
      <input id={`${id}-phone`} name="phone" className={`${field} !mt-[-.5rem]`} type="tel" autoComplete="tel" minLength={7} maxLength={30} required />
      <label htmlFor={`${id}-zip`} className="text-sm font-bold text-navy">Service ZIP code *</label>
      <input id={`${id}-zip`} name="zipCode" className={`${field} !mt-[-.5rem]`} inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{5}(-[0-9]{4})?" maxLength={10} required />
      <label htmlFor={`${id}-service`} className="text-sm font-bold text-navy">Plumbing service needed *</label>
      <select id={`${id}-service`} name="service" className={`${field} !mt-[-.5rem]`} defaultValue="" required><option value="" disabled>Select a service</option>{services.map((service)=><option key={service}>{service}</option>)}</select>
      <SmsConsentFields idPrefix={`${id}-estimate`} />
      <input name="source" type="hidden" value="estimate-a" />
      <label className="sr-only" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <TurnstileField onToken={handleTurnstile} resetSignal={turnstileReset} />
    </div>
    {status && <div role="status" className={`mt-5 flex gap-3 rounded-xl p-4 text-sm ${status.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>{status.type === "success" && <CheckCircle2 className="shrink-0"/>}<p>{status.message}</p></div>}
    <button type="submit" disabled={submitting} className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-copper px-6 font-black text-navy shadow-lg transition hover:bg-copper-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper disabled:opacity-60">{submitting ? <><LoaderCircle className="animate-spin"/>Sending…</> : <><Send/>Request My Free Estimate</>}</button>
    <p className="mt-4 text-center text-xs leading-5 text-slate-500">Your information will not be sold. Submitting does not confirm an appointment or final price.</p>
  </form>;
}
