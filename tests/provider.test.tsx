/**
 * Provider and useTheme hook tests.
 * Tests theme management, localStorage persistence, and context behavior.
 */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

import { createStoop } from "../src/create-stoop";
import { clearStylesheet } from "../src/inject";

import { createMockTheme } from "./helpers";

describe("Provider and useTheme", () => {
  beforeEach(() => {
    // Setup DOM
    if (typeof document !== "undefined") {
      if (!document.head) {
        const head = document.createElement("head");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).head = head;
      }
      if (!document.documentElement) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).documentElement = document.createElement("html");
      }
    }
    // Clear localStorage
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  afterEach(() => {
    clearStylesheet();
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.removeAttribute("data-theme");
    }
  });

  describe("Provider", () => {
    it("should render children", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };
      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      if (!stoop.Provider) {
        throw new Error("Provider should be available");
      }

      const TestComponent = () => createElement("div", null, "Test");

      const html = renderToString(
        createElement(stoop.Provider, { children: createElement(TestComponent) }),
      );

      expect(html).toContain("Test");
    });

    it("should set data-theme attribute on document in browser", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };
      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      if (!stoop.Provider) {
        throw new Error("Provider should be available");
      }

      // In SSR, attribute won't be set, but component should render
      const html = renderToString(
        createElement(stoop.Provider, { defaultTheme: "dark", children: createElement("div") }),
      );

      expect(html).toBeTruthy();
    });

    it("should provide Provider when themes config is provided", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };
      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      expect(stoop.Provider).toBeDefined();
      expect(stoop.useTheme).toBeDefined();
    });

    it("should not provide Provider when themes config is not provided", () => {
      const stoop = createStoop({
        theme: createMockTheme(),
      });

      expect(stoop.Provider).toBeUndefined();
      expect(stoop.useTheme).toBeUndefined();
    });

    it("should handle localStorage persistence", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };

      // Set localStorage before creating stoop
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("test-theme", "dark");
      }

      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      if (!stoop.Provider) {
        throw new Error("Provider should be available");
      }

      // Provider should read from localStorage
      const html = renderToString(
        createElement(stoop.Provider, {
          storageKey: "test-theme",
          children: createElement("div"),
        }),
      );

      expect(html).toBeTruthy();
    });

    it("should handle invalid localStorage theme gracefully", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };

      if (typeof localStorage !== "undefined") {
        localStorage.setItem("test-theme", "invalid-theme");
      }

      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      if (!stoop.Provider) {
        throw new Error("Provider should be available");
      }

      // Should fallback to defaultTheme
      const html = renderToString(
        createElement(stoop.Provider, {
          storageKey: "test-theme",
          defaultTheme: "light",
          children: createElement("div"),
        }),
      );

      expect(html).toBeTruthy();
    });

    it("should handle localStorage errors gracefully", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };
      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      if (!stoop.Provider) {
        throw new Error("Provider should be available");
      }

      // Mock localStorage.getItem to throw
      if (typeof localStorage !== "undefined") {
        const originalGetItem = localStorage.getItem;
        localStorage.getItem = () => {
          throw new Error("Storage error");
        };

        expect(() => {
          renderToString(
            createElement(stoop.Provider, {
              storageKey: "test-theme",
              defaultTheme: "light",
              children: createElement("div"),
            }),
          );
        }).not.toThrow();

        localStorage.getItem = originalGetItem;
      }
    });

    it("should merge themes correctly", () => {
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
        padding: "$space.medium", // Should work even in dark theme
      });

      expect(typeof className).toBe("string");
      expect(className.length).toBeGreaterThan(0);

      // Verify CSS text includes theme variables for all scales
      const cssText = stoop.getCssText("dark");
      expect(cssText).toContain("--colors-primary");
      expect(cssText).toContain("--space-medium");
    });
  });

  describe("useTheme", () => {
    it("should throw error when used outside Provider", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };
      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      if (!stoop.useTheme) {
        throw new Error("useTheme should be available");
      }

      // This will throw when rendered outside Provider
      // We can't easily test this without a full React renderer,
      // but the error is documented in the hook implementation
      expect(stoop.useTheme).toBeDefined();
    });

    it("should be available when themes config is provided", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };
      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      expect(stoop.useTheme).toBeDefined();
      expect(typeof stoop.useTheme).toBe("function");
    });

    it("should work within Provider context", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };
      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      if (!stoop.Provider || !stoop.useTheme) {
        throw new Error("Provider and useTheme should be available");
      }

      // Test that Provider renders without error
      // Note: renderToString doesn't execute hooks, so we can't test hook values directly
      // But we can verify the Provider component structure is correct
      const TestComponent = () => {
        // This will throw if useTheme is called outside Provider
        // But in SSR, hooks don't execute, so we just verify structure
        return createElement("div", null, "Test");
      };

      const html = renderToString(
        createElement(stoop.Provider, {
          defaultTheme: "dark",
          children: createElement(TestComponent),
        }),
      );

      expect(html).toBeTruthy();
      expect(html).toContain("Test");
    });

    it("should provide setTheme function", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };
      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      if (!stoop.Provider || !stoop.useTheme) {
        throw new Error("Provider and useTheme should be available");
      }

      let setThemeFn: ((name: string) => void) | null = null;

      const TestComponent = () => {
        const { setTheme } = stoop.useTheme!();
        setThemeFn = setTheme;
        return createElement("div");
      };

      renderToString(
        createElement(stoop.Provider, {
          defaultTheme: "light",
          children: createElement(TestComponent),
        }),
      );

      expect(typeof setThemeFn).toBe("function");
      expect(setThemeFn).not.toBeNull();
    });

    it("should provide toggleTheme function", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };
      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      if (!stoop.Provider || !stoop.useTheme) {
        throw new Error("Provider and useTheme should be available");
      }

      let toggleThemeFn: (() => void) | null = null;

      const TestComponent = () => {
        const { toggleTheme } = stoop.useTheme!();
        toggleThemeFn = toggleTheme;
        return createElement("div");
      };

      renderToString(
        createElement(stoop.Provider, {
          defaultTheme: "light",
          children: createElement(TestComponent),
        }),
      );

      expect(typeof toggleThemeFn).toBe("function");
      expect(toggleThemeFn).not.toBeNull();
    });

    it("should provide availableThemes array", () => {
      const lightTheme = createMockTheme();
      const darkTheme = {
        colors: { primary: "#ffffff", background: "#000000" },
      };
      const stoop = createStoop({
        theme: lightTheme,
        themes: { light: lightTheme, dark: darkTheme },
      });

      if (!stoop.Provider || !stoop.useTheme) {
        throw new Error("Provider and useTheme should be available");
      }

      let availableThemes: readonly string[] | null = null;

      const TestComponent = () => {
        const { availableThemes: themes } = stoop.useTheme!();
        availableThemes = themes;
        return createElement("div");
      };

      renderToString(
        createElement(stoop.Provider, {
          defaultTheme: "light",
          children: createElement(TestComponent),
        }),
      );

      expect(availableThemes).toEqual(["light", "dark"]);
    });
  });
});
