"use client";

import type { ComponentProps, JSX } from "react";

import { keyframes, styled } from "../../stoop.theme";

const spin = keyframes({
  "0%": {
    transform: "rotate(0deg)",
  },
  "100%": {
    transform: "rotate(360deg)",
  },
});

const SpinnerStyled = styled("div", {
  animation: `${spin} 1s linear infinite`,
  border: "2px solid $border",
  borderRadius: "50%",
  borderTopColor: "$text",
  display: "inline-block",
  flexShrink: 0,
  variants: {
    size: {
      default: {
        borderWidth: "2px",
        height: "24px",
        width: "24px",
      },
      large: {
        borderWidth: "3px",
        height: "32px",
        width: "32px",
      },
      small: {
        borderWidth: "2px",
        height: "16px",
        width: "16px",
      },
    },
  },
});

export type SpinnerProps = ComponentProps<typeof SpinnerStyled>;

export const Spinner = ({ size = "default", ...props }: SpinnerProps): JSX.Element => (
  <SpinnerStyled size={size} {...props} />
);
