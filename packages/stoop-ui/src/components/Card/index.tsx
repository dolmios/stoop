"use client";

import type { ComponentProps, JSX, ReactNode } from "react";

import { styled } from "stoop";

import { Spinner } from "../Spinner";

const CardStyled = styled("div", {
  backgroundColor: "$surface",
  border: "1px solid $borderStrong",
  borderBottomColor: "$borderEmphasis",
  borderRadius: "$default",
  borderTopColor: "$borderLight",
  boxShadow: "$subtle",
  display: "flex",
  flexDirection: "column",
  padding: "$large",
  position: "relative",
  transition: "$default",
  variants: {
    interactive: {
      false: {},
      true: {
        "&:hover": {
          boxShadow: "$default",
        },
        cursor: "pointer",
      },
    },
    loading: {
      false: {},
      true: {
        opacity: "$disabled",
        pointerEvents: "none",
      },
    },
  },
});

const CardLoadingOverlayStyled = styled("div", {
  alignItems: "center",
  display: "flex",
  inset: 0,
  justifyContent: "center",
  position: "absolute",
  zIndex: 1,
});

export interface CardProps extends Omit<ComponentProps<typeof CardStyled>, "loading"> {
  children?: ReactNode;
  loading?: boolean;
}

export const Card = ({ children, loading = false, ...props }: CardProps): JSX.Element => (
  <CardStyled loading={loading} {...props}>
    {children}
    {loading && (
      <CardLoadingOverlayStyled>
        <Spinner />
      </CardLoadingOverlayStyled>
    )}
  </CardStyled>
);
