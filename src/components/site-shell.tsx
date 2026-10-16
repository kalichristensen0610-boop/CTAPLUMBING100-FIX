"use client";

import { BookingSection } from "@/components/book-online";
import { site } from "@/lib/site";
import Script from "next/script";
import { JsonLd } from "@/components/json-ld";
import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StickyMobileCall } from "@/components/shared";

export function SiteShell({ children, localBusiness }: { children: React.ReactNode; localBusiness: Record<string, unknown> }) {
  const pathname = usePathname();
  const funnel = pathname === "/estimate-a" || pathname.startsWith("/offers/");
  if (funnel) return <><JsonLd data={{ ...localBusiness, telephone: "(208) 682-7263" }} /><main>{children}<BookingSection /></main></>;
  return <><JsonLd data={{ ...localBusiness, telephone: site.phone }} /><Script type="text/javascript" src="//cdn.callrail.com/companies/693647407/62b48e69051cdc7decb0/12/swap.js" strategy="afterInteractive" /><Header /><main>{children}<BookingSection /></main><Footer /><StickyMobileCall /></>;
}
