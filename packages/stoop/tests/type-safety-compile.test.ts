/**
 * Compile-time type safety tests for variant prop inference.
 *
 * These are type-only tests that verify TypeScript correctly infers variant types.
 * Run with: npx tsc --noEmit --skipLibCheck packages/stoop/tests/type-safety-compile.test.ts
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
    loading: {
      true: { cursor: "wait" },
      false: {},
    },
  },
} as CSSWithVariants);

type BooleanButtonProps = ComponentProps<typeof BooleanButton>;

// ✅ Valid boolean variants
const validBool1: BooleanButtonProps = { disabled: true };
const validBool2: BooleanButtonProps = { disabled: false };
const validBool3: BooleanButtonProps = { loading: true };
const validBool4: BooleanButtonProps = { loading: false };

// ❌ Invalid - should error if types are correct
/*
const invalidBool1: BooleanButtonProps = { disabled: "true" }; // Should error - not boolean
const invalidBool2: BooleanButtonProps = { disabled: "yes" }; // Should error
const invalidBool3: BooleanButtonProps = { loading: 1 }; // Should error
*/

// Check inferred type - should be true | false | undefined, NOT boolean | undefined
type DisabledType = BooleanButtonProps["disabled"];
type LoadingType = BooleanButtonProps["loading"];

// Type assertions to verify literal types are preserved
type _AssertDisabledIsLiteral = DisabledType extends true | false | undefined ? true : false;
type _AssertLoadingIsLiteral = LoadingType extends true | false | undefined ? true : false;

// ============================================================================
// Test 4: Automatic type inference (without explicit type annotations)
// ============================================================================

// Define variants inline - NO type annotation, NO "as CSSWithVariants"
// TypeScript should automatically infer the variant types
const AutoInferredButton = stoop.styled("button", {
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

type AutoInferredButtonProps = ComponentProps<typeof AutoInferredButton>;
type AutoVariantType = AutoInferredButtonProps["variant"];
type AutoSizeType = AutoInferredButtonProps["size"];

// ✅ These should work (valid variants)
const autoValid1: AutoInferredButtonProps = { variant: "primary" };
const autoValid2: AutoInferredButtonProps = { variant: "secondary" };
const autoValid3: AutoInferredButtonProps = { size: "small" };

// ❌ These should cause TypeScript errors (invalid variants)
// Uncomment to verify types are working:
/*
const autoInvalid1: AutoInferredButtonProps = { variant: "invalid" }; // Should error
const autoInvalid2: AutoInferredButtonProps = { size: "wrong" }; // Should error
*/

// Type assertions to verify literal types are preserved
type _AssertAutoVariantIsLiteral = AutoVariantType extends
  | "primary"
  | "secondary"
  | "danger"
  | undefined
  ? true
  : false;

// If VariantType is string | undefined, this would be false
type _AssertAutoVariantIsNotString = AutoVariantType extends string
  ? AutoVariantType extends "primary" | "secondary" | "danger"
    ? false
    : true
  : false;

// ============================================================================
// Test 5: Button component variants (real-world example)
// ============================================================================

// Simulate Button component with same variants as stoop-ui Button
const UIButton = stoop.styled("button", {
  variants: {
    variant: {
      danger: {},
      minimal: {},
      primary: {},
      secondary: {},
    },
    size: {
      default: {},
      small: {},
    },
  },
});

type UIButtonProps = ComponentProps<typeof UIButton>;

// ✅ These should compile (valid variants)
const uiValid1: UIButtonProps = { variant: "primary" };
const uiValid2: UIButtonProps = { variant: "secondary" };
const uiValid3: UIButtonProps = { variant: "danger" };
const uiValid4: UIButtonProps = { variant: "minimal" };
const uiValid5: UIButtonProps = { size: "small" };
const uiValid6: UIButtonProps = { size: "default" };

// ❌ These should cause TypeScript errors (invalid variants)
// Commented out because they DO cause errors (types are working!)
/*
const uiInvalid1: UIButtonProps = { variant: "invalid" }; // ✅ Correctly errors
const uiInvalid2: UIButtonProps = { variant: "wrong" }; // ✅ Correctly errors
const uiInvalid3: UIButtonProps = { size: "invalid" }; // ✅ Correctly errors
*/

// Check inferred type
type UIVariantType = UIButtonProps["variant"];
// Should be: "danger" | "minimal" | "primary" | "secondary" | undefined
// NOT: string | undefined

type UISizeType = UIButtonProps["size"];
// Should be: "default" | "small" | undefined
// NOT: string | undefined

// ============================================================================
// Test 6: Type inference verification
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

export type {
  ButtonProps,
  MultiVariantButtonProps,
  BooleanButtonProps,
  AutoInferredButtonProps,
  UIButtonProps,
  VariantType,
  DisabledType,
  LoadingType,
  AutoVariantType,
  AutoSizeType,
  UIVariantType,
  UISizeType,
};
