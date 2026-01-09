"use client";

import { useId, type JSX, type MouseEvent, type ReactNode } from "react";
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
    transform: "scale(0.95) translateY(-10px)",
  },
  to: {
    opacity: 1,
    transform: "scale(1) translateY(0)",
  },
});

const slideOutScale = keyframes({
  from: {
    opacity: 1,
    transform: "scale(1) translateY(0)",
  },
  to: {
    opacity: 0,
    transform: "scale(0.95) translateY(-10px)",
  },
});

const slideInFromRight = keyframes({
  from: {
    transform: "translateX(100%)",
  },
  to: {
    transform: "translateX(0)",
  },
});

const slideOutToRight = keyframes({
  from: {
    transform: "translateX(0)",
  },
  to: {
    transform: "translateX(100%)",
  },
});

const ModalStyled = styled("div", {
  display: "inline-flex",
  height: "100%",
  verticalAlign: "middle",
});

const ModalTriggerStyled = styled("div", {
  cursor: "pointer",
  display: "inline-flex",
  position: "relative",
  verticalAlign: "middle",
});

const ModalOverlayStyled = styled("div", {
  alignItems: "center",
  backdropFilter: "blur(4px)",
  backgroundColor: "$overlay",
  display: "flex",
  height: "100vh",
  inset: 0,
  justifyContent: "center",
  mobile: {
    padding: "$small",
  },
  overflow: "hidden",
  padding: "$medium",
  pointerEvents: "auto",
  position: "fixed",
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
  zIndex: "$modal",
});

const ModalGroupStyled = styled("div", {
  backgroundColor: "$surface",
  border: "1px solid $borderStrong",
  borderBottomColor: "$borderEmphasis",
  borderRadius: "$default",
  borderTopColor: "$borderLight",
  boxShadow: "$largest",
  display: "flex",
  flexDirection: "column",
  maxHeight: "80vh",
  maxWidth: "90%",
  mobile: {
    maxHeight: "90vh",
    maxWidth: "95%",
  },
  overflow: "hidden",
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
    mode: {
      dialog: {},
      drawer: {
        animation: {
          false: {
            animation: `${slideOutToRight} 200ms ease-out`,
            animationFillMode: "forwards",
          },
          true: {
            animation: `${slideInFromRight} 200ms ease-out`,
            animationFillMode: "forwards",
          },
        },
        height: "100vh",
        justifyContent: "flex-start",
        maxHeight: "100vh",
        maxWidth: "420px",
        position: "fixed",
        right: 0,
        top: 0,
      },
    },
    small: {
      false: {},
      true: {
        maxWidth: "280px",
      },
    },
  },
  width: "100%",
  willChange: "transform, opacity",
});

const ModalHeaderStyled = styled("div", {
  alignItems: "center",
  backgroundColor: "$surfaceLight",
  borderBottom: "1px solid $border",
  color: "$text",
  display: "flex",
  flexShrink: 0,
  fontFamily: "$heading",
  fontWeight: "$bold",
  justifyContent: "space-between",
  padding: "$medium $large",
  position: "sticky",
  top: 0,
  zIndex: "$sticky",
});

const ModalContentStyled = styled("div", {
  "&::-webkit-scrollbar": {
    display: "none",
  },
  backgroundColor: "$surface",
  flex: 1,
  overflowX: "hidden",
  overflowY: "auto",
  padding: "$large",
});

const ModalFooterStyled = styled("div", {
  alignItems: "center",
  backgroundColor: "$surface",
  borderTop: "1px solid $border",
  bottom: 0,
  color: "$text",
  display: "flex",
  flexDirection: "row",
  flexShrink: 0,
  gap: "$small",
  justifyContent: "flex-end",
  padding: "$medium $large",
  position: "sticky",
  width: "100%",
  zIndex: "$sticky",
});

export interface ModalProps {
  children?: ReactNode | ((onClose: () => void) => ReactNode);
  disabled?: boolean;
  footer?: ReactNode | ((onClose: () => void) => ReactNode);
  isOpen?: boolean;
  mode?: "dialog" | "drawer";
  onClose?: () => void;
  small?: boolean;
  title?: ReactNode;
  trigger?: ReactNode;
}

export const Modal = ({
  children,
  disabled,
  footer,
  isOpen,
  mode = "dialog",
  onClose,
  small,
  title,
  trigger,
}: ModalProps): JSX.Element => {
  const titleId = useId();
  const modal = useModal({
    isOpen,
    onClose,
  });

  function handleClick(): void {
    if (disabled) return;
    modal.handleClick();
  }

  const handleClose = isOpen !== undefined && onClose ? onClose : modal.handleClose;

  useEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      handleClose();
    }
  });

  useOutsideClick(modal.modalRef, () => handleClose());

  return (
    <ModalStyled>
      {isOpen === undefined && trigger && (
        <ModalTriggerStyled
          onClick={(e: MouseEvent): void => {
            e.stopPropagation();
            handleClick();
          }}>
          {trigger}
        </ModalTriggerStyled>
      )}

      {modal.isMounted &&
        createPortal(
          <ModalOverlayStyled animation={modal.isOpen}>
            <ModalGroupStyled
              ref={modal.modalRef}
              animation={modal.isOpen}
              aria-labelledby={titleId}
              aria-modal="true"
              data-modal="true"
              mode={mode}
              role="dialog"
              small={small}>
              {title && (
                <ModalHeaderStyled>
                  {typeof title === "string" ? (
                    <h4 id={titleId} style={{ margin: 0 }}>
                      {title}
                    </h4>
                  ) : (
                    <div id={titleId}>{title}</div>
                  )}
                  <ButtonComponent size="small" variant="minimal" onClick={() => handleClose()}>
                    Close
                  </ButtonComponent>
                </ModalHeaderStyled>
              )}

              <ModalContentStyled>
                {typeof children === "function" ? children(handleClose) : children}
              </ModalContentStyled>

              {footer && (
                <ModalFooterStyled>
                  {typeof footer === "function" ? footer(handleClose) : footer}
                </ModalFooterStyled>
              )}
            </ModalGroupStyled>
          </ModalOverlayStyled>,
          document.body,
        )}
    </ModalStyled>
  );
};
