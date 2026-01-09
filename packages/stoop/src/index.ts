/**
 * Main entry point for Stoop
 * Re-exports createStoop and all types
 */

export { createStoop } from "./create-stoop";

export type {
  CSS,
  ComponentProps,
  DefaultTheme,
  StoopConfig,
  StoopInstance,
  Theme,
  ThemeScale,
  UtilityFunction,
  VariantProps,
  StyledComponent,
  StyledFunction,
  // Function interface types
  CSSFunction,
  GlobalCSSFunction,
  KeyframesFunction,
  CreateThemeFunction,
  // Provider types
  ProviderProps,
  ThemeManagementContextValue,
  ThemeContextValue,
} from "./types";
