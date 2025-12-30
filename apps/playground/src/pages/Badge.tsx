import { type JSX } from "react";
import { Stack, Badge, Text } from "stoop-ui";

export default function BadgeDemo(): JSX.Element {
  return (
    <Stack gap="large">
      <Text variant="h1">Badge</Text>
      <Stack gap="medium">
        <Text variant="h3">Variants</Text>
        <Stack align="center" direction="row" gap="small">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
        </Stack>
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">Sizes</Text>
        <Stack align="center" direction="row" gap="small">
          <Badge size="small">Small</Badge>
          <Badge>Default</Badge>
        </Stack>
      </Stack>
    </Stack>
  );
}
