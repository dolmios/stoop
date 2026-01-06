/**
 * Stability tests for class name consistency and rerender prevention.
 * These tests verify the fixes for hover/focus issues and unwanted rerenders.
 */

import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

import { createStoop } from "../src/create-stoop";

describe("Stability", () => {
  test("should generate stable class names across multiple renders", () => {
    const { styled } = createStoop({
      theme: {
        colors: {
          primary: "blue",
          secondary: "red",
        },
      },
    });

    const Button = styled("button", {
      color: "$primary",
      "&:hover": {
        color: "$secondary",
      },
    });

    const render1 = renderToString(createElement(Button, null, "Click me"));
    const render2 = renderToString(createElement(Button, null, "Click me"));
    const render3 = renderToString(createElement(Button, null, "Click me"));

    const classMatch1 = render1.match(/class="([^"]+)"/);
    const classMatch2 = render2.match(/class="([^"]+)"/);
    const classMatch3 = render3.match(/class="([^"]+)"/);

    expect(classMatch1).toBeTruthy();
    expect(classMatch2).toBeTruthy();
    expect(classMatch3).toBeTruthy();

    expect(classMatch1![1]).toBe(classMatch2![1]);
    expect(classMatch2![1]).toBe(classMatch3![1]);
  });

  test("should generate stable class names with variants", () => {
    const { styled } = createStoop({
      theme: {
        colors: {
          primary: "blue",
          secondary: "red",
        },
      },
    });

    const Button = styled("button", {
      color: "$primary",
      variants: {
        size: {
          small: { fontSize: "12px" },
          large: { fontSize: "16px" },
        },
      },
    });

    const render1 = renderToString(createElement(Button, { size: "small" }, "Click me"));
    const render2 = renderToString(createElement(Button, { size: "small" }, "Click me"));

    const classMatch1 = render1.match(/class="([^"]+)"/);
    const classMatch2 = render2.match(/class="([^"]+)"/);

    expect(classMatch1).toBeTruthy();
    expect(classMatch2).toBeTruthy();
    expect(classMatch1![1]).toBe(classMatch2![1]);
  });

  test("should generate deterministic class names for identical styles", () => {
    const { css } = createStoop({
      theme: {
        colors: {
          primary: "blue",
        },
      },
    });

    const class1 = css({ color: "$primary", fontSize: "16px" });
    const class2 = css({ color: "$primary", fontSize: "16px" });
    const class3 = css({ fontSize: "16px", color: "$primary" });

    expect(class1).toBe(class2);
    expect(class2).toBe(class3);
  });

  test("should handle theme changes without changing class names", () => {
    const { styled } = createStoop({
      theme: {
        colors: {
          primary: "blue",
        },
      },
      themes: {
        light: {
          colors: {
            primary: "blue",
          },
        },
        dark: {
          colors: {
            primary: "white",
          },
        },
      },
    });

    const Button = styled("button", {
      color: "$primary",
    });

    const render1 = renderToString(createElement(Button, null, "Click me"));
    const render2 = renderToString(createElement(Button, null, "Click me"));
    const render3 = renderToString(createElement(Button, null, "Click me"));

    const classMatch1 = render1.match(/class="([^"]+)"/);
    const classMatch2 = render2.match(/class="([^"]+)"/);
    const classMatch3 = render3.match(/class="([^"]+)"/);

    expect(classMatch1).toBeTruthy();
    expect(classMatch2).toBeTruthy();
    expect(classMatch3).toBeTruthy();

    expect(classMatch1![1]).toBe(classMatch2![1]);
    expect(classMatch2![1]).toBe(classMatch3![1]);
  });

  test("should generate stable selector class names", () => {
    const { styled } = createStoop({
      theme: {
        colors: {
          primary: "blue",
        },
      },
    });

    const Button = styled("button", {
      color: "$primary",
    });

    const Container = styled("div", {
      [Button.selector.toString()]: {
        margin: "10px",
      },
    });

    const render1 = renderToString(
      createElement(Container, null, createElement(Button, null, "Click")),
    );
    const render2 = renderToString(
      createElement(Container, null, createElement(Button, null, "Click")),
    );

    expect(render1).toBe(render2);
  });

  test("should handle pseudo-selectors consistently", () => {
    const { css } = createStoop({
      theme: {
        colors: {
          primary: "blue",
          secondary: "red",
        },
      },
    });

    const class1 = css({
      color: "$primary",
      "&:hover": {
        color: "$secondary",
      },
      "&:focus": {
        outline: "2px solid $primary",
      },
    });

    const class2 = css({
      color: "$primary",
      "&:hover": {
        color: "$secondary",
      },
      "&:focus": {
        outline: "2px solid $primary",
      },
    });

    expect(class1).toBe(class2);
  });

  test("should handle nested selectors deterministically", () => {
    const { css } = createStoop({
      theme: {
        colors: {
          primary: "blue",
        },
      },
    });

    const class1 = css({
      color: "$primary",
      "& > span": {
        fontWeight: "500",
      },
      "& + div": {
        marginTop: "10px",
      },
    });

    const class2 = css({
      color: "$primary",
      "& > span": {
        fontWeight: "500",
      },
      "& + div": {
        marginTop: "10px",
      },
    });

    expect(class1).toBe(class2);
  });

  test("should handle media queries deterministically", () => {
    const { css } = createStoop({
      theme: {
        colors: {
          primary: "blue",
        },
      },
      media: {
        bp1: "(min-width: 768px)",
        bp2: "(min-width: 1024px)",
      },
    });

    const class1 = css({
      color: "$primary",
      bp1: {
        fontSize: "16px",
      },
      bp2: {
        fontSize: "18px",
      },
    });

    const class2 = css({
      color: "$primary",
      bp1: {
        fontSize: "16px",
      },
      bp2: {
        fontSize: "18px",
      },
    });

    expect(class1).toBe(class2);
  });
});
