"use client";

import type { JSX, MouseEvent, ReactNode } from "react";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { useEventListener } from "../../hooks/useEventListener";
import { useFloatingUI } from "../../hooks/useFloatingUI";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { keyframes, styled } from "../../stoop.theme";

const fadeInUp = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(4px)",
  },
  to: {
    opacity: 1,
    transform: "translateY(0)",
  },
});

const fadeOutDown = keyframes({
  from: {
    opacity: 1,
    transform: "translateY(0)",
  },
  to: {
    opacity: 0,
    transform: "translateY(4px)",
  },
});

const SelectStyled = styled("div", {
  display: "inline-flex",
  position: "relative",
  width: "100%",
});

const SelectTriggerStyled = styled("button", {
  "&:active": {
    boxShadow: "$inset",
    transform: "translateY(0)",
    transition: "$fast",
  },
  "&:disabled": {
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
  display: "flex",
  fontFamily: "$body",
  fontSize: "$default",
  justifyContent: "space-between",
  padding: "$small $medium",
  position: "relative",
  transition: "$default",
  variants: {
    error: {
      false: {},
      true: {
        borderBottomColor: "$errorDark",
        borderColor: "$error",
        borderTopColor: "$errorLight",
      },
    },
    success: {
      false: {},
      true: {
        borderBottomColor: "$successDark",
        borderColor: "$success",
        borderTopColor: "$successLight",
      },
    },
  },
  width: "100%",
});

const SelectValueStyled = styled("span", {
  flex: 1,
  textAlign: "left",
  variants: {
    placeholder: {
      false: {},
      true: {
        color: "$textSecondary",
      },
    },
  },
});

const SelectIconStyled = styled("span", {
  alignItems: "center",
  display: "flex",
  marginLeft: "$small",
  transition: "$default",
  variants: {
    open: {
      false: {},
      true: {
        transform: "rotate(180deg)",
      },
    },
  },
});

const SelectDropdownStyled = styled("div", {
  "&::-webkit-scrollbar": {
    display: "none",
  },
  backgroundColor: "$surface",
  border: "1px solid $borderStrong",
  borderBottomColor: "$borderEmphasis",
  borderRadius: "$default",
  borderTopColor: "$borderLight",
  boxShadow: "$medium",
  maxHeight: "300px",
  overflow: "hidden",
  overflowY: "auto",
  padding: "$smaller",
  pointerEvents: "auto",
  scrollbarWidth: "none",
  transformOrigin: "top center",
  variants: {
    animation: {
      false: {
        animation: `${fadeOutDown} 200ms ease-out`,
        animationFillMode: "forwards",
      },
      true: {
        animation: `${fadeInUp} 200ms ease-out`,
        animationFillMode: "forwards",
      },
    },
  },
  willChange: "transform, opacity",
});

const SelectOptionStyled = styled("div", {
  "&:active": {
    boxShadow: "$inset",
    transform: "translateY(0)",
    transition: "$fast",
  },
  "&:hover": {
    backgroundColor: "$surfaceHover",
    borderBottomColor: "$borderEmphasis",
    borderTopColor: "$border",
    boxShadow: "$default",
  },
  alignItems: "center",
  backgroundColor: "$surface",
  border: "1px solid $borderStrong",
  borderBottomColor: "$borderEmphasis",
  borderRadius: "$small",
  borderTopColor: "$borderLight",
  boxShadow: "$subtle",
  color: "$text",
  cursor: "pointer",
  display: "flex",
  fontFamily: "$body",
  fontSize: "$default",
  justifyContent: "space-between",
  margin: "$smallest 0",
  padding: "$smaller $small",
  transition: "$default",
  userSelect: "none",
  variants: {
    focused: {
      false: {},
      true: {
        backgroundColor: "$surfaceHover",
        boxShadow: "$default",
      },
    },
    selected: {
      false: {},
      true: {
        "&:hover": {
          boxShadow: "$medium",
        },
        backgroundColor: "$surfaceHover",
        borderBottomColor: "$borderEmphasis",
        boxShadow: "$default",
        fontWeight: "$bold",
      },
    },
  },
});

const SelectOptionContentStyled = styled("div", {
  alignItems: "center",
  display: "flex",
  gap: "$small",
  justifyContent: "space-between",
  width: "100%",
});

const SelectLabelStyled = styled("label", {
  color: "$text",
  display: "block",
  fontSize: "$small",
  fontWeight: "$default",
  marginBottom: "$smaller",
});

const SelectWrapperStyled = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$smaller",
  width: "100%",
});

const SelectErrorMessageStyled = styled("div", {
  color: "$error",
  fontSize: "$small",
});

const SelectSuccessMessageStyled = styled("div", {
  color: "$success",
  fontSize: "$small",
});

export type SelectOption = {
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  label: string;
  value: string;
};

export interface SelectProps {
  ariaLabel?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  onSelection?: (value: string, label: string) => void;
  options: SelectOption[];
  placeholder?: string;
  success?: boolean;
  successMessage?: string;
  value?: string;
}

