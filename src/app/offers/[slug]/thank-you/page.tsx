import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { campaignList, campaigns, campaignPhoneDisplay, campaignPhoneHref, type CampaignSlug } from "@/lib/campaigns";

export const metadata:Metadata={title:"Request Received",robots:{index:false,follow:false}};
export function generateStaticParams(){return campaignList.map(({slug})=>({slug}))}
export default async function CampaignThankYou({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const campaign=campaigns[slug as CampaignSlug];if(!campaign)notFound();return <main className="grid min-h-screen place-items-center bg-navy px-4 py-12 text-white"><section className="w-full max-w-2xl rounded-3xl bg-white p-7 text-center text-slate-700 shadow-2xl sm:p-12"><Image src="/images/logo-source.webp" alt="CTA Plumbing 100" width={84} height={84} className="mx-auto rounded-xl"/><CheckCircle2 className="mx-auto mt-7 size-14 text-green-600"/><p className="mt-5 text-sm font-black uppercase tracking-[.16em] text-copper-dark">{campaign.offerLabel}</p><h1 className="mt-3 text-4xl font-black text-navy">Your request has been received.</h1><p className="mx-auto mt-5 max-w-xl leading-7">Thank you for contacting CTA Plumbing 100. Our team will review your information and follow up shortly. Your submission does not confirm an appointment.</p><a href={campaignPhoneHref(campaign.phone)} className="mt-7 inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-emergency px-6 font-black text-white"><Phone className="size-5"/>Urgent? Call {campaignPhoneDisplay(campaign.phone)}</a><div className="mt-7"><Link className="text-sm font-bold text-copper-dark underline" href={`/offers/${campaign.slug}`}>Return to the offer page</Link></div></section></main>}
