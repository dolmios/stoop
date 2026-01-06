/**
 * CSS Duplication Tests
 * Ensures CSS is not duplicated in SSR or browser contexts.
 * Tests deduplication mechanisms across all CSS generation paths.
 */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { createStoop } from "../src/create-stoop";
import { clearStylesheet, getCssText, getAllInjectedRules } from "../src/inject";

import { createMockTheme } from "./helpers";

/**
 * Counts occurrences of a CSS rule in the CSS text
 */
function countRuleOccurrences(cssText: string, className: string): number {
  const regex = new RegExp(`\\.${className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{`, "g");
  return (cssText.match(regex) || []).length;
}

/**
 * Finds classes with identical styles but different names
 */
function findIdenticalStyles(cssText: string): Array<{ classNames: string[]; styles: string }> {
  const ruleRegex = /\.([a-zA-Z][a-zA-Z0-9_-]*)\s*\{([^}]+)\}/g;
  const styleMap = new Map<string, string[]>();

  let match;
  while ((match = ruleRegex.exec(cssText)) !== null) {
    const className = match[1];
    const styles = match[2].trim();

    // Skip if it's clearly not a real class name
    if (!/^[a-zA-Z]/.test(className)) {
      continue;
    }

    // Normalize: sort properties for comparison
    const normalizedStyles = styles
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => {
        const [prop, ...valueParts] = s.split(":");
        if (!prop || valueParts.length === 0) return s;
        const value = valueParts.join(":").trim();
        return `${prop.trim()}: ${value}`;
      })
      .sort()
      .join("; ");

    if (!styleMap.has(normalizedStyles)) {
      styleMap.set(normalizedStyles, []);
    }
    styleMap.get(normalizedStyles)!.push(className);
  }

  return Array.from(styleMap.entries())
    .filter(([_, classNames]) => classNames.length > 1)
    .map(([styles, classNames]) => ({ classNames, styles }));
}

describe("CSS Duplication", () => {
  beforeEach(() => {
    if (typeof document !== "undefined" && !document.head) {
      const head = document.createElement("head");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (document as any).head = head;
    }
  });

  afterEach(() => {
    clearStylesheet();
  });

  describe("Basic Deduplication", () => {
    it("should deduplicate identical CSS rules", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const styles = { color: "red", padding: "16px" };
      const className1 = stoop.css(styles);
      const className2 = stoop.css(styles);

      expect(className1).toBe(className2);

      const cssText = stoop.getCssText();
      const occurrences = countRuleOccurrences(cssText, className1);
      expect(occurrences).toBe(1);
    });

    it("should handle many identical style calls without duplication", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const cardStyles = {
        backgroundColor: "white",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      };

      // Call the same styles 10 times
      const classNames: string[] = [];
      for (let i = 0; i < 10; i++) {
        classNames.push(stoop.css(cardStyles));
      }

      const uniqueClassNames = new Set(classNames);
      expect(uniqueClassNames.size).toBe(1);

      const cssText = stoop.getCssText();
      const className = classNames[0];
      const occurrences = countRuleOccurrences(cssText, className);
      expect(occurrences).toBe(1);
    });
  });

  describe("Cache Behavior", () => {
    it("should not inject CSS twice when cache hit occurs", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const styles = { color: "red", padding: "16px" };

      const className1 = stoop.css(styles);
      const rulesAfterFirst = getAllInjectedRules().size;

      const className2 = stoop.css(styles);
      const rulesAfterSecond = getAllInjectedRules().size;

      expect(className1).toBe(className2);
      expect(rulesAfterFirst).toBe(rulesAfterSecond);

      const cssText = stoop.getCssText();
      const occurrences = countRuleOccurrences(cssText, className1);
      expect(occurrences).toBe(1);
    });

    it("should verify deduplication key consistency", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const styles = { backgroundColor: "white", borderRadius: "8px" };

      const className1 = stoop.css(styles);
      const className2 = stoop.css(styles);

      expect(className1).toBe(className2);

      const cssText = stoop.getCssText();
      const identicalStyles = findIdenticalStyles(cssText);
      expect(identicalStyles.length).toBe(0);
    });
  });

  describe("Global CSS", () => {
    it("should not duplicate global CSS when called multiple times", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const globalStyles = {
        body: { margin: 0, padding: 0 },
        "*": { boxSizing: "border-box" },
      };

      stoop.globalCss(globalStyles);
      stoop.globalCss(globalStyles);
      stoop.globalCss(globalStyles);

      const cssText = stoop.getCssText();

      const bodyRuleRegex = /body\s*\{[^}]+\}/g;
      const bodyMatches = cssText.match(bodyRuleRegex) || [];

      const starRuleRegex = /\*\s*\{[^}]+\}/g;
      const starMatches = cssText.match(starRuleRegex) || [];

      expect(bodyMatches.length).toBeLessThanOrEqual(1);
      expect(starMatches.length).toBeLessThanOrEqual(1);
    });
  });

  describe("Theme Variables", () => {
    it("should not duplicate theme variable blocks", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };
      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      stoop.css({ color: "$colors.primary" });

      const cssText = stoop.getCssText();

      const lightThemeBlocks = (cssText.match(/\[data-theme="light"\]/g) || []).length;
      const darkThemeBlocks = (cssText.match(/\[data-theme="dark"\]/g) || []).length;
      const rootBlocks = (cssText.match(/:root\s*\{/g) || []).length;

      expect(lightThemeBlocks).toBe(1);
      expect(darkThemeBlocks).toBe(1);
      if (lightThemeBlocks > 0 || darkThemeBlocks > 0) {
        expect(rootBlocks).toBe(0);
      }
    });
  });

  describe("SSR Cache", () => {
    it("should not duplicate CSS in SSR cache", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const styles = { color: "blue", fontSize: "16px" };

      stoop.css(styles);
      stoop.css(styles);
      stoop.css(styles);

      const cssText = stoop.getCssText();
      const identicalStyles = findIdenticalStyles(cssText);

      expect(identicalStyles.length).toBe(0);
    });
  });

  describe("Identical Styles Detection", () => {
    it("should detect if identical styles generate different class names", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      // Create various styles
      stoop.css({ color: "red" });
      stoop.css({ color: "blue" });
      stoop.css({ padding: "16px" });
      stoop.css({ padding: "16px" }); // Duplicate

      stoop.globalCss({ body: { margin: 0 } });
      stoop.globalCss({ body: { margin: 0 } }); // Duplicate

      const cssText = stoop.getCssText();
      const identicalStyles = findIdenticalStyles(cssText);

      // Should have no identical styles with different class names
      expect(identicalStyles.length).toBe(0);
    });
  });

  describe("Browser Hydration", () => {
    it("should not duplicate CSS when stylesheet is reused", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      // Simulate SSR stylesheet
      if (typeof document !== "undefined") {
        const ssrStyle = document.createElement("style");
        ssrStyle.id = "stoop-ssr";
        ssrStyle.textContent = ".test { color: red; }";
        document.head.appendChild(ssrStyle);
      }

      // Generate CSS in browser
      stoop.css({ color: "blue" });

      const cssText = getCssText();

      // Count occurrences
      const testRuleCount = (cssText.match(/\.test\s*\{[^}]+\}/g) || []).length;
      const blueRuleCount = (cssText.match(/color:\s*blue/g) || []).length;

      // Should reuse SSR stylesheet, not duplicate
      expect(testRuleCount).toBeLessThanOrEqual(1);
      expect(blueRuleCount).toBeGreaterThan(0);
    });
  });
});
