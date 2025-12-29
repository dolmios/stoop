import type { ReactNode } from "react";

import { createMetadata } from "../../lib/metadata";

export const metadata = createMetadata({
  description:
    "Technical comparison between Stitches and Stoop CSS-in-JS libraries - feature differences and migration considerations (beta)",
  keywords: [
    "stitches vs stoop",
    "stitches comparison",
    "stitches alternative",
    "css in js comparison",
  ],
  path: "/comparison",
  title: "Stitches vs Stoop",
});

export default function ComparisonLayout({ children }: { children: ReactNode }): ReactNode {
  return children;
}
