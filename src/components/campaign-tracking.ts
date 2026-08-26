"use client";

declare global { interface Window { dataLayer?: Record<string, unknown>[]; fbq?: (...args: unknown[]) => void } }

export function trackCampaignEvent(event: string, campaignId: string, details: Record<string, unknown> = {}) {
  const payload = { event, campaign_id: campaignId, ...details };
  window.dataLayer?.push(payload);
  window.dispatchEvent(new CustomEvent("cta:campaign", { detail: payload }));
  if (event === "campaign_lead_submitted") window.fbq?.("track", "Lead", { campaign_id: campaignId });
}
