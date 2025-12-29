"use client";

import type { ComponentProps } from "react";

import { styled } from "../stoop.theme";

export const Stack = styled(
  "div",
  {
    display: "flex",
    flexDirection: "column",
  },
  {
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
    wrap: {
      false: {
        flexWrap: "nowrap",
      },
      true: {
        flexWrap: "wrap",
      },
    },
  },
);

export type StackProps = ComponentProps<typeof Stack>;
