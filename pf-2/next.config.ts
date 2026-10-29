import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "pf-27.vercel.app" },
      { protocol: "https", hostname: "yogender.me" },
    ],
  },
};

export default nextConfig;
