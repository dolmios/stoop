import type { ReactNode } from "react";

import { createMetadata } from "../../lib/metadata";

export const metadata = createMetadata({
  description:
    "Install Stoop - CSS-in-JS library similar to Stitches, built for modern React (beta)",
  keywords: ["css in js library", "stoop installation", "stitches replacement", "css in js"],
  path: "/installation",
  title: "Installation",
});

export default function InstallationLayout({ children }: { children: ReactNode }): ReactNode {
  return children;
}
