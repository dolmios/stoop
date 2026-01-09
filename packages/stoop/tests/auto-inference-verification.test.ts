/**
 * Verification: Does TypeScript automatically infer variant types?
 *
 * This test verifies that variant types are extracted automatically
 * without needing "as CSSWithVariants" annotation.
 */

import { describe, expect, test } from "bun:test";
import type { ComponentProps } from "react";
import { createStoop } from "../src/create-stoop";
import { createMockTheme } from "./helpers";

describe("Automatic Type Inference", () => {
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