export const Select = ({
  ariaLabel,
  disabled = false,
  error,
  errorMessage,
  label,
  onSelection,
  options,
  placeholder = "Select an option...",
  success,
  successMessage,
  value,
}: SelectProps): JSX.Element => {
  const reactId = useId();
  const instanceId = `select-${reactId}`;

  const [focused, setFocused] = useState("");
  const [internalValue, setInternalValue] = useState<string | undefined>(value);

  const select = useFloatingUI<HTMLButtonElement, HTMLDivElement>();

  // Sync internal value with controlled value
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const selectedOption = options.find((option) => option.value === (value ?? internalValue));

  function handleClick(): void {
    if (!disabled) {
      select.handleClick();
    }
  }

  function handleClose(): void {
    setFocused("");
    select.handleClose();
  }

  function handleSelection(optionValue: string, optionLabel: string): void {
    if (!disabled) {
      if (value === undefined) {
        setInternalValue(optionValue);
      }
      if (onSelection) {
        onSelection(optionValue, optionLabel);
      }
      handleClose();
    }
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (!select.isOpen || disabled) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const currentIndex = options.findIndex((option) => option.value === focused);
      const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;

      setFocused(options[nextIndex].value);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const currentIndex = options.findIndex((option) => option.value === focused);
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;

      setFocused(options[prevIndex].value);
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selected = options.find((option) => option.value === focused);

      if (selected) {
        handleSelection(selected.value, selected.label);
      }
    }
  }

  function handleItemMouseOver(optionValue: string): void {
    setFocused(optionValue);
  }

  useEffect(() => {
    if (select.isOpen && select.contentRef.current && select.triggerRef.current) {
      select.contentRef.current.focus();
      // Match dropdown width to trigger width
      const triggerWidth = select.triggerRef.current.offsetWidth;

      if (select.contentRef.current) {
        select.contentRef.current.style.width = `${triggerWidth}px`;
      }
      // Set initial focus to selected option or first option
      const initialFocus = selectedOption?.value ?? options[0]?.value;

      if (initialFocus) {
        setFocused(initialFocus);
      }
    } else {
      setFocused("");
    }
  }, [select.isOpen, select.contentRef, select.triggerRef, selectedOption, options]);

  useEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape" && select.isOpen) {
      event.preventDefault();
      handleClose();
    }
  });

  useEventListener("keydown", handleKeyDown, select.contentRef);

  useOutsideClick(select.contentRef, () => handleClose());

  // Check if the select is inside a modal
  const isInsideModal = select.triggerRef.current?.closest('[role="dialog"]') !== null;

  return (
    <SelectWrapperStyled>
      {label && <SelectLabelStyled htmlFor={instanceId}>{label}</SelectLabelStyled>}
      <SelectStyled>
        <SelectTriggerStyled
          ref={select.triggerRef}
          aria-controls={`${instanceId}-dropdown`}
          aria-expanded={select.isOpen}
          aria-haspopup="listbox"
          disabled={disabled}
          error={error}
          id={instanceId}
          success={success}
          type="button"
          onClick={(e: MouseEvent): void => {
            e.stopPropagation();
            handleClick();
          }}>
          <SelectValueStyled placeholder={!selectedOption}>
            {selectedOption?.label ?? placeholder}
          </SelectValueStyled>
          <SelectIconStyled open={select.isOpen}>▼</SelectIconStyled>
        </SelectTriggerStyled>

        {select.isMounted &&
          createPortal(
            <SelectDropdownStyled
              ref={select.contentRef}
              animation={select.isOpen}
              aria-label={ariaLabel || "Select"}
              css={{
                zIndex: isInsideModal ? "$modalPopover" : "$popover",
              }}
              data-select-dropdown="true"
              id={`${instanceId}-dropdown`}
              role="listbox"
              tabIndex={-1}>
              {options.map((option) => (
                <SelectOptionStyled
                  key={option.value}
                  aria-selected={option.value === (value ?? internalValue) || undefined}
                  focused={option.value === focused}
                  role="option"
                  selected={option.value === (value ?? internalValue)}
                  onClick={() => handleSelection(option.value, option.label)}
                  onMouseOver={() => handleItemMouseOver(option.value)}>
                  <SelectOptionContentStyled>
                    {option.icon && option.iconPosition === "left" && (
                      <span style={{ order: -1 }}>{option.icon}</span>
                    )}
                    {option.label}
                    {option.icon && option.iconPosition !== "left" && (
                      <span style={{ order: 1 }}>{option.icon}</span>
                    )}
                  </SelectOptionContentStyled>
                </SelectOptionStyled>
              ))}
            </SelectDropdownStyled>,
            document.body,
          )}
      </SelectStyled>
      {error && errorMessage && <SelectErrorMessageStyled>{errorMessage}</SelectErrorMessageStyled>}
      {success && successMessage && (
        <SelectSuccessMessageStyled>{successMessage}</SelectSuccessMessageStyled>
      )}
    </SelectWrapperStyled>
  );
};
