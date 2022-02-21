/**
 * Theme variable management.
 * Updates CSS custom properties when theme changes.
 * Ensures CSS variables are injected and kept in sync with theme updates.
 */

import type { Theme } from "../types";

import { injectThemeVariables } from "../inject";
import { generateCSSVariables } from "../utils/theme";

export function updateThemeVariables(theme: Theme, prefix = ""): void {
  if (typeof document === "undefined") {
    return;
  }

  const cssVars = generateCSSVariables(theme, prefix);

  injectThemeVariables(cssVars, theme, prefix);
}
