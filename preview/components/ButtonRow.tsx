// Example component demonstrating styled component targeting
import type { ComponentProps } from "react";

import { styled } from "../stoop.theme";
import { Button } from "./Button";

/**
 * ButtonRow - Demonstrates targeting styled components
 * This component targets Button components within it and adds spacing
 * Usage: <ButtonRow><Button>...</Button></ButtonRow>
 */
export const ButtonRow = styled(
  "div",
  {
    // Target Button components within this Row
    // Button.selector converts to "__STOOP_COMPONENT_css-xxx" when used as object key
    [Button.selector.toString()]: {
      "&:first-child": {
        marginTop: 0,
      },
      marginTop: "$small",
    },
    display: "flex",
    flexDirection: "row",
    gap: "$medium",
  },
  {
    spacing: {
      large: {
        [Button.selector.toString()]: {
          marginTop: "$large",
        },
        gap: "$large",
      },
      medium: {
        [Button.selector.toString()]: {
          marginTop: "$medium",
        },
        gap: "$medium",
      },
      small: {
        [Button.selector.toString()]: {
          marginTop: "$small",
        },
        gap: "$small",
      },
    },
  },
);

export type ButtonRowProps = ComponentProps<typeof ButtonRow>;
