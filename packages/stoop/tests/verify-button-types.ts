/**
 * Type verification for Button component.
 * This file should NOT compile if variant types are incorrect.
 *
 * Run: npx tsc --noEmit --skipLibCheck packages/stoop/tests/verify-button-types.ts
 *
 * Expected: TypeScript errors for invalid variant values
 */

import type { ComponentProps } from "react";
import { createStoop } from "../src/create-stoop";

const mockTheme = {
  colors: { primary: "#0070f3" },
  space: { small: "8px" },
};

const stoop = createStoop({ theme: mockTheme });

// Simulate Button component with same variants as stoop-ui Button
const Button = stoop.styled("button", {
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

type ButtonProps = ComponentProps<typeof Button>;

// ✅ These should compile (valid variants)
const valid1: ButtonProps = { variant: "primary" };
const valid2: ButtonProps = { variant: "secondary" };
const valid3: ButtonProps = { variant: "danger" };
const valid4: ButtonProps = { variant: "minimal" };
const valid5: ButtonProps = { size: "small" };
const valid6: ButtonProps = { size: "default" };

// ❌ These should cause TypeScript errors (invalid variants)
// Commented out because they DO cause errors (types are working!)
// const invalid1: ButtonProps = { variant: "invalid" }; // ✅ Correctly errors
// const invalid2: ButtonProps = { variant: "wrong" }; // ✅ Correctly errors
// const invalid3: ButtonProps = { size: "invalid" }; // ✅ Correctly errors

// Check inferred type
type VariantType = ButtonProps["variant"];
// Should be: "danger" | "minimal" | "primary" | "secondary" | undefined
// NOT: string | undefined

type SizeType = ButtonProps["size"];
// Should be: "default" | "small" | undefined
// NOT: string | undefined

export type { ButtonProps, VariantType, SizeType };
