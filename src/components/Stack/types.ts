import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { SpacingToken } from "../../styles/theme";
import type { CSSObject } from "../../styles/types";

/**
 * Stack component props - comprehensive layout component
 */
export interface StackProps extends ComponentPropsWithoutRef<"div"> {
  /** Override the HTML element */
  as?: ElementType;

  // Layout Direction & Display
  /** Direction of the stack */
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  /** Render as inline-flex instead of flex */
  inline?: boolean;

  // Spacing
  /** Gap between items */
  gap?: SpacingToken;
  /** Remove default padding (useful for row direction) */
  minimal?: boolean;

  // Flex Container Properties
  /** Alignment of items along cross-axis */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** Justification along main axis */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** Whether items should wrap */
  wrap?: boolean | "reverse";
  /** Align multiple lines (when wrapped) */
  alignContent?: "start" | "center" | "end" | "between" | "around" | "stretch";

  // Flex Item Properties (when Stack is inside another flex container)
  /** Flex grow factor */
  grow?: number;
  /** Flex shrink factor */
  shrink?: number;
  /** Flex basis */
  basis?: string;
  /** Order in flex container */
  order?: number;

  // Text Alignment (for content inside)
  /** Text alignment */
  textAlign?: "left" | "center" | "right" | "justify";

  // Spacing Props
  /** Add padding-top and remove margin-top */
  top?: SpacingToken;
  /** Add padding-bottom and remove margin-bottom */
  bottom?: SpacingToken;

  /** Custom CSS */
  css?: CSSObject;
}
