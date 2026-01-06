"use client";

import type { ReactElement, ReactNode } from "react";

import { IconContext } from "@phosphor-icons/react";
import { ThemeProvider } from "stoop-ui";

/**
 * Providers component that wraps the app with theme management and icon defaults.
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
      <IconContext.Provider
        value={{
          color: "currentColor",
          size: 20,
          weight: "duotone",
        }}>
        {children}
      </IconContext.Provider>
    </ThemeProvider>
  );
}
