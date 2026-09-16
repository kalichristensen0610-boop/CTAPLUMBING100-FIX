import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/shared";
import { campaignList } from "@/lib/campaigns";
import { phoneHref, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Plumbing Specials",
  description: "Explore CTA Plumbing 100 specials: $99 drain cleaning, $200 off plumbing repair, $200 water heater buyback, and the 60-minute plumber offer.",
  alternates: { canonical: "/specials" },
};

export default function SpecialsPage() {
  return <>
    <div className="page-hero">
      <Breadcrumbs items={[{ label: "Specials" }]} />
      <div className="container relative z-10 max-w-4xl py-16 sm:py-24">
        <p className="eyebrow !text-copper-light">Current plumbing offers</p>
        <h1 className="font-display text-5xl font-black tracking-tight sm:text-6xl">Find the special that fits your plumbing needs.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Explore our four offers below. Choose Get Quote to visit that offer’s landing page and request service.</p>
      </div>
    </div>
    <section className="bg-[#fffdf8] py-16 sm:py-20" aria-label="Available plumbing specials">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-2">
          {campaignList.map(campaign => <article key={campaign.slug} className="flex flex-col overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
            <div className="relative aspect-[16/9]">
              <Image src={campaign.image} alt={campaign.imageAlt} fill className="object-cover" sizes="(max-width:1024px) 100vw,50vw" />
              <span className="absolute bottom-4 left-4 right-4 w-fit rounded-lg bg-navy px-4 py-2 text-sm font-black text-white">{campaign.offerLabel}</span>
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[.15em] text-copper-dark">{campaign.eyebrow}</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-navy">{campaign.headline}</h2>
              <p className="mt-4 leading-7 text-slate-600">{campaign.explanation}</p>
              {campaign.slug === "60-minute-plumber" && <p className="mt-4 rounded-xl border border-copper bg-[#fff3e4] p-4 text-sm font-bold leading-6 text-navy">Your 60-minute window begins only after we speak with you and confirm your appointment—not when you submit the form.</p>}
              <ul className="mb-6 mt-5 space-y-3 text-sm leading-6 text-slate-600">{campaign.terms.map(term => <li key={term} className="flex gap-2"><Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-copper-dark" /><span>{term}</span></li>)}</ul>
              <Link href={`/offers/${campaign.slug}`} aria-label={`Get quote for ${campaign.offerLabel}`} className="mt-auto inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border-2 border-[#f3c895] bg-[#c52222] px-6 py-4 text-base font-black text-white transition hover:bg-[#a61919] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-copper focus-visible:ring-offset-2">Get Quote <ArrowRight aria-hidden="true" className="size-5" /></Link>
            </div>
          </article>)}
        </div>
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-8">
          <h2 className="text-2xl font-black text-navy">Need help choosing an offer?</h2>
          <p className="mt-3 text-slate-600">Call us to discuss availability and which special applies to your request. Offer terms and eligibility apply.</p>
          <a href={phoneHref} className="mt-5 inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3 font-black text-white transition hover:bg-navy-light focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-copper focus-visible:ring-offset-2"><Phone aria-hidden="true" className="size-5" />Call Now · {site.phone}</a>
        </div>
      </div>
    </section>
  </>;
}