import { type JSX } from "react";
import { Stack, Tabs, Text } from "stoop-ui";

export default function TabsDemo(): JSX.Element {
  return (
    <Stack gap="large">
      <Text variant="h1">Tabs</Text>
      <Tabs
        items={[
          { content: <Text>Content for Tab 1</Text>, id: "1", label: "Tab 1" },
          { content: <Text>Content for Tab 2</Text>, id: "2", label: "Tab 2" },
          { content: <Text>Content for Tab 3</Text>, id: "3", label: "Tab 3" },
        ]}
      />
    </Stack>
  );
}
