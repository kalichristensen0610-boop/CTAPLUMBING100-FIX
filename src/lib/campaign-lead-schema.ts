import { z } from "zod";
import { campaignList } from "@/lib/campaigns";

const campaignIds = campaignList.map((campaign) => campaign.id) as [string, ...string[]];

export const campaignLeadSchema = z.object({
  firstName: z.string().trim().min(1).max(60), lastName: z.string().trim().min(1).max(60),
  phone: z.string().trim().min(7).max(30), email: z.string().trim().email().max(150),
  location: z.string().trim().min(3).max(200), timing: z.enum(["today", "this-week", "planning"]),
  message: z.string().trim().min(5).max(1500), consent: z.literal(true), marketingConsent: z.boolean().optional(),
  campaignId: z.enum(campaignIds), landingPageUrl: z.string().url().max(500),
  utmSource: z.string().max(150).optional(), utmMedium: z.string().max(150).optional(), utmCampaign: z.string().max(150).optional(),
  utmContent: z.string().max(150).optional(), utmTerm: z.string().max(150).optional(), gclid: z.string().max(300).optional(),
  fbclid: z.string().max(300).optional(), website: z.string().max(0).optional(),
});
