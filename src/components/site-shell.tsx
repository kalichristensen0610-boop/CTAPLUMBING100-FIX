"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StickyMobileCall } from "@/components/shared";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const funnel = usePathname() === "/estimate-a";
  if (funnel) return <main>{children}</main>;
  return <><Header /><main>{children}</main><Footer /><StickyMobileCall /></>;
}
