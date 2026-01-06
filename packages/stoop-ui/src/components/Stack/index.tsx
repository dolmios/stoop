"use client";

import type { ComponentProps } from "react";

import { styled } from "../../stoop.theme";

export const Stack = styled("div", {
  display: "flex",
  flexDirection: "column",
  variants: {
    align: {
      center: {
        alignItems: "center",
      },
      end: {
        alignItems: "flex-end",
      },
      start: {
        alignItems: "flex-start",
      },
      stretch: {
        alignItems: "stretch",
      },
    },
    bottom: {
      large: {
        paddingBottom: "$large",
      },
      larger: {
        paddingBottom: "$larger",
      },
      medium: {
        paddingBottom: "$medium",
      },
      small: {
        paddingBottom: "$small",
      },
      smaller: {
        paddingBottom: "$smaller",
      },
      smallest: {
        paddingBottom: "$smallest",
      },
    },
    direction: {
      column: {
        flexDirection: "column",
      },
      row: {
        flexDirection: "row",
      },
    },
    gap: {
      large: {
        gap: "$large",
      },
      larger: {
        gap: "$larger",
      },
      medium: {
        gap: "$medium",
      },
      small: {
        gap: "$small",
      },
      smaller: {
        gap: "$smaller",
      },
    },
    justify: {
      between: {
        justifyContent: "space-between",
      },
      center: {
        justifyContent: "center",
      },
      end: {
        justifyContent: "flex-end",
      },
      start: {
        justifyContent: "flex-start",
      },
    },
    left: {
      large: {
        paddingLeft: "$large",
      },
      larger: {
        paddingLeft: "$larger",
      },
      medium: {
        paddingLeft: "$medium",
      },
      small: {
        paddingLeft: "$small",
      },
      smaller: {
        paddingLeft: "$smaller",
      },
      smallest: {
        paddingLeft: "$smallest",
      },
    },
    right: {
      large: {
        paddingRight: "$large",
      },
      larger: {
        paddingRight: "$larger",
      },
      medium: {
        paddingRight: "$medium",
      },
      small: {
        paddingRight: "$small",
      },
      smaller: {
        paddingRight: "$smaller",
      },
      smallest: {
        paddingRight: "$smallest",
      },
    },
    top: {
      large: {
        paddingTop: "$large",
      },
      larger: {
        paddingTop: "$larger",
      },
      medium: {
        paddingTop: "$medium",
      },
      small: {
        paddingTop: "$small",
      },
      smaller: {
        paddingTop: "$smaller",
      },
      smallest: {
        paddingTop: "$smallest",
      },
    },
    wrap: {
      false: {
        flexWrap: "nowrap",
      },
      true: {
        flexWrap: "wrap",
      },
    },
  },
});

export type StackProps = ComponentProps<typeof Stack>;
