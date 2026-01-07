"use client";

import type { ComponentProps, ReactNode } from "react";

import { styled } from "../../stoop.theme";
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

const CardLoadingOverlay = styled("div", {
  alignItems: "center",
  display: "flex",
  inset: 0,
  justifyContent: "center",
  position: "absolute",
  zIndex: 1,
});

export type CardProps = Omit<ComponentProps<typeof CardStyled>, "loading"> & {
  children?: ReactNode;
  loading?: boolean;
};

export function Card({ children, loading = false, ...props }: CardProps): ReactNode {
  return (
    <CardStyled loading={loading} {...props}>
      {children}
      {loading && (
        <CardLoadingOverlay>
          <Spinner />
        </CardLoadingOverlay>
      )}
    </CardStyled>
  );
}
