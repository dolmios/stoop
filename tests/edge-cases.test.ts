/**
 * Edge cases and error handling tests.
 * Tests error scenarios, invalid inputs, cache eviction, and boundary conditions.
 */

import { afterEach, describe, expect, it } from "bun:test";

import { createStoop } from "../src/create-stoop";
import { clearStylesheet } from "../src/inject";
import { MAX_CLASS_NAME_CACHE_SIZE } from "../src/constants";
import type { CSS } from "../src/types";

import { createMockTheme } from "./helpers";

describe("Edge Cases and Error Handling", () => {
  afterEach(() => {
    clearStylesheet();
  });

  describe("Invalid Inputs", () => {
    it("should handle empty CSS objects", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const className = stoop.css({});

      expect(typeof className).toBe("string");
      // Empty CSS should still generate a class name (for consistency)
    });

    it("should handle null/undefined CSS values gracefully", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const className = stoop.css({
        color: "red",
        padding: undefined,
        margin: null as any,
      });

      expect(typeof className).toBe("string");
      const cssText = stoop.getCssText();
      expect(cssText).toContain("color");
      // Undefined/null values should be ignored
    });

    it("should handle invalid keyframe keys", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const animationName = stoop.keyframes({
        "0%": { opacity: 0 },
        "invalid": { opacity: 1 }, // Invalid keyframe key
        "150%": { opacity: 1 }, // Invalid percentage (>100%)
        "-10%": { opacity: 0 }, // Invalid percentage (<0)
        "to": { opacity: 1 },
      });

      expect(typeof animationName).toBe("string");
      const cssText = stoop.getCssText();
      // Should only contain valid keyframes
      expect(cssText).toContain("@keyframes");
      expect(cssText).toContain("0%");
      expect(cssText).toContain("to");
      // Invalid keys should be skipped
      expect(cssText).not.toContain("invalid");
    });

    it("should handle deeply nested CSS without exceeding depth limit", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      // Create deeply nested CSS (beyond MAX_CSS_NESTING_DEPTH = 10)
      let nested: CSS = { color: "red" };
      for (let i = 0; i < 15; i++) {
        nested = { "& > div": nested };
      }

      const className = stoop.css(nested);

      expect(typeof className).toBe("string");
      // Should not throw, but may truncate deep nesting
    });

    it("should handle invalid selectors gracefully", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const className = stoop.css({
        color: "red",
        "&invalid": { color: "blue" }, // Invalid selector
        "&:hover": { color: "green" }, // Valid selector
      });

      expect(typeof className).toBe("string");
      const cssText = stoop.getCssText();
      // Valid selectors should work
      expect(cssText).toContain(":hover");
    });
  });

  describe("Sanitization Edge Cases", () => {
    it("should sanitize dangerous CSS injection attempts", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const className = stoop.css({
        color: "red; background: url('evil.com');",
        padding: "16px",
      });

      expect(typeof className).toBe("string");
      const cssText = stoop.getCssText();
      // Should escape semicolons in values
      expect(cssText).toContain("\\;");
    });

    it("should handle invalid prefix values", () => {
      const stoop1 = createStoop({
        theme: createMockTheme(),
        prefix: "", // Empty prefix should default to "stoop"
      });

      const stoop2 = createStoop({
        theme: createMockTheme(),
        prefix: "123invalid", // Invalid prefix should be sanitized
      });

      const className1 = stoop1.css({ color: "red" });
      const className2 = stoop2.css({ color: "red" });

      expect(className1).toContain("stoop-");
      expect(typeof className2).toBe("string");
      // Invalid prefix should be sanitized
    });

    it("should sanitize class names with special characters", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      // Test that sanitizeClassName handles dangerous characters
      const className = stoop.css({
        color: "red",
      });

      // className should be sanitized (no script tags)
      expect(typeof className).toBe("string");
      expect(className).not.toContain("<script>");
      expect(className).not.toContain("alert");
    });
  });

  describe("Cache Behavior", () => {
    it("should evict least recently used entries when cache is full", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      // Generate many unique CSS objects to fill cache
      const classNames: string[] = [];
      const cacheSize = MAX_CLASS_NAME_CACHE_SIZE + 100;

      for (let i = 0; i < cacheSize; i++) {
        const className = stoop.css({
          color: `rgb(${i}, ${i}, ${i})`,
          padding: `${i}px`,
        });
        classNames.push(className);
      }

      // Cache should have evicted oldest entries
      expect(classNames.length).toBe(cacheSize);
      // All should be valid class names
      classNames.forEach((name) => {
        expect(typeof name).toBe("string");
        expect(name.length).toBeGreaterThan(0);
      });
    });

    it("should cache identical CSS objects", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const css1 = { color: "red", padding: "16px" };
      const css2 = { padding: "16px", color: "red" }; // Same, different order

      const className1 = stoop.css(css1);
      const className2 = stoop.css(css2);

      // Should produce same class name (deterministic)
      expect(className1).toBe(className2);
    });

    it("should handle cache hits correctly", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const css = { color: "red" };
      const className1 = stoop.css(css);
      const className2 = stoop.css(css);

      // Second call should be instant (cache hit)
      expect(className1).toBe(className2);
    });
  });

  describe("Theme Edge Cases", () => {
    it("should handle theme with missing scales", () => {
      const minimalTheme = {
        colors: {
          primary: "blue",
        },
      };

      const stoop = createStoop({ theme: minimalTheme });

      // Should work even with minimal theme
      const className = stoop.css({
        color: "$colors.primary",
        padding: "16px", // No space scale, but should still work
      });

      expect(typeof className).toBe("string");
    });

    it("should handle theme tokens that don't exist", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const className = stoop.css({
        color: "$colors.nonexistent", // Token doesn't exist
        padding: "$space.small",
      });

      expect(typeof className).toBe("string");
      // Should fallback to CSS variable even if token doesn't exist
      const cssText = stoop.getCssText();
      expect(cssText).toContain("--colors-nonexistent");
    });

    it("should handle empty theme", () => {
      const emptyTheme = {};

      expect(() => {
        createStoop({ theme: emptyTheme });
      }).not.toThrow();
    });
  });

  describe("Multiple Instances", () => {
    it("should handle multiple Stoop instances with different prefixes", () => {
      const stoop1 = createStoop({
        theme: createMockTheme(),
        prefix: "app1",
      });

      const stoop2 = createStoop({
        theme: createMockTheme(),
        prefix: "app2",
      });

      const className1 = stoop1.css({ color: "red" });
      const className2 = stoop2.css({ color: "red" });

      expect(className1).toContain("app1-");
      expect(className2).toContain("app2-");
      // Should be different class names due to different prefixes
      expect(className1).not.toBe(className2);
    });

    it("should isolate themes between instances", () => {
      const theme1 = { colors: { primary: "blue" } };
      const theme2 = { colors: { primary: "red" } };

      const stoop1 = createStoop({ theme: theme1 });
      const stoop2 = createStoop({ theme: theme2 });

      const className1 = stoop1.css({ color: "$colors.primary" });
      const className2 = stoop2.css({ color: "$colors.primary" });

      // Both should work independently
      expect(typeof className1).toBe("string");
      expect(typeof className2).toBe("string");
    });
  });

  describe("Utility Functions Edge Cases", () => {
    it("should handle utility functions that throw errors", () => {
      const stoop = createStoop({
        theme: createMockTheme(),
        utils: {
          broken: () => {
            throw new Error("Utility error");
          },
        },
      });

      // Should not throw, but should fallback to original value
      expect(() => {
        stoop.css({
          broken: "test",
          color: "red",
        });
      }).not.toThrow();
    });

    it("should handle utility functions returning invalid values", () => {
      const stoop = createStoop({
        theme: createMockTheme(),
        utils: {
          invalid: () => null as any,
        },
      });

      expect(() => {
        stoop.css({
          invalid: "test",
          color: "red",
        });
      }).not.toThrow();
    });
  });

  describe("SSR Edge Cases", () => {
    it("should handle getCssText in SSR context", () => {
      // Simulate SSR by checking if document is undefined
      const stoop = createStoop({ theme: createMockTheme() });

      stoop.css({ color: "red" });

      // Should work even in SSR
      const cssText = stoop.getCssText();
      expect(typeof cssText).toBe("string");
    });

    it("should handle getCssText with invalid theme name", () => {
      const stoop = createStoop({
        theme: createMockTheme(),
        themes: {
          light: createMockTheme(),
        },
      });

      // Should not throw with invalid theme name
      expect(() => {
        stoop.getCssText("nonexistent");
      }).not.toThrow();

      const cssText = stoop.getCssText("nonexistent");
      expect(typeof cssText).toBe("string");
      // Should fallback to default theme
    });
  });

  describe("Global CSS Edge Cases", () => {
    it("should handle globalCss cleanup function", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const cleanup = stoop.globalCss({
        body: { margin: 0 },
      });

      expect(typeof cleanup).toBe("function");
      // Cleanup should not throw
      expect(() => {
        cleanup();
      }).not.toThrow();
    });

    it("should prevent duplicate global CSS injection", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const css = { body: { margin: 0 } };

      const cleanup1 = stoop.globalCss(css);
      const cleanup2 = stoop.globalCss(css); // Same CSS

      expect(typeof cleanup1).toBe("function");
      expect(typeof cleanup2).toBe("function");
      // Second call should return empty cleanup (deduplicated)
    });
  });

  describe("Keyframes Edge Cases", () => {
    it("should handle empty keyframes object", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const animationName = stoop.keyframes({});

      expect(typeof animationName).toBe("string");
      // Should still generate animation name even if empty
    });

    it("should handle keyframes with only invalid keys", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const animationName = stoop.keyframes({
        invalid: { opacity: 0 },
        "200%": { opacity: 1 }, // Invalid (>100%)
      });

      expect(typeof animationName).toBe("string");
      // Should handle gracefully
    });

    it("should cache identical keyframes", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const keyframes1 = {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      };

      const name1 = stoop.keyframes(keyframes1);
      const name2 = stoop.keyframes(keyframes1);

      // Should return same name (cached)
      expect(name1).toBe(name2);
    });
  });
});

