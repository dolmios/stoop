// Example Text component using Stoop
import type { ComponentProps } from "react";

import { styled } from "../stoop.theme";

export const Text = styled(
  "p",
  {
    color: "$text",
    fontFamily: "$body",
    fontSize: "$medium",
    lineHeight: "1.4",
    margin: 0,
  },
  {
    size: {
      large: {
        fontSize: "$large",
      },
      medium: {
        fontSize: "$medium",
      },
      small: {
        fontSize: "$small",
      },
    },
    variant: {
      h1: {
        fontFamily: "$heading",
        fontSize: "$h1",
        fontWeight: "$bold",
        lineHeight: "1.2",
      },
      h2: {
        fontFamily: "$heading",
        fontSize: "$h2",
        fontWeight: "$bold",
        lineHeight: "1.2",
      },
      small: {
        fontSize: "$small",
      },
    },
  },
);

export type TextProps = ComponentProps<typeof Text>;
