/**
 * High-level tests for Stoop CSS-in-JS library.
 * Tests focus on the public API and important functionality.
 */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { createElement } from "react";

import { createStoop } from "../src/create-stoop";
import { clearStylesheet } from "../src/inject";
import type { CSS, CSSWithVariants, UtilityFunction } from "../src/types";

import { createMockTheme } from "./helpers";

describe("Stoop", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    if (typeof document !== "undefined") {
      if (!document.head) {
        const head = document.createElement("head");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).head = head;
      }
      if (!document.body) {
        const body = document.createElement("body");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).body = body;
      }
      container = document.createElement("div");
      if (document.body) {
        document.body.appendChild(container);
      }
    }
  });

  afterEach(() => {
    clearStylesheet();
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe("createStoop", () => {
    it("should create a Stoop instance with all APIs", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      expect(stoop).toBeDefined();
      expect(typeof stoop.css).toBe("function");
      expect(typeof stoop.styled).toBe("function");
      expect(typeof stoop.createTheme).toBe("function");
      expect(typeof stoop.globalCss).toBe("function");
      expect(typeof stoop.keyframes).toBe("function");
      expect(typeof stoop.getCssText).toBe("function");
      expect(stoop.theme).toBeDefined();
    });

    it("should preserve theme object", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      expect(stoop.theme).toEqual(theme);
      expect((stoop.theme.colors as { primary: string }).primary).toBe("#0070f3");
    });
  });

  describe("css", () => {
    it("should generate CSS class names", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const className = stoop.css({
        color: "red",
        padding: "16px",
      });

      expect(typeof className).toBe("string");
      expect(className.length).toBeGreaterThan(0);
    });

    it("should handle theme tokens", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      const className = stoop.css({
        color: "$colors.primary",
        backgroundColor: "$colors.background",
      });

      expect(typeof className).toBe("string");
      expect(className.length).toBeGreaterThan(0);
    });

    it("should handle complex values with multiple tokens", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      const className1 = stoop.css({
        padding: "$space.small $space.medium",
      });

      const className2 = stoop.css({
        border: "1px solid $colors.primary",
      });

      const className3 = stoop.css({
        padding: "$space.small $space.medium $space.large",
      });

      expect(typeof className1).toBe("string");
      expect(typeof className2).toBe("string");
      expect(typeof className3).toBe("string");

      const cssText = stoop.getCssText();
      expect(cssText).toContain("--space-small");
      expect(cssText).toContain("--space-medium");
      expect(cssText).toContain("--colors-primary");
    });

    it("should handle shorthand tokens in complex values", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      const className1 = stoop.css({
        padding: "$small $medium",
        border: "1px solid $primary",
      });

      expect(typeof className1).toBe("string");

      const cssText = stoop.getCssText();
      expect(cssText).toContain("--space-small");
      expect(cssText).toContain("--space-medium");
      expect(cssText).toContain("--colors-primary");
    });

    it("should handle tokens in nested selectors", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      const className = stoop.css({
        border: "1px solid $colors.primary",
        "&:hover": {
          border: "2px solid $colors.secondary",
          padding: "$space.small $space.medium",
        },
        "&:focus": {
          outline: "2px solid $primary",
        },
      });

      expect(typeof className).toBe("string");

      const cssText = stoop.getCssText();
      expect(cssText).toContain("--colors-primary");
      expect(cssText).toContain("--colors-secondary");
      expect(cssText).toContain("--space-small");
      expect(cssText).toContain("--space-medium");
    });

    it("should handle negative margins with shorthand tokens", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      const className = stoop.css({
        marginTop: "-$small",
        marginLeft: "-$medium",
      });

      expect(typeof className).toBe("string");

      const cssText = stoop.getCssText();
      expect(cssText).toContain("calc(-1 * var(--space-small)");
      expect(cssText).toContain("calc(-1 * var(--space-medium)");
    });

    it("should handle multiple tokens in box-shadow", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      const className = stoop.css({
        boxShadow: "0 0 0 2px $primary, 0 4px 8px $subtle",
      });

      expect(typeof className).toBe("string");

      const cssText = stoop.getCssText();
      expect(cssText).toContain("var(--colors-primary)");
      expect(cssText).toContain("var(--shadows-subtle)");
    });

    it("should handle shorthand tokens in nested selectors with complex values", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      const className = stoop.css({
        padding: "$medium",
        "&:hover": {
          backgroundColor: "$hover",
          border: "1px solid $border",
          padding: "$large",
        },
        "&:focus": {
          outline: "2px solid $primary",
          outlineOffset: "$small",
        },
      });

      expect(typeof className).toBe("string");

      const cssText = stoop.getCssText();
      expect(cssText).toContain("var(--space-medium)");
      expect(cssText).toContain("var(--colors-hover)");
      expect(cssText).toContain("var(--colors-border)");
      expect(cssText).toContain("var(--space-large)");
      expect(cssText).toContain("var(--colors-primary)");
      expect(cssText).toContain("var(--space-small)");
    });

    it("should handle tokens in media queries", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      const className = stoop.css({
        padding: "$space.small",
        "@media (min-width: 768px)": {
          padding: "$space.medium",
          border: "1px solid $colors.primary",
        },
      });

      expect(typeof className).toBe("string");

      const cssText = stoop.getCssText();
      expect(cssText).toContain("--space-small");
      expect(cssText).toContain("--space-medium");
      expect(cssText).toContain("--colors-primary");
      expect(cssText).toContain("@media");
    });

    it("should handle mixed explicit and shorthand tokens", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      const className = stoop.css({
        padding: "$space.small $medium", // Mixed explicit and shorthand
        border: "1px solid $colors$primary", // Alternative syntax
      });

      expect(typeof className).toBe("string");

      const cssText = stoop.getCssText();
      expect(cssText).toContain("--space-small");
      expect(cssText).toContain("--space-medium");
      expect(cssText).toContain("--colors-primary");
    });

    it("should handle tokens in complex border values", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      const className = stoop.css({
        border: "1px solid $primary",
        borderTop: "2px dashed $secondary",
        outline: "3px solid $primary",
      });

      expect(typeof className).toBe("string");

      const cssText = stoop.getCssText();
      expect(cssText).toContain("--colors-primary");
      expect(cssText).toContain("--colors-secondary");
    });

    it("should handle edge case: same token multiple times", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      const className = stoop.css({
        padding: "$small $small $small $small",
        border: "1px solid $primary",
        boxShadow: "0 0 0 1px $primary",
      });

      expect(typeof className).toBe("string");

      const cssText = stoop.getCssText();
      expect(cssText).toContain("--space-small");
      expect(cssText).toContain("--colors-primary");
    });

    it("should handle nested CSS", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const className = stoop.css({
        color: "red",
        "&:hover": {
          color: "blue",
        },
      });

      expect(typeof className).toBe("string");
      const cssText = stoop.getCssText();
      expect(cssText).toContain(":hover");
    });

    it("should handle prefix", () => {
      const stoop = createStoop({
        theme: createMockTheme(),
        prefix: "test",
      });

      const className = stoop.css({
        color: "red",
      });

      expect(className).toContain("test-");
    });

    it("should handle media queries", () => {
      const stoop = createStoop({
        theme: createMockTheme(),
        media: {
          mobile: "@media (max-width: 768px)",
        },
      });

      const className = stoop.css({
        padding: "8px",
        mobile: {
          padding: "16px",
        },
      });

      expect(typeof className).toBe("string");
      const cssText = stoop.getCssText();
      expect(cssText).toContain("@media (max-width: 768px)");
    });

    it("should handle utility functions", () => {
      const stoop = createStoop({
        theme: createMockTheme(),
        utils: {
          px: (value: string | number | CSS | undefined) => {
            const val = typeof value === "string" || typeof value === "number" ? String(value) : "";
            return {
              paddingLeft: val,
              paddingRight: val,
            };
          },
        } as Record<string, UtilityFunction>,
      });

      const className = stoop.css({
        px: "16px",
      });

      expect(typeof className).toBe("string");
      const cssText = stoop.getCssText();
      expect(cssText).toContain("padding-left");
      expect(cssText).toContain("padding-right");
    });
  });

  describe("styled", () => {
    it("should create styled components", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const Button = stoop.styled("button", {
        color: "red",
        padding: "16px",
      });

      expect(Button).toBeDefined();
      expect(Button).toBeTypeOf("object");
      expect((Button as any).render || Button).toBeDefined();
    });

    it("should render styled components", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const Button = stoop.styled("button", {
        color: "red",
      });

      const element = createElement(Button, { children: "Click me" });
      expect(element.type).toBeDefined();
    });

    it("should handle variants", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const Button = stoop.styled("button", {
        color: "red",
        variants: {
          size: {
            small: {
              padding: "4px",
            },
            large: {
              padding: "16px",
            },
          },
        },
      } as CSSWithVariants);

      const smallButton = createElement(Button, { size: "small", children: "Small" });
      const largeButton = createElement(Button, { size: "large", children: "Large" });

      expect(smallButton.type).toBeDefined();
      expect(largeButton.type).toBeDefined();
    });

    it("should handle boolean variants", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const Button = stoop.styled("button", {
        color: "red",
        variants: {
          disabled: {
            true: {
              opacity: "0.5",
              cursor: "not-allowed",
            },
            false: {
              opacity: "1",
            },
          },
        },
      } as CSSWithVariants);

      const disabledButton = createElement(Button, { disabled: "true", children: "Disabled" });
      const enabledButton = createElement(Button, { disabled: "false", children: "Enabled" });

      expect(disabledButton.type).toBeDefined();
      expect(enabledButton.type).toBeDefined();
    });

    it("should handle css prop", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const Button = stoop.styled("button", {
        color: "red",
      });

      const element = createElement(Button, {
        css: {
          padding: "16px",
        },
        children: "Click me",
      });

      expect(element.type).toBeDefined();
    });

    it("should handle as prop for polymorphism", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const Button = stoop.styled("button", {
        color: "red",
      });

      const asDiv = createElement(Button, { as: "div" } as any, "As div");
      const asAnchor = createElement(Button, { as: "a" } as any, "As anchor");

      expect(asDiv.type).toBeDefined();
      expect(asAnchor.type).toBeDefined();
    });

    it("should handle className prop", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const Button = stoop.styled("button", {
        color: "red",
      });

      const element = createElement(Button, {
        className: "custom-class",
        children: "Click me",
      });

      expect(element.type).toBeDefined();
    });

    it("should handle embedded variants", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const Button = stoop.styled("button", {
        color: "red",
        variants: {
          size: {
            small: {
              padding: "4px",
            },
            large: {
              padding: "16px",
            },
          },
        },
      } as CSSWithVariants);

      const element = createElement(Button, { size: "small", children: "Small" });
      expect(element.type).toBeDefined();
    });

    it("should handle component targeting", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const Button = stoop.styled("button", {
        color: "red",
      });

      const Container = stoop.styled("div", {
        [Button.selector.toString()]: {
          marginTop: "8px",
        },
      });

      const containerElement = createElement(Container, { children: "Container" });
      expect(containerElement.type).toBeDefined();
    });
  });

  describe("globalCss", () => {
    it("should inject global CSS", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const cleanup = stoop.globalCss({
        body: {
          margin: 0,
          padding: 0,
        },
      });

      expect(typeof cleanup).toBe("function");
      expect(cleanup).toBeDefined();
    });

    it("should handle nested selectors", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const cleanup = stoop.globalCss({
        body: {
          margin: 0,
        },
        a: {
          color: "blue",
          "&:hover": {
            color: "red",
          },
        },
      });

      expect(typeof cleanup).toBe("function");
      expect(cleanup).toBeDefined();
    });

    it("should handle media queries in global CSS", () => {
      const stoop = createStoop({
        theme: createMockTheme(),
        media: {
          mobile: "@media (max-width: 768px)",
        },
      });

      const cleanup = stoop.globalCss({
        body: {
          padding: "16px",
          mobile: {
            padding: "8px",
          },
        },
      });

      expect(typeof cleanup).toBe("function");
      expect(cleanup).toBeDefined();
    });
  });

  describe("keyframes", () => {
    it("should create keyframes animations", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const animationName = stoop.keyframes({
        "0%": {
          opacity: 0,
        },
        "100%": {
          opacity: 1,
        },
      });

      expect(typeof animationName).toBe("string");
      expect(animationName.length).toBeGreaterThan(0);
    });

    it("should handle theme tokens in keyframes", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      const animationName = stoop.keyframes({
        from: {
          opacity: 0,
          transform: "translateY($space.small)",
        },
        to: {
          opacity: 1,
          transform: "translateY(0)",
        },
      });

      expect(typeof animationName).toBe("string");

      const cssText = stoop.getCssText();
      expect(cssText).toContain("@keyframes");
      expect(cssText).toContain("--space-small");
    });

    it("should handle shorthand tokens in keyframes", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      const animationName = stoop.keyframes({
        from: {
          backgroundColor: "$primary",
          transform: "translateX($small)",
        },
        to: {
          backgroundColor: "$secondary",
          transform: "translateX(0)",
        },
      });

      expect(typeof animationName).toBe("string");

      const cssText = stoop.getCssText();
      expect(cssText).toContain("@keyframes");
      expect(cssText).toContain("--colors-primary");
      expect(cssText).toContain("--colors-secondary");
      expect(cssText).toContain("--space-small");
    });

    it("should inject keyframes CSS", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const animationName = stoop.keyframes({
        "0%": {
          transform: "translateY(0)",
        },
        "100%": {
          transform: "translateY(-10px)",
        },
      });

      const cssText = stoop.getCssText();
      expect(cssText).toContain("@keyframes");
      expect(cssText).toContain(animationName);
    });

    it("should handle prefix in keyframes", () => {
      const stoop = createStoop({
        theme: createMockTheme(),
        prefix: "test",
      });

      const animationName = stoop.keyframes({
        "0%": {
          opacity: 0,
        },
        "100%": {
          opacity: 1,
        },
      });

      expect(animationName).toContain("test-");
    });
  });

  describe("createTheme", () => {
    it("should extend base theme", () => {
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

    it("should deep merge theme objects", () => {
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
  });

  describe("getCssText", () => {
    it("should return CSS text", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      stoop.css({
        color: "red",
      });

      const cssText = stoop.getCssText();
      expect(typeof cssText).toBe("string");
      expect(cssText.length).toBeGreaterThan(0);
    });

    it("should include all generated CSS", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      stoop.css({ color: "red" });
      stoop.css({ color: "blue" });
      stoop.globalCss({ body: { margin: 0 } });
      stoop.keyframes({
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      });

      const cssText = stoop.getCssText();
      expect(cssText).toContain("color");
      expect(cssText).toContain("@keyframes");
    });

    it("should include all themes in getCssText", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };
      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      stoop.css({ color: "$colors.primary" });

      // getCssText now always includes all themes using attribute selectors
      // Theme parameter is deprecated but kept for backward compatibility
      const css = stoop.getCssText();

      expect(typeof css).toBe("string");
      expect(css.length).toBeGreaterThan(0);
      expect(css).toContain('[data-theme="light"]');
      expect(css).toContain('[data-theme="dark"]');
    });

    it("should accept theme object parameter", () => {
      const theme = createMockTheme();
      const customTheme = {
        colors: { primary: "#ff0000", background: "#00ff00" },
      };
      const stoop = createStoop({ theme });

      stoop.css({ color: "$colors.primary" });

      const cssText = stoop.getCssText();

      expect(typeof cssText).toBe("string");
      expect(cssText.length).toBeGreaterThan(0);
      expect(cssText).toContain(":root");
    });

    it("should always include theme variables", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      const cssText = stoop.getCssText();

      expect(cssText).toContain(":root");
      expect(cssText).toContain("--colors-primary");
    });
  });

  describe("preloadTheme", () => {
    it("should preload theme with theme name", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };
      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      expect(typeof stoop.preloadTheme).toBe("function");

      // Should not throw
      expect(() => {
        stoop.preloadTheme();
      }).not.toThrow();
    });

    it("should preload theme with theme object", () => {
      const theme = createMockTheme();
      const customTheme = {
        colors: { primary: "#ff0000", background: "#00ff00" },
      };
      const stoop = createStoop({ theme });

      expect(typeof stoop.preloadTheme).toBe("function");

      expect(() => {
        stoop.preloadTheme();
      }).not.toThrow();
    });

    it("should inject theme variables into DOM", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };
      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      stoop.preloadTheme();

      if (typeof document !== "undefined") {
        const styleTags = document.querySelectorAll("style");
        expect(styleTags.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Provider and useTheme", () => {
    it("should provide Provider and useTheme when themes config is provided", () => {
      const theme = createMockTheme();
      const stoop = createStoop({
        theme,
        themes: { light: theme, dark: theme },
      });

      expect(stoop.Provider).toBeDefined();
      expect(stoop.useTheme).toBeDefined();
    });

    it("should not provide Provider and useTheme when themes config is not provided", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      expect(stoop.Provider).toBeUndefined();
      expect(stoop.useTheme).toBeUndefined();
    });

    it("should merge partial themes with default theme", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };
      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      const className = stoop.css({
        color: "$colors.primary",
        padding: "$space.medium",
        fontSize: "$fontSizes.large",
      });

      expect(typeof className).toBe("string");
      expect(className.length).toBeGreaterThan(0);

      const cssText = stoop.getCssText();
      expect(cssText).toContain("--colors-primary");
      expect(cssText).toContain("--space-medium");
      expect(cssText).toContain("--fontSizes-large");
    });
  });

  describe("warmCache", () => {
    it("should pre-compile CSS objects", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      expect(typeof stoop.warmCache).toBe("function");

      stoop.warmCache([
        { color: "red", padding: "16px" },
        { backgroundColor: "blue" },
        { color: "$colors.primary" },
      ]);

      const cssText = stoop.getCssText();
      expect(cssText.length).toBeGreaterThan(0);
    });

    it("should handle invalid styles gracefully", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      expect(() => {
        stoop.warmCache([{ color: "red" }, null as any, undefined as any]);
      }).not.toThrow();
    });

    it("should eliminate FOUC by pre-compiling styles", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      stoop.warmCache([{ color: "$colors.primary" }, { padding: "$space.medium" }]);

      const className1 = stoop.css({ color: "$colors.primary" });
      const className2 = stoop.css({ padding: "$spacing.medium" });

      expect(typeof className1).toBe("string");
      expect(typeof className2).toBe("string");
    });
  });
});
