"use client";

import type { ReactElement } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Stack, Text } from "stoop-ui";

const baseUrl = "https://stoop.dolmios.com";

// Label mapping for better breadcrumb readability
const routeLabels: Record<string, string> = {
  api: "API Reference",
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
      <Stack
        align="center"
        css={{
          flexWrap: "wrap",
          marginBottom: "$medium",
        }}
        direction="row"
        gap="smaller">
        {breadcrumbs.map((crumb, index) => (
          <Stack key={crumb.href} align="center" direction="row" gap="smaller">
            {index > 0 && (
              <Stack
                align="center"
                css={{
                  height: "100%",
                  padding: "$smaller $small",
                }}
                direction="row">
                <Text
                  as="span"
                  css={{
                    color: "$textSecondary",
                    fontSize: "$small",
                    lineHeight: "1",
                    margin: 0,
                  }}>
                  /
                </Text>
              </Stack>
            )}
            {index === breadcrumbs.length - 1 ? (
              <Button
                css={{
                  cursor: "default",
                }}
                disabled
                size="small">
                {crumb.label}
              </Button>
            ) : (
              <Button as={Link} href={crumb.href} size="small">
                {crumb.label}
              </Button>
            )}
          </Stack>
        ))}
      </Stack>
    </>
  );
}
