// app/robots.ts
import type { MetadataRoute } from "next";

const baseUrl = "https://portfoliov2-brown-theta.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}