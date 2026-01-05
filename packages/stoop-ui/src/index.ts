/**
 * stoop-ui - UI component library built with stoop
 */

// Export ThemeProvider and useTheme - consumers should wrap their app with ThemeProvider
export { ThemeProvider, useTheme, type ThemeProviderProps } from "./ThemeProvider";

// Export SSR utilities (server-safe)
export { getCssText } from "./stoop.theme";

// Export client-only APIs (these require "use client" directive in consuming files)
// Note: These come from stoop.theme.ts which has "use client" directive
// globalCss is NOT exported - it's automatically handled by ThemeProvider
export { styled, keyframes } from "./stoop.theme";

// Export hooks
export { useEventListener } from "./hooks/useEventListener";
export { useFloatingUI } from "./hooks/useFloatingUI";
export { useModal } from "./hooks/useModal";
export { useOutsideClick } from "./hooks/useOutsideClick";
export type { UseFloatingUIReturn } from "./hooks/useFloatingUI";
export type { UseModalReturn } from "./hooks/useModal";

// Export components
export { Badge, type BadgeProps } from "./components/Badge";
export { Button, type ButtonProps } from "./components/Button";
export { Card, type CardProps } from "./components/Card";
export { Code, type CodeProps } from "./components/Code";
export { Input, type InputProps } from "./components/Input";
export { Menu, type MenuProps, type MenuOption } from "./components/Menu";
export { Modal, type ModalProps } from "./components/Modal";
export { Stack, type StackProps } from "./components/Stack";
export {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  type TableProps,
  type TableHeadProps,
  type TableBodyProps,
  type TableRowProps,
  type TableHeaderProps,
  type TableCellProps,
} from "./components/Table";
export { Tabs, type TabsProps, type TabItem } from "./components/Tabs";
export { Text, TextComponent, type TextProps } from "./components/Text";
export { Tooltip, type TooltipProps } from "./components/Tooltip";
