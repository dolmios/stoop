/**
 * Global styles configuration.
 * Demonstrates the `globalCss` API for applying styles globally.
 * These styles use theme tokens and automatically update when the theme changes.
 */

import { globalCss } from "../stoop.theme";

/**
 * Global styles using theme tokens.
 * Call once in your app entry point to inject these styles.
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
  "[aria-hidden='true']": {
    display: "none",
  },
  "[hidden]": {
    display: "none",
  },
  a: {
    "&:focus-visible": {
      borderRadius: "$radii.small",
      outline: "2px solid $text",
      outlineOffset: "2px",
    },
    "&:hover": {
      opacity: "$opacities.hover",
    },
    color: "$text",
    textDecoration: "none",
    transition: "$default",
  },
  body: {
    backgroundColor: "$background",
    color: "$text",
    fontFamily: "$fonts.body",
    fontSize: "$fontSizes.default",
    fontWeight: "$fontWeights.default",
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
      borderRadius: "$radii.small",
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
    borderRadius: "$radii.small",
    fontFamily: "$fonts.mono",
    fontSize: "$fontSizes.small",
    padding: "2px 6px",
  },
  h1: {
    fontSize: "$fontSizes.h1",
  },
  "h1, h2, h3, h4, h5, h6": {
    fontFamily: "$fonts.heading",
    fontWeight: "$fontWeights.bold",
    lineHeight: "1.2",
    margin: 0,
  },
  h2: {
    fontSize: "$fontSizes.h2",
  },
  h3: {
    fontSize: "$fontSizes.h3",
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
      borderRadius: "$radii.small",
      outline: "2px solid $text",
      outlineOffset: "2px",
    },
  },
  p: {
    margin: 0,
  },
  "p, span, div, a, button, input, select, textarea, li, td, th": {
    fontWeight: "$fontWeights.default",
  },
  pre: {
    fontFamily: "$fonts.mono",
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
