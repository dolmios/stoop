/**
 * Creates a selector reference object for component targeting.
 * Used in nested selectors like `&${Button.selector}`.
 */

import type { StyledComponentRef } from "./types";

export function createSelector(className: string): StyledComponentRef {
  return {
    __isStoopStyled: true,
    __stoopClassName: className,
    toString: () => `__STOOP_COMPONENT_${className}`,
  };
}
