import type { NextConfig } from "next";

// Cypress coverage builds instrument the code with SWC; normal and production builds never do.
const isCoverageBuild = process.env.CYPRESS_COVERAGE === "true";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "nstelphunkyedurxjmey.supabase.co",
      },
    ],
  },

  allowedDevOrigins: ["192.168.2.19"],

  ...(isCoverageBuild && {
    experimental: {
      swcPlugins: [["swc-plugin-coverage-instrument", {}]],
    },
  }),
};

export default nextConfig;
