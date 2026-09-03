import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
  return <html lang="en"><head><script async src="https://www.googletagmanager.com/gtag/js?id=AW-18413989597" /><script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18413989597');` }} />{/* Meta Pixel Code */}<Script id="meta-pixel" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1066143976321475');
fbq('track', 'PageView');` }} /><noscript dangerouslySetInnerHTML={{ __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1066143976321475&ev=PageView&noscript=1" />` }} />{/* End Meta Pixel Code */}</head><body className="font-sans antialiased"><JsonLd data={localBusiness} /><SiteShell>{children}</SiteShell><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" /><Script src="https://api.christensenandcoagency.com/js/external-tracking.js" data-tracking-id="tk_8654988435c84995a3a96b88674a170b" strategy="afterInteractive" /><Script type="text/javascript" src="//cdn.callrail.com/companies/693647407/62b48e69051cdc7decb0/12/swap.js" strategy="afterInteractive" /></body></html>;
}
