// Test utilities and helpers
import type { Theme } from "../src/types";

/**
 * Create a mock theme for testing
 */
export function createMockTheme(): Theme {
  return {
    colors: {
      primary: "#0070f3",
      secondary: "#666666",
      background: "#ffffff",
      text: "#000000",
      hover: "#fafafa",
      border: "#eaeaea",
    },
    space: {
      small: "8px",
      medium: "16px",
      large: "24px",
    },
    shadows: {
      subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      medium: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
  };
}

