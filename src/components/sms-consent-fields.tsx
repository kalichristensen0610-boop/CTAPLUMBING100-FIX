import Link from "next/link";
import type { InputHTMLAttributes } from "react";

type Props = {
  idPrefix: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  className?: string;
};

export function SmsConsentFields({ idPrefix, inputProps, className = "" }: Props) {
  const consentId = `${idPrefix}-sms-consent`;

  return <fieldset className={className}>
    <legend className="text-sm font-black text-navy">Optional text-message consent</legend>
    <label className="mt-3 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-700" htmlFor={consentId}>
      <input id={consentId} name="smsConsent" value="true" type="checkbox" className="mt-1 size-4 shrink-0 accent-[#b89a55]" {...inputProps} />
      <span>By checking this box, I agree to receive recurring informational and promotional text messages from CTA Plumbing 100, including appointment confirmations, scheduling updates, service communications, estimate follow-ups, and occasional offers. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for assistance. Consent is not a condition of purchase. View our <Link className="font-bold text-copper-dark underline" href="https://ctaplumbing100.com/privacy-policy">Privacy Policy</Link> and <Link className="font-bold text-copper-dark underline" href="https://ctaplumbing100.com/terms-and-conditions">Terms and Conditions</Link>.</span>
    </label>
  </fieldset>;
}
