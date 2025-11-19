/**
 * Button component example.
 *
 * Demonstrates:
 * - Styled component creation with `styled()`
 * - Variants (size, variant)
 * - Nested selectors (`&:hover`, `&:disabled`)
 * - Theme token usage (shorthand and explicit)
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="large">Click me</Button>
 * ```
 */

import type { ComponentProps } from "react";

import { styled } from "../stoop.theme";

export const Button = styled(
  "button",
  {
    "&:disabled": {
      cursor: "not-allowed",
      opacity: "$disabled",
    },
    "&:hover": {
      backgroundColor: "$hover",
    },
    backgroundColor: "$background",
    border: "1px solid $border",
    borderRadius: "$radii.default",
    color: "$text",
    cursor: "pointer",
    fontFamily: "$body",
    fontSize: "$medium",
    padding: "$medium $large",
    transition: "$default",
  },
  {
    size: {
      large: {
        fontSize: "$large",
        padding: "$large $xlarge",
      },
      medium: {
        padding: "$medium $large",
      },
      small: {
        fontSize: "$small",
        padding: "$small $medium",
      },
    },
    variant: {
      minimal: {
        backgroundColor: "transparent",
        border: "none",
      },
      primary: {
        "&:hover": {
          backgroundColor: "$textSecondary",
          borderColor: "$textSecondary",
        },
        backgroundColor: "$primary",
        borderColor: "$primary",
        color: "$background",
      },
      secondary: {
        "&:hover": {
          backgroundColor: "$hover",
        },
        backgroundColor: "$background",
        borderColor: "$border",
        color: "$text",
      },
    },
  },
);

export type ButtonProps = ComponentProps<typeof Button>;
