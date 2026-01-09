"use client";

import { forwardRef, type ComponentProps, type ForwardedRef } from "react";

import { styled } from "../../stoop.theme";
import { Spinner } from "../Spinner";

const InputWrapperStyled = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$smaller",
  position: "relative",
  width: "100%",
});

const InputLabelStyled = styled("label", {
  color: "$text",
  fontSize: "$small",
  fontWeight: "$default",
});

const InputStyled = styled("input", {
  "&::placeholder": {
    color: "$textSecondary",
    opacity: 0.6,
  },
  "&:disabled": {
    cursor: "not-allowed",
    opacity: "$disabled",
    pointerEvents: "none",
  },
  "&:focus": {
    borderBottomColor: "$text",
    borderColor: "$text",
    boxShadow: "$subtle, 0 0 0 2px rgba(26, 26, 26, 0.1)",
    outline: "none",
  },
  backgroundColor: "$surface",
  border: "1px solid $borderStrong",
  borderBottomColor: "$borderEmphasis",
  borderRadius: "$default",
  borderTopColor: "$borderLight",
  boxShadow: "$subtle",
  color: "$text",
  fontFamily: "$body",
  fontSize: "$default",
  lineHeight: 1.5,
  padding: "$small $medium",
  position: "relative",
  transition: "$default",
  variants: {
    error: {
      false: {},
      true: {
        "&:focus": {
          borderBottomColor: "#dc2626",
          borderColor: "#dc2626",
          boxShadow: "$subtle, 0 0 0 2px rgba(220, 38, 38, 0.1)",
        },
        borderBottomColor: "#b91c1c",
        borderColor: "#dc2626",
        borderTopColor: "#ef4444",
      },
    },
    loading: {
      false: {},
      true: {
        opacity: "$disabled",
        pointerEvents: "none",
      },
    },
    success: {
      false: {},
      true: {
        "&:focus": {
          borderBottomColor: "#16a34a",
          borderColor: "#16a34a",
          boxShadow: "$subtle, 0 0 0 2px rgba(22, 163, 74, 0.1)",
        },
        borderBottomColor: "#15803d",
        borderColor: "#16a34a",
        borderTopColor: "#22c55e",
      },
    },
  },
  width: "100%",
});

const InputTextareaStyled = styled("textarea", {
  "&::placeholder": {
    color: "$textSecondary",
    opacity: 0.6,
  },
  "&:disabled": {
    cursor: "not-allowed",
    opacity: "$disabled",
    pointerEvents: "none",
  },
  "&:focus": {
    borderBottomColor: "$text",
    borderColor: "$text",
    boxShadow: "$subtle, 0 0 0 2px rgba(26, 26, 26, 0.1)",
    outline: "none",
  },
  backgroundColor: "$surface",
  border: "1px solid $borderStrong",
  borderBottomColor: "$borderEmphasis",
  borderRadius: "$default",
  borderTopColor: "$borderLight",
  boxShadow: "$subtle",
  color: "$text",
  fontFamily: "$body",
  fontSize: "$default",
  lineHeight: 1.5,
  minHeight: "100px",
  padding: "$small $medium",
  position: "relative",
  resize: "vertical",
  transition: "$default",
  variants: {
    error: {
      false: {},
      true: {
        "&:focus": {
          borderBottomColor: "#dc2626",
          borderColor: "#dc2626",
          boxShadow: "$subtle, 0 0 0 2px rgba(220, 38, 38, 0.1)",
        },
        borderBottomColor: "#b91c1c",
        borderColor: "#dc2626",
        borderTopColor: "#ef4444",
      },
    },
    loading: {
      false: {},
      true: {
        opacity: "$disabled",
        pointerEvents: "none",
      },
    },
    success: {
      false: {},
      true: {
        "&:focus": {
          borderBottomColor: "#16a34a",
          borderColor: "#16a34a",
          boxShadow: "$subtle, 0 0 0 2px rgba(22, 163, 74, 0.1)",
        },
        borderBottomColor: "#15803d",
        borderColor: "#16a34a",
        borderTopColor: "#22c55e",
      },
    },
  },
  width: "100%",
});

const InputErrorMessageStyled = styled("div", {
  color: "#dc2626",
  fontSize: "$small",
});

const InputSuccessMessageStyled = styled("div", {
  color: "#16a34a",
  fontSize: "$small",
});

const InputLoadingOverlayStyled = styled("div", {
  alignItems: "center",
  display: "flex",
  inset: "0 0 0 0",
  justifyContent: "center",
  pointerEvents: "none",
  position: "absolute",
  zIndex: 1,
});

export interface InputProps extends Omit<
  ComponentProps<typeof InputStyled>,
  "error" | "loading" | "success"
> {
  error?: boolean;
  errorMessage?: string;
  label?: string;
  loading?: boolean;
  success?: boolean;
  successMessage?: string;
  textarea?: boolean;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      error,
      errorMessage,
      id,
      label,
      loading = false,
      success,
      successMessage,
      textarea,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const inputElement = textarea ? (
      <InputTextareaStyled
        {...(props as ComponentProps<typeof InputTextareaStyled>)}
        ref={ref as ForwardedRef<HTMLTextAreaElement>}
        error={error}
        id={inputId}
        loading={loading}
        success={success}
      />
    ) : (
      <InputStyled
        {...(props as ComponentProps<typeof InputStyled>)}
        ref={ref as ForwardedRef<HTMLInputElement>}
        error={error}
        id={inputId}
        loading={loading}
        success={success}
      />
    );

    return (
      <InputWrapperStyled>
        {label && <InputLabelStyled htmlFor={inputId}>{label}</InputLabelStyled>}
        <div style={{ position: "relative", width: "100%" }}>
          {inputElement}
          {loading && (
            <InputLoadingOverlayStyled>
              <Spinner size="small" />
            </InputLoadingOverlayStyled>
          )}
        </div>
        {error && errorMessage && <InputErrorMessageStyled>{errorMessage}</InputErrorMessageStyled>}
        {success && successMessage && (
          <InputSuccessMessageStyled>{successMessage}</InputSuccessMessageStyled>
        )}
      </InputWrapperStyled>
    );
  },
);

Input.displayName = "Input";
