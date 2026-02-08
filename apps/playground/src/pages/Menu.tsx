import type { JSX } from "react";

import { Stack, Menu, Button, Text } from "stoop-ui";

export default function MenuDemo(): JSX.Element {
  return (
    <Stack gap="large">
      <Text variant="h1">Menu</Text>
      <Stack gap="medium">
        <Text variant="h3">Basic Menu</Text>
        <Menu
          options={[
            { label: "Option 1", value: "1" },
            { label: "Option 2", value: "2" },
            { label: "Option 3", value: "3" },
          ]}
          trigger={<Button>Open Menu</Button>}
          onSelection={(value, label): void => {
            // Handle selection
            void value;
            void label;
          }}
        />
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">Menu with Initial Selection</Text>
        <Menu
          initial="2"
          options={[
            { label: "Option 1", value: "1" },
            { label: "Option 2", value: "2" },
            { label: "Option 3", value: "3" },
          ]}
          trigger={<Button>Menu with Selection</Button>}
        />
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">Menu with Icons</Text>
        <Menu
          options={[
            { icon: "🚀", iconPosition: "left", label: "Rocket", value: "rocket" },
            { icon: "⭐", iconPosition: "left", label: "Star", value: "star" },
            { icon: "💎", iconPosition: "left", label: "Diamond", value: "diamond" },
          ]}
          trigger={<Button>Menu with Icons</Button>}
        />
      </Stack>
    </Stack>
  );
}
