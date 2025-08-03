import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { SpacingToken } from "../../styles/theme";
import type { CSSObject } from "../../styles/types";

/**
 * Section component props - page layout wrapper
 */
export interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  /** Override the HTML element */
  as?: ElementType;

  // Container behavior
  /** Apply standard max-width container (default: true) */
  container?: boolean;
  /** Wide container for app-level layouts */
  wide?: boolean;

  // Spacing
  /** Top padding using spacing tokens */
  top?: SpacingToken;
  /** Bottom padding using spacing tokens */
  bottom?: SpacingToken;

  /** Custom CSS */
  css?: CSSObject;
}
