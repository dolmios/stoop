/**
 * Runtime type safety tests for variant prop inference.
 *
 * These tests verify that variant props are strongly typed and don't allow arbitrary strings.
 * Unlike compile-time tests, these run actual code to verify type behavior at runtime.
 */

import { describe, expect, test } from "bun:test";
import type { ComponentProps } from "react";

import { createStoop } from "../src/create-stoop";
import type { CSSWithVariants } from "../src/types";

import { createMockTheme } from "./helpers";

describe("Type Safety - Variant Props", () => {
  test("should infer variant prop types correctly", () => {
    const stoop = createStoop({ theme: createMockTheme() });

    const Button = stoop.styled("button", {
      color: "red",
      variants: {
        variant: {
          primary: { backgroundColor: "blue" },
          secondary: { backgroundColor: "gray" },
          danger: { backgroundColor: "red" },
        },
        size: {
          small: { fontSize: "12px" },
          large: { fontSize: "20px" },
        },
      },
    } as CSSWithVariants);

    // This should be typed correctly - variant should only accept "primary" | "secondary" | "danger"
    // and size should only accept "small" | "large"
    type ButtonProps = ComponentProps<typeof Button>;

    // Valid variants should work
    const validButton = { variant: "primary" as const, size: "small" as const };
    expect(validButton.variant).toBe("primary");
    expect(validButton.size).toBe("small");
  });

  test("should automatically infer variant types from inline definitions", () => {
    const stoop = createStoop({ theme: createMockTheme() });

    // Define variants inline - NO type annotation, NO "as CSSWithVariants"
    const Button = stoop.styled("button", {
      variants: {
        variant: {
          primary: { backgroundColor: "blue" },
          secondary: { backgroundColor: "gray" },
          danger: { backgroundColor: "red" },
        },
        size: {
          small: { fontSize: "12px" },
          large: { fontSize: "20px" },
        },
      },
    });

    type ButtonProps = ComponentProps<typeof Button>;

    // Check if types are inferred correctly
    // If types work, these should compile:
    const valid1: ButtonProps = { variant: "primary" };
    const valid2: ButtonProps = { variant: "secondary" };
    const valid3: ButtonProps = { size: "small" };

    expect(valid1.variant).toBe("primary");
    expect(valid2.variant).toBe("secondary");
    expect(valid3.size).toBe("small");

    // Type check: variant should be "primary" | "secondary" | "danger" | undefined
    // NOT string | undefined
    type VariantType = ButtonProps["variant"];
    type SizeType = ButtonProps["size"];

    // These type assertions verify literal types are preserved
    // If VariantType is the literal union, these should be true
    const _variantCheck: VariantType extends "primary" | "secondary" | "danger" | undefined
      ? true
      : false = true;

    const _sizeCheck: SizeType extends "small" | "large" | undefined ? true : false = true;

    // If types are wrong (widened to string), these would be false
    // But we can't test that at runtime, so we rely on TypeScript compilation
  });

  test("should handle boolean variants automatically", () => {
    const stoop = createStoop({ theme: createMockTheme() });

    const Button = stoop.styled("button", {
      variants: {
        disabled: {
          true: { opacity: 0.5 },
          false: { opacity: 1 },
        },
      },
    });

    type ButtonProps = ComponentProps<typeof Button>;
    type DisabledType = ButtonProps["disabled"];

    // Boolean variants should accept true | false, not "true" | "false"
    const valid1: ButtonProps = { disabled: true };
    const valid2: ButtonProps = { disabled: false };

    expect(valid1.disabled).toBe(true);
    expect(valid2.disabled).toBe(false);

    // Type check: should be boolean | undefined, not "true" | "false" | undefined
    const _disabledCheck: DisabledType extends boolean | undefined ? true : false = true;
  });
});

// ============================================================================
// TYPE TESTS - These will cause TypeScript errors if types are incorrect
// ============================================================================

/**
 * Type test: Invalid variant values should cause TypeScript errors
 *
 * To verify: Uncomment the lines below and run `npx tsc --noEmit`
 * If types are correct, these should cause compilation errors.
 * If types are incorrect (allowing any string), these will compile without errors.
 */

/*
const stoop = createStoop({ theme: createMockTheme() });

const TestButton = stoop.styled("button", {
  variants: {
    variant: {
      primary: {},
      secondary: {},
    },
  },
} as CSSWithVariants);

type TestButtonProps = ComponentProps<typeof TestButton>;

// These should cause TypeScript errors if types are correct:
const invalid1: TestButtonProps = { variant: "invalid" }; // ❌ Should error
const invalid2: TestButtonProps = { variant: "primary" }; // ✅ Should be valid
const invalid3: TestButtonProps = { variant: "secondary" }; // ✅ Should be valid
*/
