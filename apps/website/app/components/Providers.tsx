"use client";

import type { ReactElement, ReactNode } from "react";

import { ThemeProvider } from "stoop-ui";

/**
 * Providers component that wraps the app with theme management.
 *
 * @param children - Child components to wrap
 * @param initialTheme - Initial theme name from server-side detection
 * @returns Provider component
 */
export function Providers({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme: string;
}): ReactElement {
  return (
    <ThemeProvider cookieKey="stoop-theme" defaultTheme={initialTheme} storageKey="stoop-theme">
      {children}
    </ThemeProvider>
  );
}
