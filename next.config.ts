import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  reactCompiler: true,
};

export default nextConfig;
