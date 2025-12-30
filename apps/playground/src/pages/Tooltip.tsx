import { type JSX } from "react";
import { Stack, Tooltip, Button, Text } from "stoop-ui";

export default function TooltipDemo(): JSX.Element {
  return (
    <Stack gap="large">
      <Text variant="h1">Tooltip</Text>
      <Stack direction="row" gap="medium">
        <Tooltip trigger={<Button>Hover me</Button>}>
          <Text>This is a tooltip</Text>
        </Tooltip>
        <Tooltip small trigger={<Button>Small tooltip</Button>}>
          <Text>Small tooltip</Text>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
