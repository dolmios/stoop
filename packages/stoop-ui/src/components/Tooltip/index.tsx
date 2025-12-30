"use client";

import { useId, type MouseEvent, type ReactNode } from "react";
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

const PopoverStyled = styled("div", {
  display: "inline-flex",
  position: "relative",
  verticalAlign: "middle",
});

const PopoverTriggerStyled = styled("div", {
  cursor: "pointer",
  display: "inline-flex",
  position: "relative",
  verticalAlign: "middle",
});

const PopoverContentStyled = styled("div", {
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

export type TooltipProps = {
  ariaLabel?: string;
  children: ReactNode | ((onClose: () => void) => ReactNode);
  disabled?: boolean;
  minimal?: boolean;
  small?: boolean;
  trigger: ReactNode;
};

export function Tooltip({
  ariaLabel,
  children,
  disabled,
  minimal = false,
  small = false,
  trigger,
}: TooltipProps): ReactNode {
  const { contentRef, handleClick, handleClose, isMounted, isOpen, triggerRef } = useFloatingUI();
  const reactId = useId();
  const instanceId = `tooltip-${reactId}`;

  // Check if the tooltip is inside a modal
  const isInsideModal = triggerRef.current?.closest('[role="dialog"]') !== null;

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      handleClose();
    }
  }

  function handleTriggerClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!disabled) {
      handleClick();
    }
  }

  useOutsideClick(contentRef, () => handleClose());
  useEventListener("keydown", handleKeyDown);

  return (
    <PopoverStyled>
      <PopoverTriggerStyled
        ref={triggerRef}
        aria-controls={`${instanceId}-content`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={(e: MouseEvent) => handleTriggerClick(e)}>
        {trigger}
      </PopoverTriggerStyled>

      {isMounted &&
        createPortal(
          <PopoverContentStyled
            ref={contentRef}
            animation={isOpen}
            aria-label={ariaLabel}
            css={{
              width: "auto",
              zIndex: isInsideModal ? "$modalPopover" : "$popover",
            }}
            data-popover="true"
            id={`${instanceId}-content`}
            minimal={minimal}
            role="region"
            small={small}>
            {typeof children === "function" ? children(handleClose) : children}
          </PopoverContentStyled>,
          document.body,
        )}
    </PopoverStyled>
  );
}
