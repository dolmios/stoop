/**
 * Theme validation and utility tests.
 * Tests theme structure validation, theme merging, and utility functions.
 */

import { afterEach, describe, expect, it } from "bun:test";

import { createStoop } from "../src/create-stoop";
import { clearStylesheet } from "../src/inject";
import type { UtilityFunction } from "../src/types";

import { createMockTheme } from "./helpers";

describe("Theme Validation and Utilities", () => {
  afterEach(() => {
    clearStylesheet();
  });

  describe("Theme Validation", () => {
    it("should accept valid theme scales", () => {
      const theme = {
        colors: { primary: "#0070f3" },
        space: { small: "8px" },
        fontSizes: { small: "14px" },
        fontWeights: { bold: "500" },
        lineHeights: { normal: "1.5" },
        letterSpacings: { wide: "0.1em" },
        sizes: { small: "100px" },
        radii: { small: "4px" },
        shadows: { small: "0 1px 2px rgba(0,0,0,0.1)" },
        zIndices: { modal: "1000" },
        opacities: { half: "0.5" },
        transitions: { fast: "150ms" },
      };

      expect(() => {
        createStoop({ theme });
      }).not.toThrow();
    });

    it("should handle empty theme", () => {
      expect(() => {
        createStoop({ theme: {} });
      }).not.toThrow();
    });

    it("should handle theme with only some scales", () => {
      const theme = {
        colors: { primary: "#0070f3" },
      };

      const stoop = createStoop({ theme });
      expect(stoop.theme.colors).toBeDefined();
    });

    it("should preserve theme object immutability", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (stoop.theme as any).newProperty = "test";
      }).toThrow();
    });
  });

  describe("createTheme", () => {
    it("should extend base theme with overrides", () => {
      const baseTheme = createMockTheme();
      const stoop = createStoop({ theme: baseTheme });

      const extendedTheme = stoop.createTheme({
        colors: {
          primary: "#ff0000",
        },
      });

      expect((extendedTheme.colors as { primary: string }).primary).toBe("#ff0000");
      expect((extendedTheme.colors as { secondary: string }).secondary).toBe("#666666");
    });

    it("should deep merge nested theme objects", () => {
      const baseTheme = createMockTheme();
      const stoop = createStoop({ theme: baseTheme });

      const extendedTheme = stoop.createTheme({
        colors: {
          primary: "#ff0000",
          newColor: "#00ff00",
        },
      });

      expect((extendedTheme.colors as { primary: string }).primary).toBe("#ff0000");
      expect((extendedTheme.colors as { newColor: string }).newColor).toBe("#00ff00");
      expect((extendedTheme.colors as { secondary: string }).secondary).toBe("#666666");
    });

    it("should preserve base theme properties not in override", () => {
      const baseTheme = createMockTheme();
      const stoop = createStoop({ theme: baseTheme });

      const extendedTheme = stoop.createTheme({
        colors: {
          primary: "#ff0000",
        },
      });

      // Should preserve space scale from base theme
      expect(extendedTheme.space).toBeDefined();
      expect((extendedTheme.space as { small: string }).small).toBe("8px");
    });

    it("should handle empty override", () => {
      const baseTheme = createMockTheme();
      const stoop = createStoop({ theme: baseTheme });

      const extendedTheme = stoop.createTheme({});

      expect(extendedTheme).toEqual(baseTheme);
    });
  });

  describe("Utility Functions", () => {
    it("should apply utility functions to CSS", () => {
      const stoop = createStoop({
        theme: createMockTheme(),
        utils: {
          px: (value: string | number | undefined) => {
            const val = typeof value === "string" || typeof value === "number" ? String(value) : "";
            return {
              paddingLeft: val,
              paddingRight: val,
            };
          },
          py: (value: string | number | undefined) => {
            const val = typeof value === "string" || typeof value === "number" ? String(value) : "";
            return {
              paddingTop: val,
              paddingBottom: val,
            };
          },
        } as Record<string, UtilityFunction>,
      });

      const className = stoop.css({
        px: "16px",
        py: "8px",
      });

      expect(typeof className).toBe("string");
      const cssText = stoop.getCssText();
      expect(cssText).toContain("padding-left");
      expect(cssText).toContain("padding-right");
      expect(cssText).toContain("padding-top");
      expect(cssText).toContain("padding-bottom");
    });

    it("should handle utility functions with theme tokens", () => {
      const stoop = createStoop({
        theme: createMockTheme(),
        utils: {
          px: (value: string | number | undefined) => {
            const val = typeof value === "string" || typeof value === "number" ? String(value) : "";
            return {
              paddingLeft: val,
              paddingRight: val,
            };
          },
        } as Record<string, UtilityFunction>,
      });

      const className = stoop.css({
        px: "$space.medium",
      });

      expect(typeof className).toBe("string");
      const cssText = stoop.getCssText();
      expect(cssText).toContain("padding-left");
      expect(cssText).toContain("var(--space-medium)");
    });

    it("should handle utility functions returning nested CSS", () => {
      const stoop = createStoop({
        theme: createMockTheme(),
        utils: {
          flex: (value: string | number | undefined) => {
            return {
              display: "flex",
              flexDirection: typeof value === "string" ? value : "row",
            };
          },
        } as Record<string, UtilityFunction>,
      });

      const className = stoop.css({
        flex: "column",
      });

      expect(typeof className).toBe("string");
      const cssText = stoop.getCssText();
      expect(cssText).toContain("display");
      expect(cssText).toContain("flex-direction");
    });

    it("should handle utility functions with undefined values", () => {
      const stoop = createStoop({
        theme: createMockTheme(),
        utils: {
          px: (value: string | number | undefined) => {
            const val = typeof value === "string" || typeof value === "number" ? String(value) : "";
            return {
              paddingLeft: val,
              paddingRight: val,
            };
          },
        } as Record<string, UtilityFunction>,
      });

      const className = stoop.css({
        px: undefined,
        color: "red",
      });

      expect(typeof className).toBe("string");
      const cssText = stoop.getCssText();
      expect(cssText).toContain("color");
    });

    it("should handle multiple utility functions", () => {
      const stoop = createStoop({
        theme: createMockTheme(),
        utils: {
          mx: (value: string | number | undefined) => {
            const val = typeof value === "string" || typeof value === "number" ? String(value) : "";
            return {
              marginLeft: val,
              marginRight: val,
            };
          },
          my: (value: string | number | undefined) => {
            const val = typeof value === "string" || typeof value === "number" ? String(value) : "";
            return {
              marginTop: val,
              marginBottom: val,
            };
          },
        } as Record<string, UtilityFunction>,
      });

      const className = stoop.css({
        mx: "16px",
        my: "8px",
      });

      expect(typeof className).toBe("string");
      const cssText = stoop.getCssText();
      expect(cssText).toContain("margin-left");
      expect(cssText).toContain("margin-right");
      expect(cssText).toContain("margin-top");
      expect(cssText).toContain("margin-bottom");
    });
  });

  describe("Config Property", () => {
    it("should expose config property", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      expect(stoop.config).toBeDefined();
      expect(stoop.config.theme).toEqual(theme);
    });

    it("should include prefix in config", () => {
      const theme = createMockTheme();
      const stoop = createStoop({
        theme,
        prefix: "custom",
      });

      expect(stoop.config.prefix).toBe("custom");
    });

    it("should include media in config", () => {
      const theme = createMockTheme();
      const media = {
        mobile: "@media (max-width: 768px)",
      };
      const stoop = createStoop({
        theme,
        media,
      });

      expect(stoop.config.media).toEqual(media);
    });

    it("should include utils in config", () => {
      const theme = createMockTheme();
      const utils = {
        px: () => ({ paddingLeft: "16px", paddingRight: "16px" }),
      };
      const stoop = createStoop({
        theme,
        utils,
      });

      expect(stoop.config.utils).toEqual(utils);
    });

    it("should include themes in config", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };
      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      expect(stoop.config.themes).toBeDefined();
      expect(stoop.config.themes?.light).toEqual(lightTheme);
      expect(stoop.config.themes?.dark).toEqual(darkTheme);
    });
  });
});
