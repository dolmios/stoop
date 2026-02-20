import { globalCss } from "stoop";

globalCss({
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
    display: "flex",
    flexDirection: "column",
    fontFamily: "$body",
    fontSize: "$default",
    fontWeight: "$default",
    lineHeight: 1.6,
    margin: 0,
    minHeight: "100vh",
    minWidth: 0,
    padding: 0,
    transition: "$default",
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
    lineHeight: 1.2,
    margin: 0,
  },
  h2: {
    fontSize: "$h2",
  },
  h3: {
    fontSize: "$h3",
  },
  html: {
    maxWidth: "100%",
    MozOsxFontSmoothing: "grayscale",
    overflowX: "hidden",
    scrollBehavior: "smooth",
    WebkitFontSmoothing: "antialiased",
    width: "100%",
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
