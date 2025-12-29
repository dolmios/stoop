import type { Metadata } from "next";

const baseUrl = "https://stoop.dolmios.com";

export function createMetadata({
  description,
  image,
  keywords,
  path = "",
  title,
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
}): Metadata {
  const url = `${baseUrl}${path}`;
  const fullTitle = path ? `${title} | Stoop` : title;
  const ogImage = image || `${baseUrl}/stoop.jpg`;

  return {
    alternates: {
      canonical: url,
    },
    description,
    keywords: keywords?.join(", "),
    openGraph: {
      description,
      images: [
        {
          alt: fullTitle,
          height: 630,
          url: ogImage,
          width: 1200,
        },
      ],
      siteName: "Stoop",
      title: fullTitle,
      type: "website",
      url,
    },
    title: fullTitle,
    twitter: {
      card: "summary_large_image",
      description,
      images: [ogImage],
      title: fullTitle,
    },
  };
}
