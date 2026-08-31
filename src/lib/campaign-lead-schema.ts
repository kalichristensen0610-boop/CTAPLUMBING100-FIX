import { z } from "zod";
import { campaignList } from "@/lib/campaigns";
const campaignIds=campaignList.map(campaign=>campaign.id) as [string,...string[]];
const optionalText=(max:number)=>z.string().trim().max(max).optional();
export const campaignLeadSchema=z.object({
  firstName:z.string().trim().min(1).max(60),lastName:z.string().trim().min(1).max(60),phone:z.string().trim().regex(/^[-+()\d\s.]{7,30}$/),email:z.string().trim().email().max(150).optional(),
  propertyType:z.enum(["Residential","Commercial"]),city:z.string().trim().min(2).max(80),state:z.string().trim().min(2).max(40),zipCode:z.string().trim().regex(/^\d{5}(?:-\d{4})?$/),
  serviceIssue:z.string().trim().min(2).max(150),serviceCondition:optionalText(150),urgency:optionalText(150),issueDetail:optionalText(500),contactTime:z.enum(["Morning","Afternoon","Evening","Anytime"]),contactPreference:z.enum(["Phone Call","Text Message","Email","No Preference"]),notes:optionalText(1500),smsTransactionalConsent:z.boolean(),smsMarketingConsent:z.boolean(),
  campaignId:z.enum(campaignIds),offerName:z.string().trim().min(2).max(150),campaignTag:z.string().trim().min(2).max(150),pageName:z.string().trim().min(2).max(150),landingPageUrl:z.string().url().max(500),
  utmSource:optionalText(150),utmMedium:optionalText(150),utmCampaign:optionalText(150),utmContent:optionalText(150),utmTerm:optionalText(150),gclid:optionalText(300),fbclid:optionalText(300),website:z.string().max(0).optional(),
});
export type CampaignLead=z.infer<typeof campaignLeadSchema>;
