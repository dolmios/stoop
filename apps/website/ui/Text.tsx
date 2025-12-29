"use client";

import type { ComponentProps, ElementType } from "react";

import { styled } from "../stoop.theme";

export const Text = styled(
  "p",
  {
    "&:last-child": {
      marginBottom: 0,
    },
    color: "$text",
    fontFamily: "$body",
    fontSize: "$default",
    fontWeight: "$default",
    lineHeight: "1.4",
    margin: 0,
    marginBottom: "$medium",
  },
  {
    size: {
      large: {
        fontSize: "$large",
      },
      medium: {
        fontSize: "$default",
      },
      small: {
        fontSize: "$small",
      },
    },
    variant: {
      h1: {
        "&:first-child": {
          marginTop: 0,
        },
        fontFamily: "$mono",
        fontSize: "$h1",
        fontWeight: "$bold",
        lineHeight: "1.2",
        marginBottom: "$large",
        marginTop: "$larger",
      },
      h2: {
        fontFamily: "$heading",
        fontSize: "$h2",
        fontWeight: "$bold",
        lineHeight: "1.2",
        marginBottom: "$medium",
        marginTop: "$large",
      },
      h3: {
        fontFamily: "$heading",
        fontSize: "$h3",
        fontWeight: "$bold",
        lineHeight: "1.2",
        marginBottom: "$medium",
        marginTop: "$large",
      },
      h4: {
        fontFamily: "$heading",
        fontSize: "$h4",
        fontWeight: "$bold",
        lineHeight: "1.2",
        marginBottom: "$small",
        marginTop: "$medium",
      },
    },
  },
);

export type TextProps<T extends ElementType = "p"> = ComponentProps<typeof Text> & {
  as?: T;
};
