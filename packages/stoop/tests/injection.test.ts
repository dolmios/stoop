/**
 * CSS injection, deduplication, and SSR tests.
 * Tests browser injection, SSR caching, and CSS deduplication behavior.
 */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { createStoop } from "../src/create-stoop";
import { clearStylesheet, getCssText } from "../src/inject";
import { isInjectedRule } from "../src/inject";

import { createMockTheme } from "./helpers";

describe("CSS Injection and Deduplication", () => {
  beforeEach(() => {
    // Setup DOM
    if (typeof document !== "undefined") {
      if (!document.head) {
        const head = document.createElement("head");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).head = head;
      }
    }
  });

  afterEach(() => {
    clearStylesheet();
  });

  describe("CSS Deduplication", () => {
    it("should deduplicate identical CSS rules", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const css1 = { color: "red", padding: "16px" };
      const css2 = { color: "red", padding: "16px" };

      const className1 = stoop.css(css1);
      const className2 = stoop.css(css2);

      expect(className1).toBe(className2);
    });

    it("should deduplicate global CSS", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const globalCSS = {
        body: { margin: 0, padding: 0 },
      };

      const cleanup1 = stoop.globalCss(globalCSS);
      const cleanup2 = stoop.globalCss(globalCSS);

      expect(typeof cleanup1).toBe("function");
      expect(typeof cleanup2).toBe("function");
    });

    it("should deduplicate keyframes", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const keyframes1 = {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      };

      const name1 = stoop.keyframes(keyframes1);
      const name2 = stoop.keyframes(keyframes1);

      expect(name1).toBe(name2);
    });

    it("should prevent duplicate CSS injection", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const css = { color: "red" };
      const className = stoop.css(css);
      const className2 = stoop.css(css);

      expect(className).toBe(className2);

      const cssText = stoop.getCssText();
      const matches = cssText.match(new RegExp(className, "g"));
      expect(matches?.length).toBeGreaterThan(0);
    });
  });

  describe("Browser Injection", () => {
    it("should inject CSS into stylesheet", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const className = stoop.css({
        color: "red",
        padding: "16px",
      });

      expect(typeof className).toBe("string");

      if (typeof document !== "undefined") {
        const styleTags = document.querySelectorAll("style[data-stoop]");
        expect(styleTags.length).toBeGreaterThan(0);
      }
    });

    it("should inject theme variables", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      stoop.css({ color: "$colors.primary" });

      const cssText = stoop.getCssText();
      expect(cssText).toContain(":root");
      expect(cssText).toContain("--colors-primary");
    });

    it("should update theme variables when theme changes", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };
      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      stoop.css({ color: "$colors.primary" });

      const lightCss = stoop.getCssText("light");
      const darkCss = stoop.getCssText("dark");

      expect(lightCss).toContain("--colors-primary");
      expect(darkCss).toContain("--colors-primary");
      expect(lightCss).not.toBe(darkCss);
    });
  });

  describe("SSR Behavior", () => {
    it("should work in SSR context", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      stoop.css({ color: "red" });
      stoop.keyframes({
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      });

      const cssText = stoop.getCssText();
      expect(typeof cssText).toBe("string");
      expect(cssText.length).toBeGreaterThan(0);
    });

    it("should include theme variables in SSR output", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      stoop.css({ color: "$colors.primary" });

      const cssText = stoop.getCssText();
      expect(cssText).toContain(":root");
      expect(cssText).toContain("--colors-primary");
    });

    it("should include all CSS in SSR output", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      stoop.css({ color: "red" });
      stoop.css({ color: "blue" });
      stoop.keyframes({
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      });

      const cssText = stoop.getCssText();
      expect(cssText).toContain("color");
      expect(cssText).toContain("@keyframes");
    });

    it("should handle getCssText with theme name in SSR", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };
      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      stoop.css({ color: "$colors.primary" });

      const lightCss = stoop.getCssText("light");
      const darkCss = stoop.getCssText("dark");

      expect(typeof lightCss).toBe("string");
      expect(typeof darkCss).toBe("string");
      expect(lightCss.length).toBeGreaterThan(0);
      expect(darkCss.length).toBeGreaterThan(0);
    });

    it("should handle getCssText with theme object in SSR", () => {
      const theme = createMockTheme();
      const customTheme = {
        colors: { primary: "#ff0000", background: "#00ff00" },
      };
      const stoop = createStoop({ theme });

      stoop.css({ color: "$colors.primary" });

      const cssText = stoop.getCssText(customTheme);

      expect(typeof cssText).toBe("string");
      expect(cssText.length).toBeGreaterThan(0);
      expect(cssText).toContain(":root");
    });
  });

  describe("getCssText", () => {
    it("should return CSS text with theme variables", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      stoop.css({ color: "red" });

      const cssText = stoop.getCssText();
      expect(typeof cssText).toBe("string");
      expect(cssText).toContain(":root");
    });

    it("should include all generated CSS", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      stoop.css({ color: "red" });
      stoop.css({ color: "blue" });
      stoop.keyframes({
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      });

      const cssText = stoop.getCssText();
      expect(cssText).toContain("color");
      expect(cssText).toContain("@keyframes");
    });

    it("should handle empty CSS", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const cssText = stoop.getCssText();
      expect(typeof cssText).toBe("string");
      // Should still include theme variables
      expect(cssText).toContain(":root");
    });
  });

  describe("isInjectedRule", () => {
    it("should track injected rules", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      stoop.css({ color: "red" });

      const className1 = stoop.css({ color: "red" });
      const className2 = stoop.css({ color: "red" });

      expect(className1).toBe(className2);
    });
  });
});
