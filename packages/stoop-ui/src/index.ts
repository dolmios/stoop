// Components
export { Badge } from "./components/Badge";
export { Button } from "./components/Button";
export { Card } from "./components/Card";
export { Code } from "./components/Code";
export { Input } from "./components/Input";
export { Menu, type MenuProps, type MenuOption as MenuItem } from "./components/Menu";
export { Modal, type ModalProps } from "./components/Modal";
export { Select, type SelectProps, type SelectOption } from "./components/Select";
export { Spinner } from "./components/Spinner";
export { Stack } from "./components/Stack";
export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/Table";
export { Tabs, type TabItem } from "./components/Tabs";
export { Text } from "./components/Text";
export { Tooltip, type TooltipProps } from "./components/Tooltip";
export {
  ProseHeading,
  ProseHeading2,
  ProseHeading3,
  ProseHeading4,
  ProseHeadingWrapper2,
  ProseHeadingWrapper3,
  ProseLink,
  ProseLinkWrapper,
  ProseUnorderedList,
  ProseOrderedList,
  ProseListItem,
  ProseTableWrapper,
} from "./components/Prose";

// Global styles (CSS reset) — processed at build time, included in styles.css
import "./globals";

// Theme
export { ThemeProvider, useTheme } from "stoop";
export { default as theme, animations } from "./theme.config";
export type { CSS, StoopConfig, StoopTheme } from "stoop";

// Hooks
export { useEventListener } from "./hooks/useEventListener";
export { useFloatingUI } from "./hooks/useFloatingUI";
export { useModal } from "./hooks/useModal";
export { useOutsideClick } from "./hooks/useOutsideClick";
