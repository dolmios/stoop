// Example Text component using Stoop
import type { ComponentProps } from "react";

import { styled } from "../theme";

export const Text = styled(
  "p",
  {
    color: "$colors.text",
    fontFamily: "$fonts.body",
    fontSize: "$fontSizes.medium",
    lineHeight: "$lineHeights.default",
    margin: 0,
  },
  {
    size: {
      large: {
        fontSize: "$fontSizes.large",
      },
      medium: {
        fontSize: "$fontSizes.medium",
      },
      small: {
        fontSize: "$fontSizes.small",
      },
    },
    variant: {
      h1: {
        fontFamily: "$fonts.heading",
        fontSize: "$fontSizes.h1",
        fontWeight: "$typography.bold",
        lineHeight: "$lineHeights.small",
      },
      h2: {
        fontFamily: "$fonts.heading",
        fontSize: "$fontSizes.h2",
        fontWeight: "$typography.bold",
        lineHeight: "$lineHeights.small",
      },
      small: {
        fontSize: "$fontSizes.small",
      },
    },
  },
);

export type TextProps = ComponentProps<typeof Text>;
