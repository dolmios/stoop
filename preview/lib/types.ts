// Type definitions for preview examples
import type { ReactNode } from "react";

import type { Theme } from "../../src/types";

// Theme name type - can be any string identifier
export type ThemeName = string;

// Theme context value for theme management
export interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeName;
  toggleTheme: () => void;
  setTheme: (theme: ThemeName) => void;
  availableThemes: ThemeName[];
}

// Theme provider props
export interface ThemeProviderProps {
  children: ReactNode;
  /** Map of theme names to theme objects */
  themes: Record<ThemeName, Theme>;
  /** Function to apply a theme (from StoopInstance.setTheme) */
  setTheme: (theme: Theme) => void;
  /** Initial theme name (defaults to first theme in themes object) */
  defaultTheme?: ThemeName;
  /** Optional function to toggle between themes (defaults to cycling through themes) */
  toggleTheme?: (currentTheme: ThemeName, themes: ThemeName[]) => ThemeName;
}
