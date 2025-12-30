import { type RefObject } from "react";

import { useEventListener } from "./useEventListener";

export function useOutsideClick<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent) => void,
  mouseEvent: "mousedown" | "mouseup" = "mousedown",
): void {
  useEventListener(mouseEvent, (event) => {
    const el = ref?.current;
    const target = event.target as Node;

    // Don't close if click is inside the ref element
    if (!el || el.contains(target)) {
      return;
    }

    // Don't close if click is inside ANY Select dropdown, Popover, or Modal dialog
    const targetElement = target as HTMLElement;
    const isInsideSelectDropdown = targetElement.closest?.('[data-select-dropdown="true"]');
    const isInsidePopover = targetElement.closest?.('[data-popover="true"]');
    const isInsideAnyModal = targetElement.closest?.('[data-modal="true"]');

    if (isInsideSelectDropdown || isInsidePopover || isInsideAnyModal) {
      return;
    }

    handler(event);
  });
}
