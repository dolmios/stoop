// Example ToggleButton demonstrating boolean variants
import type { ComponentProps } from "react";

import { styled } from "../theme";

export const ToggleButton = styled(
  "button",
  {
    "&:hover": {
      backgroundColor: "$colors.hover",
    },
    backgroundColor: "$colors.background",
    border: "1px solid $colors.border",
    borderRadius: "$borderRadius.default",
    color: "$colors.text",
    cursor: "pointer",
    padding: "$spacing.medium $spacing.large",
    transition: "$transitions.default",
  },
  {
    active: {
      false: {
        backgroundColor: "$colors.background",
      },
      true: {
        backgroundColor: "$colors.primary",
        borderColor: "$colors.primary",
        color: "$colors.background",
      },
    },
  },
);

export type ToggleButtonProps = ComponentProps<typeof ToggleButton>;
