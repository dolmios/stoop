import { type JSX } from "react";
import { Stack, Menu, Button, Text } from "stoop-ui";

export default function MenuDemo(): JSX.Element {
  return (
    <Stack gap="large">
      <Text variant="h1">Menu</Text>
      <Stack gap="medium">
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
    </Stack>
  );
}
