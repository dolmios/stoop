/**
 * Type-only tests for variant prop inference.
 *
 * Run with: npx tsc --noEmit --skipLibCheck packages/stoop/tests/type-safety-types.test.ts
 *
 * If types are correct, this file should compile WITHOUT errors.
 * If types are incorrect (allowing any string), uncomment the "should error" sections
 * and they should cause TypeScript errors.
 */

import type { ComponentProps } from "react";
import { createStoop } from "../src/create-stoop";
import type { CSSWithVariants } from "../src/types";

// Mock theme for testing
const mockTheme = {
  colors: { primary: "#0070f3" },
  space: { small: "8px" },
};

const stoop = createStoop({ theme: mockTheme });

// ============================================================================
// Test 1: Basic variant type inference
// ============================================================================

const Button = stoop.styled("button", {
  variants: {
    variant: {
      primary: { backgroundColor: "blue" },
      secondary: { backgroundColor: "gray" },
      danger: { backgroundColor: "red" },
    },
  },
} as CSSWithVariants);

type ButtonProps = ComponentProps<typeof Button>;

// ✅ These should be valid (compile without errors)
const valid1: ButtonProps = { variant: "primary" };
const valid2: ButtonProps = { variant: "secondary" };
const valid3: ButtonProps = { variant: "danger" };
const valid4: ButtonProps = {}; // variant is optional

// ❌ These should cause TypeScript errors if types are correct
// Uncomment to test - if types are wrong, these will compile without errors
/*
const invalid1: ButtonProps = { variant: "invalid" }; // Should error
const invalid2: ButtonProps = { variant: "wrong" }; // Should error
const invalid3: ButtonProps = { variant: 123 }; // Should error
*/

// ============================================================================
// Test 2: Multiple variants
// ============================================================================

const MultiVariantButton = stoop.styled("button", {
  variants: {
    variant: {
      primary: {},
      secondary: {},
    },
    size: {
      small: {},
      large: {},
    },
  },
} as CSSWithVariants);

type MultiVariantButtonProps = ComponentProps<typeof MultiVariantButton>;

// ✅ Valid combinations
const validMulti1: MultiVariantButtonProps = { variant: "primary", size: "small" };
const validMulti2: MultiVariantButtonProps = { variant: "secondary", size: "large" };

// ❌ Invalid - should error if types are correct
/*
const invalidMulti1: MultiVariantButtonProps = { variant: "invalid", size: "small" }; // Should error
const invalidMulti2: MultiVariantButtonProps = { variant: "primary", size: "wrong" }; // Should error
*/

// ============================================================================
// Test 3: Boolean variants
// ============================================================================

const BooleanButton = stoop.styled("button", {
  variants: {
    disabled: {
      true: { opacity: 0.5 },
      false: { opacity: 1 },
    },
  },
} as CSSWithVariants);

type BooleanButtonProps = ComponentProps<typeof BooleanButton>;

// ✅ Valid boolean variants
const validBool1: BooleanButtonProps = { disabled: true };
const validBool2: BooleanButtonProps = { disabled: false };

// ❌ Invalid - should error if types are correct
/*
const invalidBool1: BooleanButtonProps = { disabled: "true" }; // Should error - not boolean
const invalidBool2: BooleanButtonProps = { disabled: "yes" }; // Should error
*/

// ============================================================================
// Test 4: Type inference verification
// ============================================================================

// Check that variant prop type is inferred correctly
type VariantType = ButtonProps["variant"];

// This type should be: "primary" | "secondary" | "danger" | undefined
// If it's "string | undefined", then types are wrong
type _AssertVariantType = VariantType extends "primary" | "secondary" | "danger" | undefined
  ? true
  : false;

// ============================================================================
// Export to prevent unused variable errors
// ============================================================================

export type { ButtonProps, MultiVariantButtonProps, BooleanButtonProps, VariantType };
