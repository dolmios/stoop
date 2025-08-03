import type { ComponentPropsWithoutRef } from "react";

import type { SpacingToken } from "../../styles/theme";
import type { CSSObject } from "../../styles/types";

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  /** Whether the badge is clickable */
  clickable?: boolean;
  /** Add margin-top */
  top?: SpacingToken;
  /** Add margin-bottom */
  bottom?: SpacingToken;
  /** Custom CSS styles */
  css?: CSSObject;
}
