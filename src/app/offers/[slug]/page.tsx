import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampaignLandingPage } from "@/components/campaign-landing-page";
import { campaignList, campaigns, type CampaignSlug } from "@/lib/campaigns";
import { site } from "@/lib/site";

export function generateStaticParams(){return campaignList.map(({slug})=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const campaign=campaigns[slug as CampaignSlug];if(!campaign)return{};const path=`/offers/${campaign.slug}`;return{title:campaign.title,description:campaign.description,alternates:{canonical:`${site.url}${path}`},robots:{index:false,follow:true},openGraph:{title:campaign.title,description:campaign.description,url:`${site.url}${path}`,type:"website",images:[{url:campaign.image,alt:campaign.imageAlt}]}}}
export default async function OfferPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const campaign=campaigns[slug as CampaignSlug];if(!campaign)notFound();return <CampaignLandingPage campaign={campaign}/>}
