/**
 * Keyframes animation tests to verify animations work correctly.
 */

import { describe, expect, test } from "bun:test";

import { createStoop } from "../src/create-stoop";
import { getCssText } from "../src/inject";

describe("Keyframes Animation", () => {
  test("should generate valid @keyframes CSS", () => {
    const { keyframes } = createStoop({
      theme: {
        colors: {
          primary: "blue",
        },
      },
    });

    const fadeIn = keyframes({
      "0%": {
        opacity: 0,
      },
      "100%": {
        opacity: 1,
      },
    });

    const css = getCssText();

    expect(css).toContain(fadeIn);
    expect(css).toContain("@keyframes");
    expect(css).toContain("opacity");
  });

  test("should generate valid animation with complex transforms", () => {
    const { keyframes } = createStoop({
      theme: {
        colors: {
          yellow: "#ffcd1a",
        },
      },
    });

    const houseToSquareSlide = keyframes({
      "0%": {
        clipPath: "polygon(10% 50%, 50% 15%, 90% 50%, 90% 100%, 10% 100%)",
        transform: "translate(-50%, -50%)",
      },
      "50%": {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 100% 100%, 0% 100%)",
        transform: "translate(0%, 0%)",
      },
      "100%": {
        clipPath: "polygon(10% 50%, 50% 15%, 90% 50%, 90% 100%, 10% 100%)",
        transform: "translate(-50%, -50%)",
      },
    });

    const css = getCssText();

    expect(css).toContain(houseToSquareSlide);
    expect(css).toContain("@keyframes");
    expect(css).toContain("clip-path");
    expect(css).toContain("transform");
    expect(css).toContain("polygon");
    expect(css).toContain("translate");
  });

  test("should use animation name in styled component", () => {
    const { keyframes, styled } = createStoop({
      theme: {
        colors: {
          primary: "blue",
        },
      },
    });

    const spin = keyframes({
      from: {
        transform: "rotate(0deg)",
      },
      to: {
        transform: "rotate(360deg)",
      },
    });

    const Spinner = styled("div", {
      animation: `${spin} 1s linear infinite`,
    });

    const css = getCssText();

    expect(css).toContain(spin);
    expect(css).toContain("@keyframes");
    expect(spin).toMatch(/^stoop-[a-z0-9]+$/);
  });

  test("should generate deterministic animation names", () => {
    const { keyframes } = createStoop({
      theme: {
        colors: {
          primary: "blue",
        },
      },
    });

    const fadeIn1 = keyframes({
      "0%": {
        opacity: 0,
      },
      "100%": {
        opacity: 1,
      },
    });

    const fadeIn2 = keyframes({
      "0%": {
        opacity: 0,
      },
      "100%": {
        opacity: 1,
      },
    });

    expect(fadeIn1).toBe(fadeIn2);
  });

  test("should handle keyframes with theme tokens", () => {
    const { keyframes } = createStoop({
      theme: {
        colors: {
          primary: "blue",
          secondary: "red",
        },
      },
    });

    const colorChange = keyframes({
      "0%": {
        backgroundColor: "$primary",
      },
      "100%": {
        backgroundColor: "$secondary",
      },
    });

    const css = getCssText();

    expect(css).toContain(colorChange);
    expect(css).toContain("var(--colors-primary)");
    expect(css).toContain("var(--colors-secondary)");
  });

  test("should preserve complex CSS values in keyframes", () => {
    const { keyframes } = createStoop({
      theme: {
        colors: {
          yellow: "#ffcd1a",
        },
      },
    });

    const complexAnimation = keyframes({
      "0%": {
        clipPath: "polygon(10% 50%, 50% 15%, 90% 50%, 90% 100%, 10% 100%)",
        transform: "translate(-50%, -50%) scale(1)",
        filter: "blur(0px)",
      },
      "100%": {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 0% 100%)",
        transform: "translate(0%, 0%) scale(1.5)",
        filter: "blur(5px)",
      },
    });

    const css = getCssText();

    expect(css).toContain("polygon");
    expect(css).toContain("translate");
    expect(css).toContain("scale");
    expect(css).toContain("blur");
    expect(css).toContain("translate(-50%, -50%)");
    expect(css).toContain("scale(1)");
  });
});
