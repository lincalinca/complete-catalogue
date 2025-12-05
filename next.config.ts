import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile external packages (the other apps)
  transpilePackages: [],
  
  // Webpack configuration to allow imports from other apps
  webpack: (config) => {
    // Add aliases for each app's components
    config.resolve.alias = {
      ...config.resolve.alias,
      '@crescender-core': '/Users/linc/Dev-Work/Crescender/crescender-core',
      '@crescender-account': '/Users/linc/Dev-Work/Crescender/crescender-core/tmp/crescender-account',
      '@geargrabber': '/Users/linc/Dev-Work/Crescender/crescender-core/tmp/geargrabber',
      '@clavet': '/Users/linc/Dev-Work/Crescender/clavet',
    };

    return config;
  },
};

export default nextConfig;
