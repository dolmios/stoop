import type { JSX } from "react";

import { Stack, Spinner, Text, Card } from "stoop-ui";

export default function SpinnerDemo(): JSX.Element {
  return (
    <Stack gap="large">
      <Text variant="h1">Spinner</Text>
      <Stack gap="medium">
        <Text variant="h3">Sizes</Text>
        <Stack align="center" direction="row" gap="medium" wrap>
          <Stack align="center" gap="small">
            <Spinner size="small" />
            <Text variant="small">Small</Text>
          </Stack>
          <Stack align="center" gap="small">
            <Spinner size="default" />
            <Text variant="small">Default</Text>
          </Stack>
          <Stack align="center" gap="small">
            <Spinner size="large" />
            <Text variant="small">Large</Text>
          </Stack>
        </Stack>
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">In Context</Text>
        <Card>
          <Stack align="center" gap="small">
            <Spinner />
            <Text>Loading content...</Text>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}
