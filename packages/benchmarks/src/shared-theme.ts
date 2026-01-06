/**
 * Shared theme configuration for both Stoop and Stitches benchmarks.
 * Ensures fair comparison by using identical theme structures.
 */

export const sharedTheme = {
  colors: {
    background: "#ffffff",
    border: "#eaeaea",
    hover: "#fafafa",
    primary: "#0070f3",
    secondary: "#666666",
    text: "#000000",
  },
  shadows: {
    medium: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  },
  space: {
    large: "24px",
    medium: "16px",
    small: "8px",
  },
};
