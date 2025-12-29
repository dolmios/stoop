import type { ReactNode } from "react";

import { createMetadata } from "../../lib/metadata";

export const metadata = createMetadata({
  description:
    "Create styled components with Stoop - CSS-in-JS components with type-safe props and variants (beta)",
  keywords: ["css in js components", "styled components", "react styled", "css in js"],
  path: "/creating-components",
  title: "Creating Components",
});

export default function CreatingComponentsLayout({ children }: { children: ReactNode }): ReactNode {
  return children;
}
