import { useState, type JSX } from "react";
import { Stack, Tabs } from "stoop-ui";

import BadgeDemo from "./pages/Badge";
import ButtonDemo from "./pages/Button";
import CardDemo from "./pages/Card";
import CodeDemo from "./pages/Code";
import InputDemo from "./pages/Input";
import MenuDemo from "./pages/Menu";
import ModalDemo from "./pages/Modal";
import StackDemo from "./pages/Stack";
import TableDemo from "./pages/Table";
import TabsDemo from "./pages/Tabs";
import TextDemo from "./pages/Text";
import TooltipDemo from "./pages/Tooltip";

const components = [
  { component: BadgeDemo, label: "Badge", value: "badge" },
  { component: ButtonDemo, label: "Button", value: "button" },
  { component: CardDemo, label: "Card", value: "card" },
  { component: CodeDemo, label: "Code", value: "code" },
  { component: InputDemo, label: "Input", value: "input" },
  { component: MenuDemo, label: "Menu", value: "menu" },
  { component: ModalDemo, label: "Modal", value: "modal" },
  { component: StackDemo, label: "Stack", value: "stack" },
  { component: TableDemo, label: "Table", value: "table" },
  { component: TabsDemo, label: "Tabs", value: "tabs" },
  { component: TextDemo, label: "Text", value: "text" },
  { component: TooltipDemo, label: "Tooltip", value: "tooltip" },
];

export default function App(): JSX.Element {
  const [activeTab, setActiveTab] = useState("button");

  const ActiveComponent = components.find((c) => c.value === activeTab)?.component ?? ButtonDemo;

  return (
    <Stack gap="large" style={{ padding: "2rem" }}>
      <Tabs
        items={components.map((c) => ({ label: c.label, value: c.value }))}
        value={activeTab}
        onTabChange={setActiveTab}
      />
      <ActiveComponent />
    </Stack>
  );
}
