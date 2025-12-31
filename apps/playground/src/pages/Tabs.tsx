import { useState, type JSX } from "react";
import { Stack, Tabs, Text } from "stoop-ui";

export default function TabsDemo(): JSX.Element {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <Stack gap="large">
      <Text variant="h1">Tabs</Text>
      <Tabs
        items={[
          { label: "Tab 1", value: "1" },
          { label: "Tab 2", value: "2" },
          { label: "Tab 3", value: "3" },
        ]}
        value={activeTab}
        onTabChange={setActiveTab}
      />
      <Text>Active tab: {activeTab}</Text>
    </Stack>
  );
}
