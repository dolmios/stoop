// Example component demonstrating styled component targeting
import type { ComponentProps } from "react";

import { styled } from "../theme";
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
      marginTop: "$spacing.small",
    },
    display: "flex",
    flexDirection: "row",
    gap: "$spacing.medium",
  },
  {
    spacing: {
      large: {
        [Button.selector.toString()]: {
          marginTop: "$spacing.large",
        },
        gap: "$spacing.large",
      },
      medium: {
        [Button.selector.toString()]: {
          marginTop: "$spacing.medium",
        },
        gap: "$spacing.medium",
      },
      small: {
        [Button.selector.toString()]: {
          marginTop: "$spacing.small",
        },
        gap: "$spacing.small",
      },
    },
  },
);

export type ButtonRowProps = ComponentProps<typeof ButtonRow>;
