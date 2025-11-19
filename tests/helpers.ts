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
    },
    space: {
      small: "8px",
      medium: "16px",
      large: "24px",
    },
  };
}

