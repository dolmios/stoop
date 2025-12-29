"use client";

import type { ComponentProps } from "react";

import { styled } from "../stoop.theme";

export const Button = styled(
  "button",
  {
    "&:disabled": {
      cursor: "not-allowed",
      opacity: "$disabled",
    },
    "&:hover": {
      backgroundColor: "$hover",
    },
    backgroundColor: "$background",
    border: "1px solid $border",
    borderRadius: "$small",
    color: "$text",
    cursor: "pointer",
    fontFamily: "$body",
    fontSize: "$default",
    padding: "$medium $large",
    transition: "$default",
  },
  {
    active: {
      false: {},
      true: {
        "&:hover": {
          backgroundColor: "$hover",
          borderColor: "$hover",
        },
        backgroundColor: "$text",
        borderColor: "$text",
        color: "$background",
      },
    },
    size: {
      small: {
        fontSize: "$small",
        padding: "$small $medium",
      },
    },
    variant: {
      minimal: {
        backgroundColor: "transparent",
        border: "none",
      },
      primary: {
        "&:hover": {
          backgroundColor: "$colors.hover",
          borderColor: "$colors.hover",
        },
        backgroundColor: "$text",
        borderColor: "$text",
        color: "$background",
      },
      secondary: {
        "&:hover": {
          backgroundColor: "$colors.hover",
        },
        backgroundColor: "$background",
        borderColor: "$border",
        color: "$text",
      },
    },
  },
);

export type ButtonProps = ComponentProps<typeof Button>;
