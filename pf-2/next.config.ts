import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "pf-27.vercel.app" },
      { protocol: "https", hostname: "yogender.me" },
      { protocol: "https", hostname: "jishnumondal.vercel.app" },
    ],
  },
};

export default nextConfig;
