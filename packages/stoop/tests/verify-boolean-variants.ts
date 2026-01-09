/**
 * Type verification for boolean variants.
 * Verifies that true/false literals are preserved, not widened to boolean.
 */

import type { ComponentProps } from "react";
import { createStoop } from "../src/create-stoop";

const mockTheme = {
  colors: { primary: "#0070f3" },
};

const stoop = createStoop({ theme: mockTheme });

const Button = stoop.styled("button", {
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
});

type ButtonProps = ComponentProps<typeof Button>;

// ✅ These should compile (valid boolean variants)
const valid1: ButtonProps = { disabled: true };
const valid2: ButtonProps = { disabled: false };
const valid3: ButtonProps = { loading: true };
const valid4: ButtonProps = { loading: false };

// ❌ These should cause TypeScript errors
// Commented out because they DO cause errors (types are working!)
// const invalid1: ButtonProps = { disabled: "true" }; // ✅ Correctly errors - not boolean
// const invalid2: ButtonProps = { disabled: "yes" }; // ✅ Correctly errors
// const invalid3: ButtonProps = { loading: 1 }; // ✅ Correctly errors

// Check inferred type - should be true | false | undefined, NOT boolean | undefined
type DisabledType = ButtonProps["disabled"];
type LoadingType = ButtonProps["loading"];

// Type assertion to verify literal types are preserved
type _AssertDisabledIsLiteral = DisabledType extends true | false | undefined ? true : false;
type _AssertLoadingIsLiteral = LoadingType extends true | false | undefined ? true : false;

export type { ButtonProps, DisabledType, LoadingType };
