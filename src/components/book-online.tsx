import { CalendarDays } from "lucide-react";

export const bookingUrl = "https://book.housecallpro.com/book/CTA-Plumbing-100/1a2b590e1e914b608cf622b9784903cc?v2=true";

export function BookOnline({ className = "" }: { className?: string }) {
  return <a href={bookingUrl} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-copper px-4 py-3 text-sm font-black text-navy shadow-sm transition hover:bg-copper-light focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-copper-dark ${className}`}><CalendarDays className="size-5 shrink-0" aria-hidden="true" />Book Online</a>;
}

export function BookingSection() {
  return <section aria-label="Online booking" className="border-y border-slate-200 bg-slate-50"><div className="container flex flex-col items-start justify-between gap-5 py-10 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-black text-navy">Ready to book?</h2><p className="mt-2 text-slate-600">Choose an available appointment through our online booking page.</p></div><BookOnline className="w-full shrink-0 sm:w-auto" /></div></section>;
}
