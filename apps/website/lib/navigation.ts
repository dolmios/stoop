import type { TabItem } from "../ui";

/**
 * Main navigation tabs configuration for the website.
 * Value is the URL path for navigation.
 */
export const mainNavTabs: TabItem[] = [
  { label: "Getting Started", value: "/installation" },
  { label: "Creating Components", value: "/creating-components" },
  { label: "Theme Setup", value: "/theme-setup" },
  { label: "Utilities", value: "/utility-functions" },
  { label: "SSR", value: "/ssr" },
  { label: "Migration", value: "/migration" },
  { label: "API Reference", value: "/api" },
];
