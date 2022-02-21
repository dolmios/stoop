// Type definitions for preview examples
import type { ReactNode } from "react";

import type { Theme } from "../src";

// Theme name type
export type ThemeName = "light" | "dark";

// Theme context value for theme management
export interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeName;
  toggleTheme: () => void;
  setTheme: (theme: ThemeName) => void;
}

// Theme provider props
export interface ThemeProviderProps {
  children: ReactNode;
  /** Initial theme (defaults to 'light') */
  defaultTheme?: ThemeName;
}
