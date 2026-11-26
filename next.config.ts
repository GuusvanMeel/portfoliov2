import type { NextConfig } from "next";

// Cypress coverage builds instrument the code with SWC; normal and production builds never do.
const isCoverageBuild = process.env.CYPRESS_COVERAGE === "true";

// Images may come from the Supabase project the app is connected to (the live project in
// production, the test project in tests).
const liveSupabaseHostname = "nstelphunkyedurxjmey.supabase.co";
function supabaseHostname(): string {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname || liveSupabaseHostname;
  } catch {
    return liveSupabaseHostname;
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: supabaseHostname(),
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
