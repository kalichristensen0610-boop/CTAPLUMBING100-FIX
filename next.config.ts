import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.DOCKER_BUILD === "true" ? "standalone" : undefined,
  poweredByHeader: false,
  async rewrites() {
    return [{ source: "/request-service", destination: "/request-service/index.html" }];
  },
};

export default nextConfig;
