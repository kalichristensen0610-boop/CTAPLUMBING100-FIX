import Link from "next/link";
import type { InputHTMLAttributes } from "react";

type Props = {
  idPrefix: string;
  transactionalInputProps?: InputHTMLAttributes<HTMLInputElement>;
  marketingInputProps?: InputHTMLAttributes<HTMLInputElement>;
  className?: string;
};

export function SmsConsentFields({ idPrefix, transactionalInputProps, marketingInputProps, className = "" }: Props) {
  const transactionalId = `${idPrefix}-sms-transactional-consent`;
  const marketingId = `${idPrefix}-sms-marketing-consent`;
  const option = "flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-700";
  const checkbox = "mt-1 size-4 shrink-0 accent-[#b89a55]";

  return <fieldset className={`space-y-3 ${className}`}>
    <legend className="text-sm font-black text-navy">Optional text-message consent</legend>
    <p className="text-xs leading-5 text-slate-600">Entering a phone number does not grant permission to send SMS messages. Please select only the optional consent choices you agree to.</p>
    <label className={option} htmlFor={transactionalId}>
      <input id={transactionalId} name="smsTransactionalConsent" value="true" type="checkbox" className={checkbox} {...transactionalInputProps} />
      <span>I consent to receive transactional messages from CTA Plumbing 100 at the phone number provided, including account alerts, appointment confirmations, reminders, scheduling updates, and service notifications. Message frequency may vary. Message and data rates may apply. Reply HELP for help or STOP to opt out.</span>
    </label>
    <label className={option} htmlFor={marketingId}>
      <input id={marketingId} name="smsMarketingConsent" value="true" type="checkbox" className={checkbox} {...marketingInputProps} />
      <span>I consent to receive marketing and promotional messages from CTA Plumbing 100 at the phone number provided, including special offers and service promotions. Message frequency may vary. Message and data rates may apply. Reply HELP for help or STOP to opt out.</span>
    </label>
    <p className="text-xs leading-5 text-slate-600">Consent is not a condition of purchase. View our <Link className="font-bold text-copper-dark underline" href="https://ctaplumbing100.com/privacy-policy">Privacy Policy</Link> and <Link className="font-bold text-copper-dark underline" href="https://ctaplumbing100.com/terms-and-conditions">Terms and Conditions</Link>.</p>
  </fieldset>;
}
