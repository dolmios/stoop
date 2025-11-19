// Example ToggleButton demonstrating boolean variants
import type { ComponentProps } from "react";

import { styled } from "../stoop.theme";

export const ToggleButton = styled(
  "button",
  {
    "&:hover": {
      backgroundColor: "$hover",
    },
    backgroundColor: "$background",
    border: "1px solid $border",
    borderRadius: "$default",
    color: "$text",
    cursor: "pointer",
    padding: "$medium $large",
    transition: "$default",
  },
  {
    active: {
      false: {
        backgroundColor: "$background",
      },
      true: {
        backgroundColor: "$primary",
        borderColor: "$primary",
        color: "$background",
      },
    },
  },
);

export type ToggleButtonProps = ComponentProps<typeof ToggleButton>;
