import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    optimizePackageImports: [],
  },
  images: {
    remotePatterns: [],
  },
  logging: {
    browserToTerminal: true,
    fetches: {
      fullUrl: true,
    },
  },
  poweredByHeader: false,
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
