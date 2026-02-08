import type { JSX } from "react";

import { Stack, Badge, Text } from "stoop-ui";

export default function BadgeDemo(): JSX.Element {
  return (
    <Stack gap="large">
      <Text variant="h1">Badge</Text>
      <Stack gap="medium">
        <Text variant="h3">Variants</Text>
        <Stack align="center" direction="row" gap="small" wrap>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="warning">Warning</Badge>
          {/* @ts-expect-error - Testing: "invalid" is not a valid variant */}
          <Badge variant="invalid">Invalid</Badge>
        </Stack>
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">Sizes</Text>
        <Stack align="center" direction="row" gap="small" wrap>
          <Badge size="small">Small</Badge>
          <Badge>Default</Badge>
          {/* @ts-expect-error - Testing: "large" is not a valid size */}
          <Badge size="large">Large</Badge>
        </Stack>
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">States</Text>
        <Stack align="center" direction="row" gap="small" wrap>
          <Badge loading>Loading</Badge>
          <Badge loading variant="primary">
            Loading
          </Badge>
        </Stack>
      </Stack>
    </Stack>
  );
}
