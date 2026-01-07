"use client";

import { useEffect, useId, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { useEventListener } from "../../hooks/useEventListener";
import { useModal } from "../../hooks/useModal";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { keyframes, styled } from "../../stoop.theme";
import { Button as ButtonComponent } from "../Button";

const fadeIn = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

const fadeOut = keyframes({
  from: {
    opacity: 1,
  },
  to: {
    opacity: 0,
  },
});

const slideInScale = keyframes({
  from: {
    opacity: 0,
    transform: "scale(0.95)",
  },
  to: {
    opacity: 1,
    transform: "scale(1)",
  },
});

const slideOutScale = keyframes({
  from: {
    opacity: 1,
    transform: "scale(1)",
  },
  to: {
    opacity: 0,
    transform: "scale(0.95)",
  },
});

const MenuStyled = styled("div", {
  display: "inline-flex",
  height: "100%",
  verticalAlign: "middle",
});

const MenuTriggerStyled = styled("div", {
  cursor: "pointer",
  display: "inline-flex",
  position: "relative",
  verticalAlign: "middle",
});

const MenuOverlayStyled = styled("div", {
  alignItems: "center",
  backdropFilter: "blur(2px)",
  backgroundColor: "$overlay",
  display: "flex",
  height: "100vh",
  inset: 0,
  justifyContent: "center",
  overflow: "hidden",
  pointerEvents: "auto",
  position: "fixed",
  transition: "$default",
  variants: {
    animation: {
      false: {
        animation: `${fadeOut} 200ms ease-in-out`,
        animationFillMode: "forwards",
      },
      true: {
        animation: `${fadeIn} 200ms ease-in-out`,
        animationFillMode: "forwards",
      },
    },
  },
  zIndex: "$menu",
});

const MenuGroupStyled = styled("div", {
  "&::-webkit-scrollbar": {
    display: "none",
  },
  backgroundColor: "$surface",
  border: "1px solid $borderStrong",
  borderBottomColor: "$borderEmphasis",
  borderRadius: "$default",
  borderTopColor: "$borderLight",
  boxShadow: "$largest",
  maxHeight: "80vh",
  maxWidth: "90%",
  mobile: {
    maxHeight: "90vh",
    maxWidth: "95%",
  },
  overflow: "hidden",
  overflowY: "auto",
  padding: "$smaller",
  position: "relative",
  variants: {
    animation: {
      false: {
        animation: `${slideOutScale} 200ms ease-out`,
        animationFillMode: "forwards",
      },
      true: {
        animation: `${slideInScale} 200ms ease-out`,
        animationFillMode: "forwards",
      },
    },
  },
  width: "100%",
});

const MenuItemStyled = styled("div", {
  "&:active": {
    boxShadow: "$inset",
    transform: "translateY(0)",
    transition: "$fast",
  },
  "&:hover": {
    backgroundColor: "$surfaceHover",
    borderBottomColor: "$borderEmphasis",
    borderTopColor: "$borderLight",
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
  fontFamily: "$heading",
  fontSize: "$default",
  fontWeight: "$bold",
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

const MenuItemContentStyled = styled("div", {
  alignItems: "center",
  display: "flex",
  gap: "$small",
  justifyContent: "space-between",
  width: "100%",
});

const MenuItemIconStyled = styled("div", {
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  variants: {
    align: {
      left: {
        order: -1,
      },
      right: {
        order: 1,
      },
    },
  },
});

const MenuContentStyled = styled("div", {
  display: "block",
  padding: "$medium $small",
});

const MenuHeaderStyled = styled("div", {
  alignItems: "center",
  backgroundColor: "$surfaceLight",
  borderBottom: "1px solid $border",
  display: "flex",
  fontFamily: "$heading",
  fontWeight: "$bold",
  justifyContent: "space-between",
  margin: "-$smaller -$smaller $smaller -$smaller",
  padding: "$small $medium",
});

export type MenuOption = {
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  label: string;
  value: string;
};

export type MenuProps = {
  ariaLabel?: string;
  children?: ReactNode | ((onClose: () => void) => ReactNode);
  initial?: string;
  onSelection?: (value: string, label: string) => void;
  options: MenuOption[];
  trigger: ReactNode;
};

export function Menu({
  ariaLabel,
  children,
  initial,
  onSelection,
  options,
  trigger,
}: MenuProps): ReactNode {
  const reactId = useId();
  const instanceId = `menu-${reactId}`;

  const [focused, setFocused] = useState("");

  const menu = useModal();

  function handleClick(): void {
    menu.handleClick();
  }

  function handleClose(): void {
    setFocused("");
    menu.handleClose();
  }

  function handleSelection(value: string, label: string): void {
    if (onSelection) {
      onSelection(value, label);
    }
    handleClose();
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (!menu.isOpen) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const index = options.findIndex((option) => option.value === focused);

      if (index < options.length - 1) {
        setFocused(options[index + 1].value);
      }
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const index = options.findIndex((option) => option.value === focused);

      if (index > 0) {
        setFocused(options[index - 1].value);
      }
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const index = options.findIndex((option) => option.value === focused);

      if (index >= 0) {
        handleSelection(options[index].value, options[index].label);
      }
    }
  }

  function handleItemMouseOver(value: string): void {
    setFocused(value);
  }

  useEffect(() => {
    if (menu.isOpen && menu.modalRef.current) {
      menu.modalRef.current.focus();
    } else {
      setFocused("");
    }
  }, [menu.isOpen, menu.modalRef]);

  useEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      handleClose();
    }
  });

  useEventListener("keydown", handleKeyDown, menu.modalRef);

  useOutsideClick(menu.modalRef, () => handleClose());

  return (
    <MenuStyled>
      <MenuTriggerStyled
        aria-controls={`${instanceId}-content`}
        aria-expanded={menu.isOpen}
        aria-haspopup="menu"
        onClick={(e: MouseEvent): void => {
          e.stopPropagation();
          handleClick();
        }}>
        {trigger}
      </MenuTriggerStyled>

      {menu.isMounted &&
        createPortal(
          <MenuOverlayStyled animation={menu.isOpen}>
            <MenuGroupStyled
              ref={menu.modalRef}
              animation={menu.isOpen}
              aria-label={ariaLabel || "Menu"}
              id={`${instanceId}-content`}
              role="menu"
              tabIndex={-1}>
              <MenuHeaderStyled>
                <div>Menu</div>
                <ButtonComponent size="small" variant="minimal" onClick={() => handleClose()}>
                  Close
                </ButtonComponent>
              </MenuHeaderStyled>

              {options.map((option) => (
                <MenuItemStyled
                  key={option.value}
                  aria-checked={initial === option.value || undefined}
                  focused={option.value === focused}
                  role="menuitemradio"
                  selected={initial === option.value}
                  onClick={() => handleSelection(option.value, option.label)}
                  onMouseOver={() => handleItemMouseOver(option.value)}>
                  <MenuItemContentStyled>
                    {option.icon && option.iconPosition === "left" && (
                      <MenuItemIconStyled align="left">{option.icon}</MenuItemIconStyled>
                    )}
                    {option.label}
                    {option.icon && option.iconPosition !== "left" && (
                      <MenuItemIconStyled align="right">{option.icon}</MenuItemIconStyled>
                    )}
                  </MenuItemContentStyled>
                </MenuItemStyled>
              ))}

              {children && (
                <MenuContentStyled>
                  {typeof children === "function" ? children(handleClose) : children}
                </MenuContentStyled>
              )}
            </MenuGroupStyled>
          </MenuOverlayStyled>,
          document.body,
        )}
    </MenuStyled>
  );
}
