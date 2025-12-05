import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Turbopack (Next.js 16 default)
  // Mock-based rendering doesn't need external imports
  turbopack: {},
};

export default nextConfig;
