import type { TabItem } from "../ui/Tabs";

/**
 * Main navigation tabs configuration for the website.
 */
export const mainNavTabs: TabItem[] = [
  { href: "/installation", id: "getting-started", label: "Getting Started" },
  { href: "/creating-components", id: "creating-components", label: "Creating Components" },
  { href: "/theme-setup", id: "theme-setup", label: "Theme Setup" },
  { href: "/utility-functions", id: "utility-functions", label: "Utilities" },
  { href: "/ssr", id: "ssr", label: "SSR" },
  { href: "/migration", id: "migrating", label: "Migration" },
  { href: "/api", id: "api-reference", label: "API Reference" },
];
