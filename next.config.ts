import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep config minimal for Storybook/webpack usage; disable Turbopack settings here.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  webpack: (config) => config,
};

export default nextConfig;
