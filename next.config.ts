import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "disciplined-bird-908.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
