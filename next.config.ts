import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "disciplined-bird-908.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "spotted-squirrel-927.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
