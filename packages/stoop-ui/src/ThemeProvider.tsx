/**
 * ThemeProvider component for stoop-ui.
 * Consumers should wrap their app with this provider.
 * Automatically applies global styles/reset.
 */

import { useEffect, type ReactNode } from "react";

import { Provider, useTheme as useStoopTheme, globalCss } from "./stoop.theme";

// Global styles/reset - automatically applied when ThemeProvider mounts
const globalStyles = globalCss({
  "*": {
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
  },
  "*, *::before, *::after": {
    boxSizing: "inherit",
  },
  "[aria-hidden='true']": {
    display: "none",
  },
  "[hidden]": {
    display: "none",
  },
  a: {
    "&:focus-visible": {
      borderRadius: "$small",
      outline: "2px solid $text",
      outlineOffset: "2px",
    },
    "&:hover": {
      opacity: "$hover",
    },
    color: "$text",
    textDecoration: "none",
    transition: "$default",
  },
  body: {
    backgroundColor: "$background",
    color: "$text",
    fontFamily: "$body",
    fontSize: "$default",
    fontWeight: "$default",
    lineHeight: "1.6",
    margin: 0,
    minHeight: "100vh",
    MozOsxFontSmoothing: "grayscale",
    padding: 0,
    transition: "$default",
    WebkitFontSmoothing: "antialiased",
  },
  button: {
    "&:focus-visible": {
      borderRadius: "$small",
      outline: "2px solid $text",
      outlineOffset: "2px",
    },
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  "button, input, select, textarea": {
    fontFamily: "inherit",
    fontSize: "inherit",
    lineHeight: "inherit",
    margin: 0,
  },
  code: {
    backgroundColor: "$hover",
    borderRadius: "$small",
    fontFamily: "$mono",
    fontSize: "$small",
    padding: "2px 6px",
  },
  h1: {
    fontSize: "$h1",
  },
  "h1, h2, h3, h4, h5, h6": {
    fontFamily: "$heading",
    fontWeight: "$bold",
    lineHeight: "1.2",
    margin: 0,
  },
  h2: {
    fontSize: "$h2",
  },
  h3: {
    fontSize: "$h3",
  },
  html: {
    MozOsxFontSmoothing: "grayscale",
    scrollBehavior: "smooth",
    WebkitFontSmoothing: "antialiased",
  },
  img: {
    display: "block",
    height: "auto",
    maxWidth: "100%",
  },
  "input, select, textarea": {
    "&:focus-visible": {
      borderRadius: "$small",
      outline: "2px solid $text",
      outlineOffset: "2px",
    },
  },
  p: {
    margin: 0,
  },
  "p, span, div, a, button, input, select, textarea, li, td, th": {
    fontWeight: "$default",
  },
  pre: {
    fontFamily: "$mono",
    margin: 0,
  },
  "pre code": {
    backgroundColor: "transparent",
    padding: 0,
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
  },
  "ul, ol": {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
});

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
  // Apply global styles once when ThemeProvider mounts
  useEffect(() => {
    globalStyles();
  }, []);

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
export const useTheme: typeof useStoopTheme = useStoopTheme;
