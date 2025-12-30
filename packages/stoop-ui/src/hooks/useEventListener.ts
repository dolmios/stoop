import { useEffect, useRef, type RefObject } from "react";

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: RefObject<Window | HTMLElement | null>,
  options?: boolean | AddEventListenerOptions,
): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    const eventListener = ((event: WindowEventMap[K]) =>
      savedHandler.current(event)) as EventListener;

    const targetElement: Window | HTMLElement | null = element?.current || window;

    if (!targetElement) return;

    savedHandler.current = handler;
    targetElement.addEventListener(eventName, eventListener, options);

    return (): void => {
      targetElement.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, handler, options, element]);
}
