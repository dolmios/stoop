"use client";

import { forwardRef, type ComponentProps, type ForwardedRef } from "react";

import { styled } from "../../stoop.theme";

const InputWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$smaller",
  width: "100%",
});

const InputLabel = styled("label", {
  color: "$text",
  fontSize: "$small",
  fontWeight: "$default",
});

const InputStyled = styled("input" as const, {
  "&:disabled": {
    cursor: "not-allowed",
    opacity: "$disabled",
  },
  "&:focus": {
    borderColor: "$text",
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
  padding: "$small $medium",
  transition: "$default",
  variants: {
    error: {
      false: {},
      true: {
        borderBottomColor: "#b91c1c",
        borderColor: "#dc2626",
        borderTopColor: "#ef4444",
      },
    },
    success: {
      false: {},
      true: {
        borderBottomColor: "#15803d",
        borderColor: "#16a34a",
        borderTopColor: "#22c55e",
      },
    },
  },
  width: "100%",
});

const TextareaStyled = styled("textarea", {
  "&:disabled": {
    cursor: "not-allowed",
    opacity: "$disabled",
  },
  "&:focus": {
    borderColor: "$text",
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
  minHeight: "100px",
  padding: "$small $medium",
  resize: "vertical",
  transition: "$default",
  variants: {
    error: {
      false: {},
      true: {
        borderBottomColor: "#b91c1c",
        borderColor: "#dc2626",
        borderTopColor: "#ef4444",
      },
    },
    success: {
      false: {},
      true: {
        borderBottomColor: "#15803d",
        borderColor: "#16a34a",
        borderTopColor: "#22c55e",
      },
    },
  },
  width: "100%",
});

const ErrorMessage = styled("div", {
  color: "#dc2626",
  fontSize: "$small",
});

const SuccessMessage = styled("div", {
  color: "#16a34a",
  fontSize: "$small",
});

export type InputProps = Omit<ComponentProps<typeof InputStyled>, "error" | "success"> & {
  error?: boolean;
  errorMessage?: string;
  label?: string;
  success?: boolean;
  successMessage?: string;
  textarea?: boolean;
};

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ error, errorMessage, id, label, success, successMessage, textarea, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const inputElement = textarea ? (
      <TextareaStyled
        {...(props as ComponentProps<typeof TextareaStyled>)}
        ref={ref as ForwardedRef<HTMLTextAreaElement>}
        error={error}
        id={inputId}
        success={success}
      />
    ) : (
      <InputStyled
        {...(props as ComponentProps<typeof InputStyled>)}
        ref={ref as ForwardedRef<HTMLInputElement>}
        error={error}
        id={inputId}
        success={success}
      />
    );

    return (
      <InputWrapper>
        {label && <InputLabel htmlFor={inputId}>{label}</InputLabel>}
        {inputElement}
        {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        {success && successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      </InputWrapper>
    );
  },
);

Input.displayName = "Input";
