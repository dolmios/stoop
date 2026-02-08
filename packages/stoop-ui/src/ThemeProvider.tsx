/**
 * ThemeProvider component for stoop-ui.
 * Consumers should wrap their app with this provider.
 * Automatically applies global styles/reset.
 */

import type { ReactNode } from "react";

import { Provider, useTheme as useStoopTheme } from "./stoop.theme";

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  cookieKey?: string;
  attribute?: string;
}

/**
 * ThemeProvider component that wraps the stoop Provider.
 * Automatically applies global styles/reset.
 * Consumers should wrap their app with this component.
 */
export function ThemeProvider({
  attribute = "data-theme",
  children,
  cookieKey,
  defaultTheme = "light",
  storageKey = "stoop-ui-theme",
}: ThemeProviderProps): ReactNode {
  return (
    <Provider
      attribute={attribute}
      cookieKey={cookieKey}
      defaultTheme={defaultTheme}
      storageKey={storageKey}>
      {children}
    </Provider>
  );
}

/**
 * Hook to access theme management.
 * Use this to toggle themes, get current theme, etc.
 */
export { useStoopTheme as useTheme };
