"use client";

import type { ReactElement } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Stack } from "../../ui/Stack";
import { Text } from "../../ui/Text";

const baseUrl = "https://stoop.dolmios.com";

// Label mapping for better breadcrumb readability
const routeLabels: Record<string, string> = {
  api: "API Reference",
  comparison: "Comparison",
  "create-stoop": "createStoop",
  "create-theme": "createTheme",
  "creating-components": "Creating Components",
  css: "css",
  "get-css-text": "getCssText",
  "global-css": "globalCss",
  installation: "Installation",
  keyframes: "keyframes",
  migration: "Migration",
  overview: "Overview",
  "preload-theme": "preloadTheme",
  provider: "Provider",
  scales: "Scales",
  ssr: "Server-Side Rendering",
  styled: "styled",
  "theme-setup": "Theme Setup",
  "theme-tokens": "Theme Tokens",
  usage: "Usage",
  "use-theme": "useTheme",
  "utility-functions": "Utility Functions",
  "warm-cache": "warmCache",
};

function getBreadcrumbs(pathname: string): Array<{ label: string; href: string }> {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: Array<{ label: string; href: string }> = [{ href: "/", label: "Home" }];

  let currentPath = "";

  for (const segment of segments) {
    currentPath += `/${segment}`;
    // Use mapped label if available, otherwise generate from segment
    const label =
      routeLabels[segment] ||
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    breadcrumbs.push({ href: currentPath, label });
  }

  return breadcrumbs;
}

export function Breadcrumbs(): ReactElement | null {
  const pathname = usePathname();

  // Don't show breadcrumbs on homepage
  if (pathname === "/") {
    return null;
  }

  const breadcrumbs = getBreadcrumbs(pathname);

  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      item: `${baseUrl}${crumb.href}`,
      name: crumb.label,
      position: index + 1,
    })),
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <Stack align="center" css={{ marginBottom: "$medium" }} direction="row" gap="small">
        {breadcrumbs.map((crumb, index) => (
          <Stack key={crumb.href} align="center" direction="row" gap="small">
            {index > 0 && (
              <Text
                as="span"
                css={{
                  color: "$textSecondary",
                  fontSize: "$small",
                  margin: 0,
                }}>
                /
              </Text>
            )}
            {index === breadcrumbs.length - 1 ? (
              <Text
                as="span"
                css={{
                  color: "$text",
                  fontSize: "$small",
                  margin: 0,
                }}>
                {crumb.label}
              </Text>
            ) : (
              <Link
                href={crumb.href}
                style={{
                  color: "inherit",
                  fontSize: "var(--font-sizes-small)",
                  textDecoration: "none",
                }}>
                <Text
                  as="span"
                  css={{
                    "&:hover": {
                      color: "$text",
                      textDecoration: "underline",
                    },
                    color: "$textSecondary",
                    fontSize: "$small",
                    margin: 0,
                  }}>
                  {crumb.label}
                </Text>
              </Link>
            )}
          </Stack>
        ))}
      </Stack>
    </>
  );
}
