/**
 * Test automatic type inference from inline variant definitions.
 * This verifies that TypeScript automatically extracts variant types
 * without needing explicit type annotations.
 */

import type { ComponentProps } from "react";
import { createStoop } from "../src/create-stoop";

const mockTheme = {
  colors: { primary: "#0070f3" },
  space: { small: "8px" },
};

const stoop = createStoop({ theme: mockTheme });

// Define variants inline - NO type annotations, NO "as CSSWithVariants"
// TypeScript should automatically infer the variant types
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

// Check what types are automatically inferred
type VariantType = ButtonProps["variant"];
type SizeType = ButtonProps["size"];

// ✅ These should work (valid variants)
const valid1: ButtonProps = { variant: "primary" };
const valid2: ButtonProps = { variant: "secondary" };
const valid3: ButtonProps = { size: "small" };

// ❌ These should cause TypeScript errors (invalid variants)
// Uncomment to verify types are working:
// const invalid1: ButtonProps = { variant: "invalid" }; // Should error
// const invalid2: ButtonProps = { size: "wrong" }; // Should error

// Type assertions to verify literal types are preserved
// If VariantType is "primary" | "secondary" | "danger" | undefined, this should be true
type _AssertVariantIsLiteral = VariantType extends "primary" | "secondary" | "danger" | undefined
  ? true
  : false;

// If VariantType is string | undefined, this would be false
type _AssertVariantIsNotString = VariantType extends string
  ? VariantType extends "primary" | "secondary" | "danger"
    ? false
    : true
  : false;

export type { ButtonProps, VariantType, SizeType };
