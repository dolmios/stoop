import type { MetadataRoute } from "next";

const baseUrl = "https://stoop.dolmios.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/installation",
    "/creating-components",
    "/theme-setup",
    "/utility-functions",
    "/ssr",
    "/migration",
    "/comparison",
    "/api",
    "/api/create-stoop",
    "/api/styled",
    "/api/css",
    "/api/global-css",
    "/api/keyframes",
    "/api/create-theme",
    "/api/provider",
    "/api/use-theme",
    "/api/get-css-text",
    "/api/preload-theme",
    "/api/warm-cache",
    "/api/theme-tokens/overview",
    "/api/theme-tokens/scales",
    "/api/theme-tokens/usage",
  ];

  return routes.map((route) => ({
    changeFrequency: "weekly" as const,
    lastModified: new Date(),
    priority: route === "" ? 1 : route.startsWith("/api") ? 0.7 : 0.8,
    url: `${baseUrl}${route}`,
  }));
}
