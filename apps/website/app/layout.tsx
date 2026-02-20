import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import localFont from "next/font/local";
import { cookies } from "next/headers";

import { Breadcrumbs } from "./components/Breadcrumbs";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { Providers } from "./components/Providers";
import { StructuredData } from "./components/StructuredData";
import { Styles } from "./components/Styles";
import { Wrapper } from "./components/Wrapper";

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
    "Build-time CSS-in-JS with Stitches ergonomics. Zero runtime overhead. SWC plugin transforms styled() calls at compile time — type-safe, variant-driven, and built for modern React.",
  keywords: [
    "build-time css in js",
    "swc plugin",
    "zero runtime css",
    "stitches replacement",
    "stitches alternative",
    "css in js library",
    "react styling",
    "type-safe css",
    "stoop",
  ],
  openGraph: {
    description: "Build-time CSS-in-JS with Stitches ergonomics. Zero runtime. SWC-powered. (beta)",
    images: [
      {
        alt: "Stoop - Build-time CSS-in-JS",
        height: 630,
        url: ogImage,
        width: 1200,
      },
    ],
    siteName: "Stoop",
    title: "Stoop - Build-time CSS-in-JS",
    type: "website",
    url: baseUrl,
  },
  title: {
    default: "Stoop - Build-time CSS-in-JS",
    template: "%s | Stoop",
  },
  twitter: {
    card: "summary_large_image",
    description: "Build-time CSS-in-JS with Stitches ergonomics. Zero runtime. SWC-powered. (beta)",
    images: [ogImage],
    title: "Stoop - Build-time CSS-in-JS",
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 5,
  width: "device-width",
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
      <body suppressHydrationWarning>
        <StructuredData />
        <Styles initialTheme={initialTheme} />
        <Providers initialTheme={initialTheme}>
          <Header />
          <Navigation />
          <Wrapper>
            <Breadcrumbs />
            {children}
          </Wrapper>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
