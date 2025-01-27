import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // staticPageGenerationTimeout: 1000,
  images: {
    domains: ['hisedoayqdvpsebktekf.supabase.co'], // Ensure this matches the hostname exactly
  },
};

export default nextConfig;
