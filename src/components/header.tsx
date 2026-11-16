"use client";
import { BookOnline } from "@/components/book-online";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { services } from "@/lib/content";
import { nav, phoneHref, site } from "@/lib/site";
import { Button } from "@/components/ui/button";

function ServicesDropdown({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  return <details
    className={mobile ? "group border-b" : "group relative"}
    onBlur={(event) => {
      if (!mobile && !event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
    }}
    onKeyDown={(event) => {
      if (event.key !== "Escape" || !event.currentTarget.open) return;
      event.stopPropagation();
      event.currentTarget.open = false;
      event.currentTarget.querySelector("summary")?.focus();
    }}
  >
    <summary className={`flex cursor-pointer list-none items-center gap-1 [&::-webkit-details-marker]:hidden ${mobile ? "justify-between py-4 font-semibold text-navy" : "min-h-11 text-xs font-semibold text-slate-700 hover:text-copper-dark xl:text-sm"}`}>
      Services <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
    </summary>
    <ul className={mobile ? "space-y-1 pb-3 pl-3" : "absolute left-0 top-full grid max-h-[min(65vh,32rem)] w-[min(34rem,55vw)] grid-cols-2 gap-1 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-xl"}>
      <li className={mobile ? "" : "col-span-2 border-b border-slate-200 pb-1"}>
        <Link href="/services" className="block rounded-lg px-3 py-2.5 text-sm font-bold text-navy hover:bg-slate-50" onClick={(event) => {
          const details = event.currentTarget.closest("details");
          if (details) details.open = false;
          onNavigate?.();
        }}>All Services</Link>
      </li>
      {services.map(({ slug, name }) => <li key={slug}>
        <Link href={slug === "emergency-plumbing" ? "/emergency-plumbing" : `/services/${slug}`} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-navy hover:bg-slate-50" onClick={(event) => {
          const details = event.currentTarget.closest("details");
          if (details) details.open = false;
          onNavigate?.();
        }}>{name}</Link>
      </li>)}
    </ul>
  </details>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  return <div className="site-global-header">
    <div className="bg-navy text-sm text-white"><div className="container flex items-center justify-between gap-4 py-2"><p>24/7 Emergency Plumbing • Treasure Valley</p><a className="hidden font-semibold text-copper-light sm:block" href={phoneHref}><Phone className="mr-2 inline size-4" />{site.phone}</a></div></div>
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="container flex h-24 items-center justify-between gap-4">
      <Link href="/" className="flex items-center" aria-label="CTA Plumbing 100 home"><Image src="/images/logo-source.webp" alt="CTA Plumbing 100" width={76} height={76} priority className="size-[76px] rounded-lg" /></Link>
      <nav className="hidden items-center gap-3 lg:flex xl:gap-5" aria-label="Main navigation">{nav.map((item) => item.href === "/services" ? <ServicesDropdown key={item.href} /> : <Link className="text-xs font-semibold text-slate-700 hover:text-copper-dark xl:text-sm" href={item.href} key={item.href}>{item.label}</Link>)}<Button variant="emergency" asChild><Link href="/emergency-plumbing">Emergency Plumbing</Link></Button><BookOnline /></nav>
      <div className="flex items-center gap-2 lg:hidden"><BookOnline className="px-3" /><Button variant="emergency" size="icon" asChild><a href={phoneHref} aria-label={`Call ${site.name}`}><Phone /></a></Button><Button variant="outline" size="icon" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label="Toggle navigation">{open ? <X /> : <Menu />}</Button></div>
    </div>
    {open && <nav id="mobile-menu" className="max-h-[calc(100dvh-8.5rem)] overflow-y-auto border-t bg-white px-4 pb-5 lg:hidden" aria-label="Mobile navigation">{nav.map((item) => item.href === "/services" ? <ServicesDropdown mobile key={item.href} onNavigate={() => setOpen(false)} /> : <Link onClick={() => setOpen(false)} className="block border-b py-4 font-semibold text-navy" href={item.href} key={item.href}>{item.label}</Link>)}<Button className="mt-4 w-full" variant="emergency" asChild><Link onClick={() => setOpen(false)} href="/emergency-plumbing">Emergency Plumbing</Link></Button></nav>}
    </header>
  </div>;
}
