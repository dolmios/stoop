import { type JSX } from "react";
import { Stack, Tooltip, Button, Text } from "stoop-ui";

export default function TooltipDemo(): JSX.Element {
  return (
    <Stack gap="large">
      <Text variant="h1">Tooltip</Text>
      <Stack gap="medium">
        <Text variant="h3">Click Mode (Default)</Text>
        <Text>Click the buttons below to toggle tooltips.</Text>
        <Stack direction="row" gap="medium" wrap>
          <Tooltip mode="click" trigger={<Button>Click me</Button>}>
            <Text>This is a click tooltip</Text>
          </Tooltip>
          <Tooltip mode="click" small trigger={<Button>Small tooltip</Button>}>
            <Text>Small tooltip</Text>
          </Tooltip>
          <Tooltip minimal mode="click" trigger={<Button>Minimal tooltip</Button>}>
            <Text>Minimal tooltip</Text>
          </Tooltip>
        </Stack>
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">Hover Mode</Text>
        <Text>Hover over the buttons below to see tooltips.</Text>
        <Stack direction="row" gap="medium" wrap>
          <Tooltip mode="hover" trigger={<Button>Hover me</Button>}>
            <Text>This is a hover tooltip</Text>
          </Tooltip>
          <Tooltip mode="hover" small trigger={<Button>Small tooltip</Button>}>
            <Text>Small tooltip</Text>
          </Tooltip>
          <Tooltip minimal mode="hover" trigger={<Button>Minimal tooltip</Button>}>
            <Text>Minimal tooltip</Text>
          </Tooltip>
        </Stack>
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">With Different Triggers</Text>
        <Stack direction="row" gap="medium" wrap>
          <Tooltip mode="click" trigger={<Button variant="primary">Primary Button</Button>}>
            <Text>Tooltip on primary button</Text>
          </Tooltip>
          <Tooltip mode="hover" trigger={<Button variant="secondary">Secondary Button</Button>}>
            <Text>Tooltip on secondary button</Text>
          </Tooltip>
          <Tooltip mode="click" trigger={<Button variant="minimal">Minimal Button</Button>}>
            <Text>Tooltip on minimal button</Text>
          </Tooltip>
        </Stack>
      </Stack>
    </Stack>
  );
}
