import type { TabItem } from "stoop-ui";

/**
 * Main navigation tabs configuration for the website.
 * Value is the URL path for navigation.
 */
export const mainNavTabs: TabItem[] = [
  { label: "Getting Started", value: "/installation" },
  { label: "Theme Setup", value: "/theme-setup" },
  { label: "Creating Components", value: "/creating-components" },
  { label: "SSR", value: "/ssr" },
  { label: "Utilities", value: "/utility-functions" },
  { label: "Migration", value: "/migration" },
  { label: "Benchmarks", value: "/benchmarks" },
  { label: "API Reference", value: "/api" },
];
