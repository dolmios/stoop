// Example Badge component demonstrating styled() with variants
import type { ComponentProps } from "react";

import { styled } from "../theme";

export const Badge = styled(
  "span",
  {
    borderRadius: "$borderRadius.default",
    display: "inline-block",
    fontSize: "$fontSizes.small",
    fontWeight: "$typography.medium",
    padding: "$spacing.small $spacing.medium",
  },
  {
    variant: {
      outline: {
        backgroundColor: "transparent",
        border: "1px solid $colors.border",
        color: "$colors.text",
      },
      primary: {
        backgroundColor: "$colors.primary",
        color: "$colors.background",
      },
      secondary: {
        backgroundColor: "$colors.hover",
        color: "$colors.text",
      },
    },
  },
);

export type BadgeProps = ComponentProps<typeof Badge>;
