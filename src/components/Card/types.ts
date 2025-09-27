import type { ComponentPropsWithoutRef, ReactNode, JSX } from "react";

import type { CSSObject } from "../../styles/types";

export interface CardProps extends ComponentPropsWithoutRef<"div"> {
  /** HTML element to render as */
  as?: keyof JSX.IntrinsicElements;
  /** Card title (required) */
  title: string;
  /** Footer content */
  footer?: ReactNode;
  /** Card variant */
  variant?: "default" | "bordered";
  /** Padding size */
  padding?: "default" | "small" | "minimal";
  /** Whether the card is interactive/clickable */
  clickable?: boolean;
  /** Callback when close button is clicked */
  onClose?: () => void;
  /** Custom CSS styles */
  css?: CSSObject;
}
