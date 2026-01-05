import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../src/provider";

describe("ThemeProvider", () => {
  beforeEach(() => {
    // Clear localStorage
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
    // Clear data-theme
    if (typeof document !== "undefined") {
      document.documentElement.removeAttribute("data-theme");
    }
  });

  it("provides default theme", () => {
    const TestComponent = () => {
      const { theme } = useTheme();
      return <div data-testid="theme">{theme}</div>;
    };

    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("sets data-theme attribute on document", () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <div>Test</div>
      </ThemeProvider>,
    );

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("persists theme to localStorage", () => {
    const TestComponent = () => {
      const { setTheme } = useTheme();
      return <button onClick={() => setTheme("dark")}>Switch</button>;
    };

    const { getByText } = render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>,
    );

    getByText("Switch").click();

    expect(localStorage.getItem("test-theme")).toBe("dark");
  });

  it("throws error when useTheme used outside provider", () => {
    const TestComponent = () => {
      useTheme();
      return null;
    };

    expect(() => render(<TestComponent />)).toThrow("useTheme must be used within ThemeProvider");
  });

  it("loads theme from localStorage on mount", () => {
    localStorage.setItem("test-theme", "dark");

    const TestComponent = () => {
      const { theme } = useTheme();
      return <div data-testid="theme">{theme}</div>;
    };

    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });
});
