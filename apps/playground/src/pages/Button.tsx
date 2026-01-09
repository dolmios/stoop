import { type JSX } from "react";
import { Stack, Button, Text } from "stoop-ui";

export default function ButtonDemo(): JSX.Element {
  return (
    <Stack gap="large">
      <Text variant="h1">Button</Text>
      <Stack gap="medium">
        <Text variant="h3">Variants</Text>
        <Stack direction="row" gap="small" wrap>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="minimal">Minimal</Button>
          <Button variant="danger">Danger</Button>
          {/* @ts-expect-error - Testing: "invalid" is not a valid variant */}
          <Button variant="invalid">Invalid</Button>
        </Stack>
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">Sizes</Text>
        <Stack direction="row" gap="small" wrap>
          <Button size="small">Small</Button>
          <Button>Default</Button>
          {/* @ts-expect-error - Testing: "huge" is not a valid size */}
          <Button size="huge">Huge</Button>
        </Stack>
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">States</Text>
        <Stack direction="row" gap="small" wrap>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button active>Active</Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
