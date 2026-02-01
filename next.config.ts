import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Removed to support Gemini API routes and dynamic features
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
