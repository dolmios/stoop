"use client";

import type { ComponentProps, ReactNode } from "react";

import { styled, keyframes } from "../../stoop.theme";

const pulse = keyframes({
  "0%, 100%": {
    opacity: 1,
  },
  "50%": {
    opacity: 0.5,
  },
});

const ButtonStyled = styled("button" as const, {
  "&:active": {
    boxShadow: "$inset",
    transform: "translateY(0)",
    transition: "$fast",
  },
  "&:disabled": {
    cursor: "not-allowed",
    opacity: "$disabled",
  },
  "&:focus-visible": {
    outline: "2px solid $border",
    outlineOffset: "2px",
  },
  "&:hover:not(:disabled)": {
    backgroundColor: "$surfaceHover",
    borderBottomColor: "$borderEmphasis",
    borderTopColor: "$border",
    boxShadow: "$default",
    transform: "translateY(-1px)",
  },
  alignItems: "center",
  backgroundColor: "$surface",
  border: "1px solid $borderStrong",
  borderBottomColor: "$borderEmphasis",
  borderRadius: "$default",
  borderTopColor: "$borderLight",
  boxShadow: "$subtle",
  color: "$text",
  cursor: "pointer",
  display: "inline-flex",
  fontFamily: "$body",
  fontSize: "$default",
  justifyContent: "center",
  padding: "$small $medium",
  transition: "$default",
  variants: {
    active: {
      false: {},
      true: {
        "&:hover": {
          backgroundColor: "$text",
          borderColor: "$text",
        },
        backgroundColor: "$text",
        borderColor: "$text",
        color: "$background",
      },
    },
    loading: {
      false: {},
      true: {
        cursor: "wait",
        opacity: "$light",
        position: "relative",
      },
    },
    size: {
      default: {},
      small: {
        fontSize: "$small",
        padding: "$smaller $small",
      },
    },
    variant: {
      minimal: {
        "&:hover:not(:disabled)": {
          backgroundColor: "$surfaceHover",
          boxShadow: "none",
          transform: "none",
        },
        backgroundColor: "transparent",
        border: "none",
        boxShadow: "none",
      },
      primary: {
        "&:hover:not(:disabled)": {
          backgroundColor: "$text",
          borderColor: "$text",
          boxShadow: "$default",
        },
        backgroundColor: "$text",
        borderColor: "$text",
        color: "$background",
      },
      secondary: {
        "&:hover:not(:disabled)": {
          backgroundColor: "$surfaceHover",
          borderBottomColor: "$borderEmphasis",
          borderTopColor: "$border",
          boxShadow: "$default",
        },
        backgroundColor: "$surface",
        borderColor: "$border",
        color: "$text",
      },
    },
  },
});

const ButtonLoading = styled("div", {
  alignItems: "center",
  display: "flex",
  inset: 0,
  justifyContent: "center",
  position: "absolute",
  zIndex: 1,
});

const LoadingSpinner = styled("div", {
  animation: `${pulse} 1.5s ease-in-out infinite`,
  border: "2px solid $border",
  borderRadius: "50%",
  borderTopColor: "$text",
  height: "16px",
  width: "16px",
});

const IconWrapper = styled("span", {
  display: "inline-flex",
});

export interface ButtonProps extends Omit<ComponentProps<typeof ButtonStyled>, "loading"> {
  children?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export function Button({
  children,
  disabled = false,
  icon,
  iconPosition = "left",
  loading = false,
  ...props
}: ButtonProps): ReactNode {
  const isDisabled = disabled || loading;
  const showLeftIcon = icon && iconPosition === "left";
  const showRightIcon = icon && iconPosition === "right";

  return (
    <ButtonStyled
      {...props}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      loading={loading}>
      {loading && (
        <ButtonLoading>
          <LoadingSpinner />
        </ButtonLoading>
      )}
      {showLeftIcon && <IconWrapper css={{ marginRight: "$small" }}>{icon}</IconWrapper>}
      {children}
      {showRightIcon && <IconWrapper css={{ marginLeft: "$small" }}>{icon}</IconWrapper>}
    </ButtonStyled>
  );
}
