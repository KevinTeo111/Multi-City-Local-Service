import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // All pages live under app/[lang], so unmatched URLs need a 404 that
    // doesn't depend on a root layout.
    globalNotFound: true,
  },
};

export default nextConfig;
