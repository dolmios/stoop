import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { SpacingToken } from "../../styles/theme";
import type { CSSObject } from "../../styles/types";

// Supported text elements and their default styling
export type TextElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "strong"
  | "small"
  | "label";

/**
 * Text component props
 */
export interface TextProps extends ComponentPropsWithoutRef<"div"> {
  /** HTML element to render as (also determines default size) */
  as?: TextElement | ElementType;
  /** Override the default size from 'as' prop */
  size?: TextElement;
  /** Apply muted styling (reduced opacity) */
  muted?: boolean;
  /** Add padding-top and remove margin-top */
  top?: SpacingToken;
  /** Add padding-bottom and remove margin-bottom */
  bottom?: SpacingToken;
  /** Custom CSS styles */
  css?: CSSObject;
}
