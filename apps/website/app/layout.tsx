import type { Metadata } from "next";
import type { ReactNode } from "react";

import localFont from "next/font/local";
import { cookies } from "next/headers";

import { Stack } from "../ui";
import { Breadcrumbs } from "./components/Breadcrumbs";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { Providers } from "./components/Providers";
import { StructuredData } from "./components/StructuredData";
import { Styles } from "./components/Styles";
import "./highlight.css";

const standardFont = localFont({
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
  src: [
    {
      path: "../public/fonts/standard-book.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../public/fonts/standard-bold.woff2",
      style: "normal",
      weight: "500",
    },
  ],
  variable: "--font-standard",
});

const monaspaceFont = localFont({
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "SF Mono", "Menlo", "Consolas", "monospace"],
  src: [
    {
      path: "../public/fonts/monaspace-xenon-regular.woff2",
      style: "normal",
      weight: "400",
    },
  ],
  variable: "--font-monaspace",
});

const baseUrl = "https://stoop.dolmios.com";
const ogImage = `${baseUrl}/stoop.jpg`;

export const metadata: Metadata = {
  alternates: {
    canonical: baseUrl,
  },
  description:
    "CSS-in-JS library with type inference, theme creation, and variants support. Similar to Stitches, built for modern React. Currently in active development (beta).",
  keywords: [
    "css in js",
    "stitches replacement",
    "stitches alternative",
    "css in js library",
    "react styling",
    "type-safe css",
  ],
  openGraph: {
    description:
      "CSS-in-JS library with type inference, theme creation, and variants support. Similar to Stitches (beta)",
    images: [
      {
        alt: "Stoop - CSS-in-JS Library",
        height: 630,
        url: ogImage,
        width: 1200,
      },
    ],
    siteName: "Stoop",
    title: "Stoop - CSS-in-JS Library",
    type: "website",
    url: baseUrl,
  },
  title: {
    default: "Stoop - CSS-in-JS Library",
    template: "%s | Stoop",
  },
  twitter: {
    card: "summary_large_image",
    description:
      "CSS-in-JS library with type inference, theme creation, and variants support. Similar to Stitches (beta)",
    images: [ogImage],
    title: "Stoop - CSS-in-JS Library",
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}): Promise<ReactNode> {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("stoop-theme");
  const initialTheme = themeCookie?.value || "light";

  return (
    <html
      className={`${standardFont.variable} ${monaspaceFont.variable}`}
      data-theme={initialTheme}
      lang="en"
      suppressHydrationWarning>
      <body>
        <StructuredData />
        <Styles initialTheme={initialTheme} />
        <Providers initialTheme={initialTheme}>
          <Header />
          <Navigation />
          <Stack
            as="main"
            css={{
              flex: 1,
              margin: "0 auto",
              maxWidth: "1000px",
              mobile: {
                padding: "$medium $small",
              },
              overflowX: "hidden",
              overflowY: "auto",
              padding: "$large $medium",
              width: "100%",
            }}>
            <Breadcrumbs />
            {children}
          </Stack>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
