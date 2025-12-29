import type { ReactNode } from "react";

import { createMetadata } from "../../lib/metadata";

const baseUrl = "https://stoop.dolmios.com";

export const metadata = createMetadata({
  description:
    "Migrate from Stitches to Stoop - CSS-in-JS library with type safety and theme support (beta)",
  keywords: [
    "stitches replacement",
    "migrate from stitches",
    "stitches alternative",
    "css in js",
    "stoop migration",
  ],
  path: "/migration",
  title: "Migration from Stitches",
});

export default function MigrationLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            description:
              "Step-by-step guide to migrate your Stitches codebase to Stoop CSS-in-JS library",
            name: "Migrate from Stitches to Stoop",
            step: [
              {
                "@type": "HowToStep",
                name: "Install Stoop",
                text: "Install Stoop using your preferred package manager: npm install stoop",
              },
              {
                "@type": "HowToStep",
                name: "Update Imports",
                text: "Replace Stitches imports with Stoop imports from your theme file",
              },
              {
                "@type": "HowToStep",
                name: "Update Theme Configuration",
                text: "Update createStitches to createStoop and add themes configuration for multi-theme support",
              },
              {
                "@type": "HowToStep",
                name: "Update Component Usage",
                text: "Component API is mostly the same, but theme tokens now resolve to CSS variables",
              },
            ],
            url: `${baseUrl}/migration`,
          }),
        }}
        type="application/ld+json"
      />
      {children}
    </>
  );
}
