/**
 * Global styles configuration.
 *
 * Demonstrates the `globalCss` API for applying styles globally.
 * These styles use theme tokens and will automatically update when the theme changes.
 */

import { globalCss } from "../stoop.theme";

/**
 * Global styles using theme tokens.
 * Call `globalStyles()` in your app entry point to inject these styles.
 */
export const globalStyles = globalCss({
  "*": {
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
  },
  "*, *::before, *::after": {
    boxSizing: "inherit",
  },
  "a": {
    "&:hover": {
      opacity: "$hover",
      textDecoration: "underline",
    },
    color: "$accent",
    textDecoration: "none",
    transition: "$default",
  },
  body: {
    backgroundColor: "$background",
    color: "$text",
    fontFamily: "$body",
    fontSize: "$medium",
    lineHeight: "1.6",
    minHeight: "100vh",
    transition: "$default",
  },
  code: {
    backgroundColor: "$hover",
    borderRadius: "$small",
    fontFamily: "$mono",
    fontSize: "$small",
    padding: "2px 6px",
  },
  "h1, h2, h3, h4, h5, h6": {
    fontFamily: "$heading",
    fontWeight: "$bold",
    lineHeight: "1.2",
    margin: 0,
  },
  html: {
    MozOsxFontSmoothing: "grayscale",
    WebkitFontSmoothing: "antialiased",
  },
  "pre code": {
    backgroundColor: "transparent",
    padding: 0,
  },
});
