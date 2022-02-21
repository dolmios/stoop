/**
 * Theme extension API.
 * Creates a function that deep merges theme overrides with a base theme.
 */
import type { Theme } from "../types";
export declare function createCreateThemeFunction(baseTheme: Theme): (themeOverrides: Partial<Theme>) => Theme;
