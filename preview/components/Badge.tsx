// Example Badge component demonstrating styled() with variants
import type { ComponentProps } from "react";

import { styled } from "../stoop.theme";

export const Badge = styled(
  "span",
  {
    borderRadius: "$default",
    display: "inline-block",
    fontSize: "$small",
    fontWeight: "$medium",
    padding: "$small $medium",
  },
  {
    variant: {
      outline: {
        backgroundColor: "transparent",
        border: "1px solid $border",
        color: "$text",
      },
      primary: {
        backgroundColor: "$primary",
        color: "$background",
      },
      secondary: {
        backgroundColor: "$hover",
        color: "$text",
      },
    },
  },
);

export type BadgeProps = ComponentProps<typeof Badge>;
