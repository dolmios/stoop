import type { RefObject } from "react";

import { useEffect, useLayoutEffect, useRef } from "react";

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: RefObject<Window | HTMLElement | null>,
  options?: boolean | AddEventListenerOptions,
): void {
  const savedHandler = useRef(handler);

  useLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = ((event: WindowEventMap[K]) =>
      savedHandler.current(event)) as EventListener;

    const targetElement: Window | HTMLElement | null = element?.current || window;

    if (!targetElement) return;

    targetElement.addEventListener(eventName, eventListener, options);

    return (): void => {
      targetElement.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, options, element]);
}
