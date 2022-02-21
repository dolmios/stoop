// Example Button component using Stoop
import type { ComponentProps } from "react";

import { styled } from "../theme";

export const Button = styled(
  "button",
  {
    "&:disabled": {
      cursor: "not-allowed",
      opacity: "$opacities.disabled",
    },
    "&:hover": {
      backgroundColor: "$colors.hover",
    },
    backgroundColor: "$colors.background",
    border: "1px solid $colors.border",
    borderRadius: "$borderRadius.default",
    color: "$colors.text",
    cursor: "pointer",
    fontFamily: "$fonts.body",
    fontSize: "$fontSizes.medium",
    padding: "$spacing.medium $spacing.large",
    transition: "$transitions.default",
  },
  {
    size: {
      large: {
        fontSize: "$fontSizes.large",
        padding: "$spacing.large $spacing.xlarge",
      },
      medium: {
        padding: "$spacing.medium $spacing.large",
      },
      small: {
        fontSize: "$fontSizes.small",
        padding: "$spacing.small $spacing.medium",
      },
    },
    variant: {
      minimal: {
        backgroundColor: "transparent",
        border: "none",
      },
      primary: {
        "&:hover": {
          backgroundColor: "$colors.textSecondary",
          borderColor: "$colors.textSecondary",
        },
        backgroundColor: "$colors.primary",
        borderColor: "$colors.primary",
        color: "$colors.background",
      },
      secondary: {
        "&:hover": {
          backgroundColor: "$colors.hover",
        },
        backgroundColor: "$colors.background",
        borderColor: "$colors.border",
        color: "$colors.text",
      },
    },
  },
);

export type ButtonProps = ComponentProps<typeof Button>;
