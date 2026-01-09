import {
  computePosition,
  offset,
  flip,
  shift,
  size,
  autoUpdate,
  limitShift,
  type Strategy,
  type ComputePositionReturn,
} from "@floating-ui/dom";
import { useState, useRef, useEffect, type RefObject } from "react";

export interface UseFloatingUIReturn<
  TTrigger extends HTMLElement = HTMLElement,
  TContent extends HTMLElement = HTMLDivElement,
> {
  contentRef: RefObject<TContent | null>;
  handleClick: () => void;
  handleClose: () => void;
  isMounted: boolean;
  isOpen: boolean;
  triggerRef: RefObject<TTrigger | null>;
}

export function useFloatingUI<
  TTrigger extends HTMLElement = HTMLElement,
  TContent extends HTMLElement = HTMLDivElement,
>(): UseFloatingUIReturn<TTrigger, TContent> {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const triggerRef = useRef<TTrigger | null>(null);
  const contentRef = useRef<TContent | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const updatePosition = (): void => {
    if (!triggerRef.current || !contentRef.current) return;

    const strategy: Strategy = "fixed";

    computePosition(triggerRef.current, contentRef.current, {
      middleware: [
        offset(8),
        flip({
          fallbackPlacements: [
            "bottom",
            "top",
            "bottom-start",
            "top-start",
            "bottom-end",
            "top-end",
          ],
          padding: 8,
        }),
        shift({
          limiter: limitShift(),
          padding: 8,
        }),
        size({
          apply({
            availableHeight,
            elements,
          }: {
            availableHeight: number;
            elements: { floating: { style: CSSStyleDeclaration } };
          }) {
            const maxHeight = Math.min(availableHeight - 16, 400);

            Object.assign(elements.floating.style, {
              maxHeight: `${maxHeight}px`,
            });
          },
          padding: 8,
        }),
      ],
      placement: "bottom",
      strategy,
    }).then(({ x, y }: ComputePositionReturn) => {
      if (!contentRef.current || !triggerRef.current) return;

      contentRef.current.style.position = strategy;
      contentRef.current.style.left = `${Math.round(x)}px`;
      contentRef.current.style.top = `${Math.round(y)}px`;
    });
  };

  const prepareFloatingElement = (element: TContent): void => {
    if (!element) return;
    element.style.position = "fixed";
    element.style.top = "0";
    element.style.left = "0";
    element.style.transform = "";
  };

  useEffect(() => {
    if (!isMounted || !triggerRef.current || !contentRef.current) {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      return;
    }

    prepareFloatingElement(contentRef.current);

    updatePosition();

    cleanupRef.current = autoUpdate(triggerRef.current, contentRef.current, updatePosition, {
      ancestorResize: true,
      ancestorScroll: true,
      elementResize: true,
    });

    return (): void => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [isMounted]);

  useEffect(() => {
    return (): void => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, []);

  function handleOpen(): void {
    setIsMounted(true);
    setIsOpen(true);
  }

  function handleClose(): void {
    setIsOpen(false);
    setTimeout(() => setIsMounted(false), 200);
  }

  function handleClick(): void {
    if (isOpen || isMounted) {
      handleClose();
    } else {
      handleOpen();
    }
  }

  return {
    contentRef,
    handleClick,
    handleClose,
    isMounted,
    isOpen,
    triggerRef,
  };
}
