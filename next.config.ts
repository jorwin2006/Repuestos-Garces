import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "80d0jsilzbb1p3ip.public.blob.vercel-storage.com",
        pathname: "/products/**",
      },
    ],
  },
};

export default nextConfig;