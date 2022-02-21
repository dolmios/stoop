// Example Card component using Stoop
import type { ComponentProps } from "react";

import { styled } from "../theme";

export const Card = styled(
  "div",
  {
    backgroundColor: "$colors.background",
    border: "1px solid $colors.border",
    borderRadius: "$borderRadius.default",
    boxShadow: "$shadows.subtle",
    padding: "$spacing.large",
  },
  {
    variant: {
      bordered: {
        border: "1px solid $colors.border",
        boxShadow: "none",
      },
      elevated: {
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.06)",
      },
      outlined: {
        borderWidth: "2px",
        boxShadow: "none",
      },
    },
  },
);

export type CardProps = ComponentProps<typeof Card>;
