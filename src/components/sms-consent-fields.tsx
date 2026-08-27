import Link from "next/link";
import type { InputHTMLAttributes } from "react";

type Props = {
  idPrefix: string;
  marketingInputProps?: InputHTMLAttributes<HTMLInputElement>;
  nonMarketingInputProps?: InputHTMLAttributes<HTMLInputElement>;
  className?: string;
};

export function SmsConsentFields({ idPrefix, marketingInputProps, nonMarketingInputProps, className = "" }: Props) {
  const marketingId = `${idPrefix}-sms-marketing-consent`;
  const nonMarketingId = `${idPrefix}-sms-non-marketing-consent`;
  const checkbox = "mt-1 size-4 shrink-0 accent-[#b89a55]";
  const option = "flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-700";

  return <fieldset className={`space-y-3 ${className}`}>
    <legend className="text-sm font-black text-navy">Optional text-message consent</legend>
    <label className={option} htmlFor={marketingId}>
      <input id={marketingId} name="smsMarketingConsent" value="true" type="checkbox" className={checkbox} {...marketingInputProps} />
      <span>I consent to receive marketing text messages about special offers, discounts, and service updates from CTA Plumbing 100 at the phone number provided. Message frequency may vary. Message and data rates may apply. Text HELP for assistance. Reply STOP to opt out.</span>
    </label>
    <label className={option} htmlFor={nonMarketingId}>
      <input id={nonMarketingId} name="smsNonMarketingConsent" value="true" type="checkbox" className={checkbox} {...nonMarketingInputProps} />
      <span>I consent to receive non-marketing text messages from CTA Plumbing 100 regarding appointment confirmations, appointment reminders, scheduling updates, service updates, and customer-care communications. Message frequency may vary. Message and data rates may apply. Text HELP for assistance. Reply STOP to opt out.</span>
    </label>
    <p className="text-xs leading-5 text-slate-600">Consent is not a condition of purchase. View our <Link className="font-bold text-copper-dark underline" href="/privacy-policy" target="_blank">Privacy Policy</Link> and <Link className="font-bold text-copper-dark underline" href="/terms-and-conditions" target="_blank">Terms and Conditions</Link>.</p>
  </fieldset>;
}
