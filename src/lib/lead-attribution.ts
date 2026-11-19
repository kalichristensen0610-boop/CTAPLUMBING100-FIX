import { z } from "zod";

const attributionFields = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "campaign_id", "adset_id", "ad_id", "campaign_name", "adset_name", "ad_name",
  "fbclid", "gclid", "landing_page", "referrer",
] as const;

export const leadAttributionSchema = z.object(Object.fromEntries(
  attributionFields.map((field) => [field, z.string().max(300).optional()])
)).optional();

export function attributionSection(value: unknown) {
  const parsed = leadAttributionSchema.safeParse(value);
  const fields = parsed.success ? parsed.data : undefined;
  const rows: [string, string][] = attributionFields
    .filter((key) => fields?.[key])
    .map((key) => [key.replaceAll("_", " "), fields![key]!]);
  return {
    title: "Ad and website source",
    rows: rows.length ? rows : [["Tracking tags", "No tracking tags captured"]] as [string, string][],
  };
}
