import type { ReactNode } from "react";

import { createMetadata } from "../../lib/metadata";

export const metadata = createMetadata({
  description: "Create theme configuration with design tokens in Stoop - CSS-in-JS library (beta)",
  keywords: ["css in js", "theme setup", "design tokens", "css variables"],
  path: "/theme-setup",
  title: "Theme Setup",
});

export default function ThemeSetupLayout({ children }: { children: ReactNode }): ReactNode {
  return children;
}
