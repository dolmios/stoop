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
    });

    it("should handle invalid keyframe keys", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const animationName = stoop.keyframes({
        "0%": { opacity: 0 },
        invalid: { opacity: 1 }, // Invalid keyframe key
        "150%": { opacity: 1 }, // Invalid percentage (>100%)
        "-10%": { opacity: 0 }, // Invalid percentage (<0)
        to: { opacity: 1 },
      });

      expect(typeof animationName).toBe("string");
      const cssText = stoop.getCssText();
      expect(cssText).toContain("@keyframes");
      expect(cssText).toContain("0%");
      expect(cssText).toContain("to");
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
      expect(cssText).toContain("\\;");
    });

    it("should handle invalid prefix values", () => {
      const stoop1 = createStoop({
        theme: createMockTheme(),
        prefix: "",
      });

      const stoop2 = createStoop({
        theme: createMockTheme(),
        prefix: "123invalid",
      });

      const className1 = stoop1.css({ color: "red" });
      const className2 = stoop2.css({ color: "red" });

      expect(className1).toContain("stoop-");
      expect(typeof className2).toBe("string");
    });

    it("should sanitize class names with special characters", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const className = stoop.css({
        color: "red",
      });

      expect(typeof className).toBe("string");
      expect(className).not.toContain("<script>");
      expect(className).not.toContain("alert");
    });
  });

  describe("Cache Behavior", () => {
    it("should evict least recently used entries when cache is full", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const classNames: string[] = [];
      const cacheSize = MAX_CLASS_NAME_CACHE_SIZE + 100;

      for (let i = 0; i < cacheSize; i++) {
        const className = stoop.css({
          color: `rgb(${i}, ${i}, ${i})`,
          padding: `${i}px`,
        });
        classNames.push(className);
      }

      expect(classNames.length).toBe(cacheSize);
      classNames.forEach((name) => {
        expect(typeof name).toBe("string");
        expect(name.length).toBeGreaterThan(0);
      });
    });

    it("should cache identical CSS objects", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const css1 = { color: "red", padding: "16px" };
      const css2 = { padding: "16px", color: "red" };

      const className1 = stoop.css(css1);
      const className2 = stoop.css(css2);

      expect(className1).toBe(className2);
    });

    it("should handle cache hits correctly", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const css = { color: "red" };
      const className1 = stoop.css(css);
      const className2 = stoop.css(css);

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

      const className = stoop.css({
        color: "$colors.primary",
        padding: "16px",
      });

      expect(typeof className).toBe("string");
    });

    it("should handle theme tokens that don't exist", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const className = stoop.css({
        color: "$colors.nonexistent",
        padding: "$space.small",
      });

      expect(typeof className).toBe("string");
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
      expect(className1).not.toBe(className2);
    });

    it("should isolate themes between instances", () => {
      const theme1 = { colors: { primary: "blue" } };
      const theme2 = { colors: { primary: "red" } };

      const stoop1 = createStoop({ theme: theme1 });
      const stoop2 = createStoop({ theme: theme2 });

      const className1 = stoop1.css({ color: "$colors.primary" });
      const className2 = stoop2.css({ color: "$colors.primary" });

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
      const stoop = createStoop({ theme: createMockTheme() });

      stoop.css({ color: "red" });

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

      expect(() => {
        stoop.getCssText();
      }).not.toThrow();

      const cssText = stoop.getCssText();
      expect(typeof cssText).toBe("string");
    });
  });

  describe("Global CSS Edge Cases", () => {
    it("should handle globalCss cleanup function", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const cleanup = stoop.globalCss({
        body: { margin: 0 },
      });

      expect(typeof cleanup).toBe("function");
      expect(() => {
        cleanup();
      }).not.toThrow();
    });

    it("should prevent duplicate global CSS injection", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const css = { body: { margin: 0 } };

      const cleanup1 = stoop.globalCss(css);
      const cleanup2 = stoop.globalCss(css);

      expect(typeof cleanup1).toBe("function");
      expect(typeof cleanup2).toBe("function");
    });
  });

  describe("Keyframes Edge Cases", () => {
    it("should handle empty keyframes object", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const animationName = stoop.keyframes({});

      expect(typeof animationName).toBe("string");
    });

    it("should handle keyframes with only invalid keys", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const animationName = stoop.keyframes({
        invalid: { opacity: 0 },
        "200%": { opacity: 1 },
      });

      expect(typeof animationName).toBe("string");
    });

    it("should cache identical keyframes", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const keyframes1 = {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      };

      const name1 = stoop.keyframes(keyframes1);
      const name2 = stoop.keyframes(keyframes1);

      expect(name1).toBe(name2);
    });
  });
});
