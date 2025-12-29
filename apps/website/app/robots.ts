import type { MetadataRoute } from "next";

const baseUrl = "https://stoop.dolmios.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      userAgent: "*",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
