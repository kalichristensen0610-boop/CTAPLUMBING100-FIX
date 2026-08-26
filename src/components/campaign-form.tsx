"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import type { Campaign } from "@/lib/campaigns";
import { campaignPhoneDisplay, campaignPhoneHref } from "@/lib/campaigns";
import { trackCampaignEvent } from "@/components/campaign-tracking";

export function CampaignForm({ campaign, instance }: { campaign: Campaign; instance: string }) {
  const id = useId(); const started = useRef(false); const [status, setStatus] = useState<{type:"success"|"error";message:string}|null>(null); const [busy,setBusy]=useState(false);
  const field="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-navy outline-none focus:border-copper focus:ring-2 focus:ring-copper/30";
  useEffect(()=>{ if(instance==="primary") trackCampaignEvent("campaign_page_view",campaign.id,{page_path:location.pathname}); },[campaign.id,instance]);
  function start(){if(!started.current){started.current=true;trackCampaignEvent("campaign_form_start",campaign.id,{form_instance:instance});}}
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;setBusy(true);setStatus(null);const params=new URLSearchParams(location.search);const data=Object.fromEntries(new FormData(form).entries());
    const payload={...data,consent:data.consent==="agreed",marketingConsent:data.marketingConsent==="agreed",campaignId:campaign.id,landingPageUrl:location.href,utmSource:params.get("utm_source")||"",utmMedium:params.get("utm_medium")||"",utmCampaign:params.get("utm_campaign")||"",utmContent:params.get("utm_content")||"",utmTerm:params.get("utm_term")||"",gclid:params.get("gclid")||"",fbclid:params.get("fbclid")||""};
    try{const response=await fetch("/api/campaign-leads",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});const result=await response.json().catch(()=>({message:`The server returned an error (${response.status}).`}));if(!response.ok)throw new Error(result.message||"We could not send your request.");setStatus({type:"success",message:result.message});trackCampaignEvent("campaign_lead_submitted",campaign.id,{form_instance:instance});form.reset();}
    catch(error){const message=error instanceof Error?error.message:"Please call us or try again.";console.error("Campaign form submission failed",{campaignId:campaign.id,statusMessage:message});setStatus({type:"error",message});trackCampaignEvent("campaign_form_error",campaign.id,{form_instance:instance});}finally{setBusy(false)}}
  return <form id={instance==="primary"?"appointment-form":undefined} onFocus={start} onSubmit={submit} className="rounded-3xl bg-white p-5 text-left shadow-2xl sm:p-7" noValidate>
    <p className="text-xs font-black uppercase tracking-[.16em] text-copper-dark">Request an appointment</p><h2 className="mt-2 text-2xl font-black text-navy">Get help with {campaign.service.toLowerCase()}</h2><p className="mt-2 text-sm leading-6 text-slate-600">Send your request and our team will follow up. This does not confirm an appointment.</p>
    <div className="mt-5 grid gap-x-4 gap-y-3 sm:grid-cols-2">
      <label className="text-sm font-bold text-navy" htmlFor={`${id}-first`}>First name *<input id={`${id}-first`} name="firstName" autoComplete="given-name" className={field} maxLength={60} required /></label>
      <label className="text-sm font-bold text-navy" htmlFor={`${id}-last`}>Last name *<input id={`${id}-last`} name="lastName" autoComplete="family-name" className={field} maxLength={60} required /></label>
      <label className="text-sm font-bold text-navy" htmlFor={`${id}-phone`}>Phone number *<input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" className={field} minLength={7} maxLength={30} required /></label>
      <label className="text-sm font-bold text-navy" htmlFor={`${id}-email`}>Email address *<input id={`${id}-email`} name="email" type="email" autoComplete="email" className={field} maxLength={150} required /></label>
      <label className="text-sm font-bold text-navy sm:col-span-2" htmlFor={`${id}-location`}>Service address or ZIP code *<input id={`${id}-location`} name="location" autoComplete="street-address" className={field} maxLength={200} required /></label>
      <label className="text-sm font-bold text-navy sm:col-span-2" htmlFor={`${id}-timing`}>Preferred service timing *<select id={`${id}-timing`} name="timing" className={field} defaultValue="" required><option value="" disabled>Select timing</option><option value="today">Today</option><option value="this-week">This week</option><option value="planning">Planning ahead</option></select></label>
      <label className="text-sm font-bold text-navy sm:col-span-2" htmlFor={`${id}-message`}>Brief description of the plumbing issue *<textarea id={`${id}-message`} name="message" rows={3} className={`${field} py-3`} minLength={5} maxLength={1500} required /></label>
      <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 sm:col-span-2"><input className="mt-1 size-4 shrink-0 accent-[#b89a55]" name="consent" value="agreed" type="checkbox" required/><span>I agree that CTA Plumbing 100 may contact me by phone or text about this service request. Message and data rates may apply. *</span></label>
      <label className="flex items-start gap-3 px-1 text-xs leading-5 text-slate-600 sm:col-span-2"><input className="mt-1 size-4 shrink-0 accent-[#b89a55]" name="marketingConsent" value="agreed" type="checkbox"/><span>Optional: I agree to receive occasional promotional calls or texts. Consent is not required to request service.</span></label>
      <input name="campaignId" type="hidden" defaultValue={campaign.id}/><input name="landingPageUrl" type="hidden" defaultValue={`/offers/${campaign.slug}`}/><label className="sr-only" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
    </div>
    {status&&<div role="status" className={`mt-4 flex gap-3 rounded-xl p-4 text-sm ${status.type==="success"?"bg-green-50 text-green-800":"bg-red-50 text-red-800"}`}>{status.type==="success"&&<CheckCircle2 className="shrink-0"/>}<div><p>{status.message}</p>{status.type==="success"&&<a className="mt-2 inline-block font-black underline" href={campaignPhoneHref(campaign.phone)}>Urgent? Call {campaignPhoneDisplay(campaign.phone)}</a>}</div></div>}
    <button disabled={busy} className="mt-5 inline-flex min-h-14 w-full items-center justify-center rounded-xl bg-emergency px-6 font-black text-white shadow-lg transition hover:bg-red-700 disabled:opacity-60" type="submit">{busy?<><LoaderCircle className="mr-2 animate-spin"/>Sending…</>:"Request an Appointment"}</button>
    <p className="mt-3 text-center text-xs leading-5 text-slate-500">Your information will not be sold. Submission does not confirm an appointment.</p>
  </form>
}
