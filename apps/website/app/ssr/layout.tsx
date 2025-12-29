import type { ReactNode } from "react";

import { createMetadata } from "../../lib/metadata";

export const metadata = createMetadata({
  description:
    "Use Stoop with Next.js and other SSR frameworks - CSS-in-JS library with SSR support (beta)",
  keywords: ["css in js", "ssr", "next.js", "server side rendering"],
  path: "/ssr",
  title: "Server-Side Rendering",
});

export default function SSRLayout({ children }: { children: ReactNode }): ReactNode {
  return children;
}
