/**
 * Creates a selector reference object for component targeting.
 * Used in nested selectors like `&${Button.selector}`.
 */

export interface StyledComponentRef {
  readonly __isStoopStyled: true;
  readonly __stoopClassName: string;
  toString(): string;
}

export function createSelector(className: string): StyledComponentRef {
  return {
    __isStoopStyled: true,
    __stoopClassName: className,
    toString: () => `__STOOP_COMPONENT_${className}`,
  };
}
