import type { ComponentPropsWithoutRef } from "react";

import type { SpacingToken } from "../../styles/theme";
import type { CSSObject } from "../../styles/types";

/**
 * Button component props
 */
export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  /** Button variant */
  variant?: "primary" | "secondary" | "minimal";
  /** Button size */
  size?: "normal" | "small";
  /** Full width button */
  block?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Add margin-top */
  top?: SpacingToken;
  /** Add margin-bottom */
  bottom?: SpacingToken;
  /** Custom CSS styles */
  css?: CSSObject;
}
