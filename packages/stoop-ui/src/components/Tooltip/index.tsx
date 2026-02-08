"use client";

import type { JSX, ReactNode } from "react";

import { useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

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

const TooltipStyled = styled("div", {
  display: "inline-flex",
  position: "relative",
  verticalAlign: "middle",
});

const TooltipTriggerStyled = styled("div", {
  cursor: "pointer",
  display: "inline-flex",
  position: "relative",
  verticalAlign: "middle",
});

const TooltipContentStyled = styled("div", {
  "&::-webkit-scrollbar": {
    display: "none",
  },
  backdropFilter: "blur(4px)",
  backgroundColor: "$surface",
  border: "1px solid $borderStrong",
  borderBottomColor: "$borderEmphasis",
  borderRadius: "$default",
  borderTopColor: "$border",
  boxShadow: "$medium",
  overflowY: "auto",
  padding: "$smaller $medium",
  pointerEvents: "auto",
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
    minimal: {
      false: {},
      true: {
        padding: 0,
      },
    },
    small: {
      false: {
        maxWidth: "420px",
        minWidth: "250px",
        mobile: {
          maxWidth: "calc(100vw - 32px)",
        },
      },
      true: {
        maxWidth: "280px",
        minWidth: "200px",
        mobile: {
          maxWidth: "calc(100vw - 32px)",
        },
      },
    },
  },
  width: "100%",
  willChange: "transform, opacity",
});

export interface TooltipProps {
  ariaLabel?: string;
  children: ReactNode | ((onClose: () => void) => ReactNode);
  disabled?: boolean;
  minimal?: boolean;
  mode?: "click" | "hover";
  small?: boolean;
  trigger: ReactNode;
}

export const Tooltip = ({
  ariaLabel,
  children,
  disabled,
  minimal = false,
  mode = "click",
  small = false,
  trigger,
}: TooltipProps): JSX.Element => {
  const floatingUI = useFloatingUI();
  const reactId = useId();
  const instanceId = `tooltip-${reactId}`;
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if the tooltip is inside a modal
  const isInsideModal = floatingUI.triggerRef.current?.closest('[role="dialog"]') !== null;

  const handleClick = useCallback((): void => {
    if (disabled) return;
    floatingUI.handleClick();
  }, [disabled, floatingUI]);

  const handleMouseEnter = useCallback((): void => {
    if (disabled || mode !== "hover") return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    // Only open if not already open
    if (!floatingUI.isOpen && !floatingUI.isMounted) {
      floatingUI.handleClick();
    }
  }, [disabled, floatingUI, mode]);

  const handleMouseLeave = useCallback((): void => {
    if (mode !== "hover") return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      floatingUI.handleClose();
      hoverTimeoutRef.current = null;
    }, 150);
  }, [floatingUI, mode]);

  const handleContentMouseEnter = useCallback((): void => {
    if (mode !== "hover") return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, [mode]);

  const handleContentMouseLeave = useCallback((): void => {
    if (mode !== "hover") return;
    floatingUI.handleClose();
  }, [floatingUI, mode]);

  // Handle outside click for click mode
  useOutsideClick(floatingUI.contentRef, (): void => {
    if (mode === "click" && floatingUI.isOpen) {
      floatingUI.handleClose();
    }
  });

  // Cleanup timeout on unmount
  useEffect((): (() => void) => {
    return (): void => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <TooltipStyled>
      <TooltipTriggerStyled
        ref={floatingUI.triggerRef}
        aria-controls={`${instanceId}-content`}
        aria-expanded={floatingUI.isOpen}
        aria-haspopup="dialog"
        onClick={mode === "click" ? handleClick : undefined}
        onMouseEnter={mode === "hover" ? handleMouseEnter : undefined}
        onMouseLeave={mode === "hover" ? handleMouseLeave : undefined}>
        {trigger}
      </TooltipTriggerStyled>

      {floatingUI.isMounted &&
        createPortal(
          <TooltipContentStyled
            ref={floatingUI.contentRef}
            animation={floatingUI.isOpen}
            aria-label={ariaLabel}
            css={{
              width: "auto",
              zIndex: isInsideModal ? "$modalPopover" : "$popover",
            }}
            data-popover="true"
            id={`${instanceId}-content`}
            minimal={minimal}
            role="region"
            small={small}
            onMouseEnter={mode === "hover" ? handleContentMouseEnter : undefined}
            onMouseLeave={mode === "hover" ? handleContentMouseLeave : undefined}>
            {typeof children === "function" ? children(floatingUI.handleClose) : children}
          </TooltipContentStyled>,
          document.body,
        )}
    </TooltipStyled>
  );
};
