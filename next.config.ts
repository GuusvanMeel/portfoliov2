import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      },
      {
        protocol: "https",
        hostname: "nstelphunkyedurxjmey.supabase.co",

      }
    ],
  },

  allowedDevOrigins: ["192.168.2.19"],
};

export default nextConfig;