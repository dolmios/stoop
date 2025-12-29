import type { ReactNode } from "react";

import { createMetadata } from "../../lib/metadata";

export const metadata = createMetadata({
  description:
    "Complete API reference for Stoop - CSS-in-JS library with type inference and theme support (beta)",
  keywords: ["stoop api", "css in js api", "stitches api", "css in js reference"],
  path: "/api",
  title: "API Reference",
});

export default function APILayout({ children }: { children: ReactNode }): ReactNode {
  return children;
}
