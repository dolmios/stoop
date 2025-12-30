// Re-export from stoop-ui
export {
  Badge,
  Button,
  Card,
  Code,
  Input,
  Menu,
  Modal,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Tabs,
  Text,
  TextComponent,
  Tooltip,
  useTheme,
  type BadgeProps,
  type ButtonProps,
  type CardProps,
  type CodeProps,
  type InputProps,
  type MenuProps,
  type MenuOption,
  type ModalProps,
  type StackProps,
  type TableProps,
  type TableHeadProps,
  type TableBodyProps,
  type TableRowProps,
  type TableHeaderProps,
  type TableCellProps,
  type TabsProps,
  type TabItem,
  type TextProps,
  type TooltipProps,
} from "stoop-ui";

// Export Heading as alias for TextComponent with heading variant
export { TextComponent as Heading } from "stoop-ui";

// Export advanced client-only APIs from stoop-ui
// These should only be used in client components
export { styled, keyframes, globalCss } from "stoop-ui/client";
