import type { Metadata, Viewport } from "next";
import "./globals.css";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/lib/site";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  metadataBase: new URL(site.url), title: { default: "CTA Plumbing 100 | Treasure Valley Plumbing Services", template: "%s | CTA Plumbing 100" },
  description: "Residential and commercial plumbing services in Nampa, Boise, Meridian, and communities across Idaho’s Treasure Valley.",
  icons: { icon: "/images/logo-source.webp", apple: "/images/logo-source.webp" },
  alternates: { canonical: "/" }, openGraph: { type: "website", locale: "en_US", siteName: site.name, title: "CTA Plumbing 100", description: "Dependable plumbing support across Nampa and the Treasure Valley.", images: [{ url: "/images/hero-plumber.webp", width: 1200, height: 630, alt: "CTA Plumbing 100 technician serving a Treasure Valley property" }] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const localBusiness = { "@context": "https://schema.org", "@type": ["LocalBusiness", "Plumber"], "@id": `${site.url}/#business`, name: site.name, url: site.url, telephone: site.phone, email: site.email, image: `${site.url}/images/hero-plumber.webp`, address: { "@type": "PostalAddress", streetAddress: site.address.street, addressLocality: site.address.city, addressRegion: site.address.state, postalCode: site.address.postalCode, addressCountry: site.address.country }, openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" }], areaServed: site.cities.map((city) => ({ "@type": "City", name: `${city}, Idaho` })) };
  return <html lang="en"><body className="font-sans antialiased"><JsonLd data={localBusiness} /><SiteShell>{children}</SiteShell></body></html>;
}
