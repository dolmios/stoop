import type { ReactElement } from "react";

const baseUrl = "https://stoop.dolmios.com";

export function StructuredData(): ReactElement {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            applicationCategory: "DeveloperApplication",
            author: {
              "@type": "Person",
              name: "Jackson Dolman",
              url: "https://github.com/dolmios",
            },
            codeRepository: "https://github.com/dolmios/stoop",
            description:
              "CSS-in-JS library with type inference, theme creation, and variants support. Similar to Stitches, built for modern React.",
            license: "https://opensource.org/licenses/MIT",
            name: "Stoop",
            operatingSystem: "Web",
            releaseNotes: "Currently in active development (beta)",
            softwareVersion: "0.2.1-beta",
            url: baseUrl,
          }),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            description:
              "CSS-in-JS library with type inference, theme creation, and variants support",
            name: "Stoop",
            url: baseUrl,
          }),
        }}
        type="application/ld+json"
      />
    </>
  );
}
