"use client";

import type {
  ComponentProps,
  ReactNode,
  ElementType,
  ComponentPropsWithoutRef,
  ReactElement,
} from "react";

import { styled, keyframes } from "../../stoop.theme";

const pulse = keyframes({
  "0%, 100%": {
    opacity: 1,
  },
  "50%": {
    opacity: 0.5,
  },
});

const ButtonStyled = styled("button", {
  "&:active:not(:disabled)": {
    boxShadow: "$inset",
    transform: "translateY(0)",
    transition: "$fast",
  },
  "&:disabled": {
    "&:focus-visible": {
      outline: "none",
    },
    cursor: "not-allowed",
    opacity: "$disabled",
    pointerEvents: "none",
  },
  "&:focus-visible": {
    outline: "2px solid $text",
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
  fontWeight: "$default",
  gap: "$smaller",
  justifyContent: "center",
  lineHeight: 1.5,
  padding: "$small $medium",
  position: "relative",
  transition: "$default",
  userSelect: "none",
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
        pointerEvents: "none",
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
      danger: {
        "&:active:not(:disabled)": {
          backgroundColor: "#991b1b",
          borderColor: "#991b1b",
        },
        "&:hover:not(:disabled)": {
          backgroundColor: "#dc2626",
          borderColor: "#dc2626",
          boxShadow: "$default",
        },
        backgroundColor: "#ef4444",
        borderColor: "#ef4444",
        color: "#ffffff",
      },
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

const ButtonLoadingStyled = styled("div", {
  alignItems: "center",
  display: "flex",
  inset: 0,
  justifyContent: "center",
  position: "absolute",
  zIndex: 1,
});

const ButtonLoadingSpinnerStyled = styled("div", {
  animation: `${pulse} 1.5s ease-in-out infinite`,
  border: "2px solid $border",
  borderRadius: "50%",
  borderTopColor: "$text",
  height: "16px",
  width: "16px",
});

const ButtonIconWrapperStyled = styled("span", {
  display: "inline-flex",
});

export interface ButtonProps<T extends ElementType = "button"> extends Omit<
  ComponentProps<typeof ButtonStyled>,
  "loading" | "as"
> {
  as?: T;
  children?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = <T extends ElementType = "button">({
  as,
  children,
  disabled = false,
  icon,
  iconPosition = "left",
  loading = false,
  ...props
}: ButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>): ReactElement => {
  const isDisabled = disabled || loading;
  const showLeftIcon = icon && iconPosition === "left";
  const showRightIcon = icon && iconPosition === "right";

  return (
    <ButtonStyled
      {...props}
      aria-busy={loading || undefined}
      as={as}
      disabled={isDisabled}
      loading={loading}>
      {loading && (
        <ButtonLoadingStyled>
          <ButtonLoadingSpinnerStyled />
        </ButtonLoadingStyled>
      )}
      {showLeftIcon && (
        <ButtonIconWrapperStyled css={{ marginRight: "$small" }}>{icon}</ButtonIconWrapperStyled>
      )}
      {children}
      {showRightIcon && (
        <ButtonIconWrapperStyled css={{ marginLeft: "$small" }}>{icon}</ButtonIconWrapperStyled>
      )}
    </ButtonStyled>
  );
};
