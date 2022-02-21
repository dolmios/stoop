/**
 * Main factory function that creates a Stoop instance.
 * Configures theme, media queries, utilities, and returns all API functions.
 */

import { createContext } from "react";

import type { StoopConfig, StoopInstance, Theme, ThemeContextValue } from "./types";

import { createCreateThemeFunction } from "./api/create-theme";
import { createCSSFunction, setThemeContext } from "./api/css";
import { createGlobalCSSFunction } from "./api/global-css";
import { createKeyframesFunction } from "./api/keyframes";
import { createStyledFunction } from "./api/styled";
import { updateThemeVariables } from "./core/theme-manager";
import { getCssText, registerTheme } from "./inject";
import { sanitizePrefix } from "./utils/string";

export function createStoop<TTheme extends Theme = Theme>(
  config: StoopConfig<TTheme>,
): StoopInstance<TTheme> {
  const { media, prefix = "", theme, utils } = config;
  const sanitizedPrefix = sanitizePrefix(prefix);

  const ThemeContext = createContext<ThemeContextValue | null>(null);

  setThemeContext(ThemeContext);
  registerTheme(theme, sanitizedPrefix);
  updateThemeVariables(theme, sanitizedPrefix);

  const css = createCSSFunction(theme, sanitizedPrefix, media, utils);
  const createTheme = createCreateThemeFunction(theme);
  const globalCss = createGlobalCSSFunction(theme, sanitizedPrefix, media, utils);
  const keyframes = createKeyframesFunction(sanitizedPrefix);
  const styled = createStyledFunction(theme, sanitizedPrefix, media, utils);

  const themeObject = Object.freeze({ ...theme }) as typeof theme;

  return {
    config: { ...config, prefix: sanitizedPrefix },
    createTheme,
    css,
    getCssText,
    globalCss,
    keyframes,
    styled,
    theme: themeObject,
    ThemeContext,
  };
}
