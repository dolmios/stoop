import type { ReactNode } from "react";

import { createMetadata } from "../../lib/metadata";

export const metadata = createMetadata({
  description:
    "Create custom utility functions for CSS transformations in Stoop - CSS-in-JS library (beta)",
  keywords: ["css in js", "utility functions", "css utilities"],
  path: "/utility-functions",
  title: "Utility Functions",
});

export default function UtilityFunctionsLayout({ children }: { children: ReactNode }): ReactNode {
  return children;
}
