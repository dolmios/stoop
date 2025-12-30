import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export interface UseModalReturn {
  handleClick: () => void;
  handleClose: () => void;
  handleOpen: () => void;
  isMounted: boolean;
  isOpen: boolean;
  modalRef: RefObject<HTMLDivElement | null>;
}

export function useModal({
  animationDuration = 200,
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  preventBodyScroll = true,
}: {
  animationDuration?: number;
  isOpen?: boolean;
  onClose?: () => void;
  preventBodyScroll?: boolean;
} = {}): UseModalReturn {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const isControlled = externalIsOpen !== undefined;

  const modalRef = useRef<HTMLDivElement | null>(null);

  // Modal functions
  function handleOpen(): void {
    if (isControlled) {
      setIsMounted(true);
    } else {
      setInternalIsOpen(true);
      setIsMounted(true);
    }
  }

  const handleClose = useCallback((): void => {
    if (isControlled) {
      setIsMounted(false);
      externalOnClose?.();
    } else {
      setInternalIsOpen(false);
      setTimeout(() => {
        setIsMounted(false);
        externalOnClose?.();
      }, animationDuration);
    }
  }, [isControlled, externalOnClose, animationDuration]);

  function handleClick(): void {
    if (isOpen || isMounted) {
      handleClose();
    } else {
      handleOpen();
    }
  }

  // In controlled mode, sync isMounted with isOpen
  useEffect(() => {
    if (isControlled) {
      setIsMounted(externalIsOpen ?? false);
    }
  }, [isControlled, externalIsOpen]);

  // Clean scroll lock
  useEffect(() => {
    if (!preventBodyScroll || !isMounted) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    // iOS momentum scrolling prevention
    const preventScroll = (e: TouchEvent): void => {
      const target = e.target as Element;

      if (modalRef?.current && modalRef.current.contains(target)) {
        return;
      }

      e.preventDefault();
    };

    const isTouch = "ontouchstart" in window;

    if (isTouch) {
      document.addEventListener("touchmove", preventScroll, { passive: false });
    }

    return (): void => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      if (isTouch) {
        document.removeEventListener("touchmove", preventScroll);
      }
    };
  }, [isMounted, preventBodyScroll]);

  return {
    handleClick,
    handleClose,
    handleOpen,
    isMounted,
    isOpen,
    modalRef,
  };
}
