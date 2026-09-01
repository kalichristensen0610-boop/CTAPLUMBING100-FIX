export type CampaignSlug = "99-drain-cleaning" | "200-water-heater-buyback" | "200-off-plumbing-repair" | "60-minute-plumber";

export type Campaign = {
  slug: CampaignSlug;
  id: string;
  eyebrow: string;
  headline: string;
  supportingCopy: string;
  decisionQuestion: string;
  todayLabel: string;
  laterLabel: string;
  offerLabel: string;
  explanation: string;
  terms: string[];
  image: string;
  imageAlt: string;
  service: string;
  title: string;
  description: string;
  phone: string;
  qualifier?: string;
};

const campaignPhone = "(208) 447-9290";

export const campaigns: Record<CampaignSlug, Campaign> = {
  "99-drain-cleaning": {
    slug: "99-drain-cleaning", id: "september_drain_99", eyebrow: "Drain cleaning special offer", offerLabel: "$99 Drain Cleaning",
    headline: "Clear Your Clogged Drain for $99", supportingCopy: "Get one qualifying clogged drain cleared for just $99. Call CTA Plumbing 100 today to get your drains moving again.",
    decisionQuestion: "When do you need service?", todayLabel: "I Need Service Today — Call Now", laterLabel: "I Need Service Later — Request an Appointment",
    explanation: "$99 includes one clogged drain, up to 50 feet of standard drain cabling, and a standard accessible drain opening.",
    terms: ["The offer does not include main or building drains, pulling or resetting toilets, fixture removal for access, multiple drains, drain repair or replacement, or work beyond 50 feet.", "Any additional work will be discussed and approved before additional charges are incurred."],
    image: "/images/drain-cleaning.webp", imageAlt: "CTA Plumbing 100 drain cleaning service", service: "Drain Cleaning",
    title: "$99 Drain Cleaning Offer", description: "Get one qualifying clogged drain cleared for $99 from CTA Plumbing 100 in the Treasure Valley.",
    phone: campaignPhone,
  },
  "200-water-heater-buyback": {
    slug: "200-water-heater-buyback", id: "september_water_heater_buyback_200", eyebrow: "Water heater special offer", offerLabel: "$200 Water Heater Buyback",
    headline: "We’ll Give You $200 for Your Old Water Heater", supportingCopy: "Get $200 toward a qualifying new water heater installation from CTA Plumbing 100.",
    decisionQuestion: "When do you need your water heater replaced?", todayLabel: "I Need a Water Heater Today — Call Now", laterLabel: "I’m Planning a Replacement — Request an Appointment",
    explanation: "$200 buyback applies toward a qualifying standard 40- or 50-gallon gas or electric water heater installed by CTA Plumbing 100.",
    terms: ["One buyback per installation.", "Standard installation only; additional work is quoted separately.", "Cannot be combined with other offers or redeemed for cash."],
    image: "/images/water-heater.webp", imageAlt: "Water heater installation by CTA Plumbing 100", service: "Water Heater Installation",
    title: "$200 Water Heater Buyback", description: "Get $200 toward a qualifying new water heater installation from CTA Plumbing 100.",
    phone: campaignPhone,
  },
  "200-off-plumbing-repair": {
    slug: "200-off-plumbing-repair", id: "september_plumbing_repair_200", eyebrow: "Plumbing repair special offer", offerLabel: "$200 Off Plumbing Repair",
    headline: "Get $200 Off Your Plumbing Repair", supportingCopy: "Save $200 on one qualifying plumbing repair from CTA Plumbing 100.",
    decisionQuestion: "When do you need plumbing service?", todayLabel: "I Need Service Today — Call Now", laterLabel: "I Need Service Later — Request an Appointment",
    explanation: "$200 off one qualifying plumbing repair performed by CTA Plumbing 100.",
    terms: ["Discount cannot exceed the cost of the service.", "One offer per household.", "Cannot be combined with other offers or redeemed for cash."],
    image: "/images/pipe-repair.webp", imageAlt: "CTA Plumbing 100 technician completing a plumbing repair", service: "Plumbing Repair",
    title: "$200 Off Plumbing Repair", description: "Save $200 on one qualifying plumbing repair from CTA Plumbing 100.",
    phone: campaignPhone,
  },
  "60-minute-plumber": {
    slug: "60-minute-plumber", id: "september_60_minute_plumber", eyebrow: "Fast response plumbing offer", offerLabel: "60 Minutes or $100 Off",
    headline: "Plumber in 60 Minutes or Get $100 Off", supportingCopy: "Need plumbing help now? We’ll get a plumber headed your way fast—or take $100 off your qualifying service.",
    decisionQuestion: "Do you need service today?", todayLabel: "Yes — I Need a Plumber Now", laterLabel: "I Need Service Later — Request an Appointment",
    qualifier: "The 60-minute arrival guarantee applies to phone-confirmed, qualifying same-day calls.",
    explanation: "The 60-minute arrival guarantee applies to qualifying same-day service calls within our normal service area and confirmed by phone.",
    terms: ["Limited to the first three qualifying appointments per day.", "The 60-minute window begins when CTA Plumbing 100 confirms the appointment.", "If we arrive after 60 minutes, receive $100 off your service."],
    image: "/images/service-van.webp", imageAlt: "CTA Plumbing 100 service vehicle ready for a local plumbing call", service: "Urgent Plumbing Service",
    title: "60-Minute Plumber Offer", description: "Call for a qualifying same-day plumbing appointment: plumber in 60 minutes or receive $100 off service.",
    phone: campaignPhone,
  },
};

export const campaignList = Object.values(campaigns);
export const campaignPhoneHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;
export const campaignPhoneDisplay = (phone: string) => phone;
