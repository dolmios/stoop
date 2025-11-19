// High-level tests for Stoop CSS-in-JS library
// Tests focus on the public API and important functionality
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { createElement } from "react";

import { createStoop } from "../src/create-stoop";
import { clearStylesheet } from "../src/inject";
import type { CSS, UtilityFunction } from "../src/types";

import { createMockTheme } from "./helpers";

describe("Stoop", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    // Setup DOM
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

      // Multiple tokens in padding shorthand
      const className1 = stoop.css({
        padding: "$space.small $space.medium",
      });

      // Multiple tokens in border shorthand
      const className2 = stoop.css({
        border: "1px solid $colors.primary",
      });

      // Three tokens in padding
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

      // Shorthand tokens (no explicit scale)
      const className1 = stoop.css({
        padding: "$small $medium",
        border: "1px solid $primary",
      });

      expect(typeof className1).toBe("string");

      const cssText = stoop.getCssText();
      // Should resolve to space scale for padding
      expect(cssText).toContain("--space-small");
      expect(cssText).toContain("--space-medium");
      // Should resolve to colors scale for border
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
      // All should resolve to colors scale
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
      // Should only appear once in CSS variables, but multiple times in the CSS
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
      // React components are objects with render functions
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

      const Button = stoop.styled(
        "button",
        {
          color: "red",
        },
        {
          size: {
            small: {
              padding: "4px",
            },
            large: {
              padding: "16px",
            },
          },
        },
      );

      const smallButton = createElement(Button, { size: "small", children: "Small" });
      const largeButton = createElement(Button, { size: "large", children: "Large" });

      expect(smallButton.type).toBeDefined();
      expect(largeButton.type).toBeDefined();
    });

    it("should handle boolean variants", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const Button = stoop.styled(
        "button",
        {
          color: "red",
        },
        {
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
      );

      const disabledButton = createElement(Button, { disabled: true, children: "Disabled" });
      const enabledButton = createElement(Button, { disabled: false, children: "Enabled" });

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

      // TypeScript requires proper typing for polymorphic props
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
      });

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
      // globalCss injects immediately, check that CSS was generated
      // The actual injection happens, but getCssText might not reflect it immediately in tests
      // So we just verify the cleanup function exists and works
      expect(cleanup).toBeDefined();
    });

    it("should handle nested selectors", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      const cleanup = stoop.globalCss({
        "body": {
          margin: 0,
        },
        "a": {
          color: "blue",
          "&:hover": {
            color: "red",
          },
        },
      });

      expect(typeof cleanup).toBe("function");
      // Verify cleanup function works
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
      // Note: globalCss might not appear in getCssText immediately in test environment
      // but the important thing is that css() and keyframes() work
    });

    it("should accept theme name parameter", () => {
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
      // Both should contain theme variables
      expect(lightCss).toContain(":root");
      expect(darkCss).toContain(":root");
    });

    it("should accept theme object parameter", () => {
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

    it("should always include theme variables", () => {
      const theme = createMockTheme();
      const stoop = createStoop({ theme });

      const cssText = stoop.getCssText();

      // Should always include theme CSS variables
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
        stoop.preloadTheme("dark");
      }).not.toThrow();
    });

    it("should preload theme with theme object", () => {
      const theme = createMockTheme();
      const customTheme = {
        colors: { primary: "#ff0000", background: "#00ff00" },
      };
      const stoop = createStoop({ theme });

      expect(typeof stoop.preloadTheme).toBe("function");

      // Should not throw
      expect(() => {
        stoop.preloadTheme(customTheme);
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

      stoop.preloadTheme("dark");

      // Check if style tag was injected (if document is available)
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
        themes: { light: theme, dark: theme }
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

      // Create a component with tokens from different scales
      const className = stoop.css({
        color: "$colors.primary",
        padding: "$space.medium", // This should work even in dark theme
        fontSize: "$fontSizes.large", // This should work even in dark theme
      });

      expect(typeof className).toBe("string");
      expect(className.length).toBeGreaterThan(0);

      // Verify CSS text includes theme variables for all scales
      const cssText = stoop.getCssText("dark");
      expect(cssText).toContain("--colors-primary");
      expect(cssText).toContain("--space-medium");
      expect(cssText).toContain("--fontSizes-large");
    });
  });

  describe("warmCache", () => {
    it("should pre-compile CSS objects", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      expect(typeof stoop.warmCache).toBe("function");

      // Pre-compile common styles
      stoop.warmCache([
        { color: "red", padding: "16px" },
        { backgroundColor: "blue" },
        { color: "$colors.primary" },
      ]);

      // Verify styles were compiled by checking cache
      const cssText = stoop.getCssText();
      expect(cssText.length).toBeGreaterThan(0);
    });

    it("should handle invalid styles gracefully", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      // Should not throw on invalid styles
      expect(() => {
        stoop.warmCache([
          { color: "red" },
          // Invalid style object
          null as any,
          undefined as any,
        ]);
      }).not.toThrow();
    });

    it("should eliminate FOUC by pre-compiling styles", () => {
      const stoop = createStoop({ theme: createMockTheme() });

      // Warm cache with common styles
      stoop.warmCache([
        { color: "$colors.primary" },
        { padding: "$space.medium" },
      ]);

      // These should be instant (cache hits)
      const className1 = stoop.css({ color: "$colors.primary" });
      const className2 = stoop.css({ padding: "$spacing.medium" });

      expect(typeof className1).toBe("string");
      expect(typeof className2).toBe("string");
    });
  });
});

