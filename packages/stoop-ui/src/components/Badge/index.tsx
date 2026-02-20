"use client";

import type { ComponentProps, JSX, ReactNode } from "react";

import { styled } from "stoop";

import { Spinner } from "../Spinner";

const BadgeStyled = styled("span", {
  alignItems: "center",
  borderRadius: "$small",
  display: "inline-flex",
  fontSize: "$small",
  fontWeight: "$default",
  lineHeight: 1,
  padding: "$smaller $small",
  position: "relative",
  transition: "$default",
  variants: {
    loading: {
      false: {},
      true: {
        opacity: "$disabled",
        pointerEvents: "none",
      },
    },
    size: {
      default: {},
      small: {
        fontSize: "11px",
        padding: "2px $smaller",
      },
    },
    variant: {
      error: {
        backgroundColor: "#fee2e2",
        border: "1px solid #fca5a5",
        borderBottomColor: "#ef4444",
        borderTopColor: "#fecaca",
        color: "#991b1b",
      },
      outline: {
        backgroundColor: "transparent",
        border: "1px solid $borderStrong",
        borderBottomColor: "$borderEmphasis",
        borderTopColor: "$borderLight",
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
      success: {
        backgroundColor: "#dcfce7",
        border: "1px solid #86efac",
        borderBottomColor: "#4ade80",
        borderTopColor: "#bbf7d0",
        color: "#166534",
      },
      warning: {
        backgroundColor: "#fef3c7",
        border: "1px solid #fcd34d",
        borderBottomColor: "#f59e0b",
        borderTopColor: "#fde68a",
        color: "#92400e",
      },
    },
  },
});

const BadgeLoadingOverlayStyled = styled("div", {
  alignItems: "center",
  display: "flex",
  inset: 0,
  justifyContent: "center",
  position: "absolute",
  zIndex: 1,
});

export interface BadgeProps extends Omit<ComponentProps<typeof BadgeStyled>, "loading"> {
  children?: ReactNode;
  loading?: boolean;
}

export const Badge = ({ children, loading = false, ...props }: BadgeProps): JSX.Element => (
  <BadgeStyled loading={loading} {...props}>
    {children}
    {loading && (
      <BadgeLoadingOverlayStyled>
        <Spinner size="small" />
      </BadgeLoadingOverlayStyled>
    )}
  </BadgeStyled>
);
