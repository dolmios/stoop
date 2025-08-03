import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { CSSObject } from "../../styles/types";

export interface TabItem {
  id?: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends ComponentPropsWithoutRef<"div"> {
  /** Array of tab items */
  items: TabItem[];
  /** Initially active tab index */
  defaultActive?: number;
  /** Tab variant */
  variant?: "default" | "minimal";
  /** Called when tab selection changes */
  onTabChange?: (index: number) => void;
  /** Custom CSS styles */
  css?: CSSObject;
}
