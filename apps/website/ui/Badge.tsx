"use client";

import type { ComponentProps } from "react";

import { styled } from "../stoop.theme";

export const Badge = styled(
  "span",
  {
    borderRadius: "$small",
    display: "inline-block",
    fontSize: "$small",
    fontWeight: "$default",
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
        backgroundColor: "$text",
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
