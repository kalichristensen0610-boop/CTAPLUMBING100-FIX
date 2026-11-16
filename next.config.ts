import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.DOCKER_BUILD === "true" ? "standalone" : undefined,
  poweredByHeader: false,
  async redirects() {
    const retiredPages = [
      "/specials",
      "/offers/99-drain-cleaning",
      "/offers/200-water-heater-buyback",
      "/offers/200-off-plumbing-repair",
      "/offers/60-minute-plumber",
    ];
    return retiredPages.flatMap((source) => [
      { source, destination: "/request-service", permanent: true },
      ...(source.startsWith("/offers/")
        ? [{ source: `${source}/thank-you`, destination: "/request-service", permanent: true }]
        : []),
    ]);
  },
  async rewrites() {
    return [{ source: "/request-service", destination: "/request-service/index.html" }];
  },
};

export default nextConfig;
