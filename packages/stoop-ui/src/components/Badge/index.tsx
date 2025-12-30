"use client";

import type { ComponentProps } from "react";

import { styled } from "../../stoop.theme";

const badgeBaseStyles = {
  borderRadius: "$small",
  display: "inline-block",
  fontSize: "$small",
  fontWeight: "$default",
  padding: "$small $medium",
} as const;

const badgeVariants = {
  size: {
    default: {},
    small: {
      fontSize: "12px",
      padding: "$smaller $small",
    },
  },
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
} as const;

export const Badge = styled("span", badgeBaseStyles, badgeVariants);

export type BadgeProps = ComponentProps<typeof Badge>;
