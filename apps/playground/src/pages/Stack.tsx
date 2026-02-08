import type { JSX } from "react";

import { Stack, Text, Card } from "stoop-ui";

export default function StackDemo(): JSX.Element {
  return (
    <Stack gap="large">
      <Text variant="h1">Stack</Text>
      <Stack gap="medium">
        <Text variant="h3">Direction</Text>
        <Stack direction="row" gap="small">
          <Card>Item 1</Card>
          <Card>Item 2</Card>
          <Card>Item 3</Card>
        </Stack>
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">Gap Sizes</Text>
        <Stack gap="small">
          <Card>Small gap</Card>
          <Card>Small gap</Card>
        </Stack>
        <Stack gap="medium">
          <Card>Medium gap</Card>
          <Card>Medium gap</Card>
        </Stack>
        <Stack gap="large">
          <Card>Large gap</Card>
          <Card>Large gap</Card>
        </Stack>
      </Stack>
    </Stack>
  );
}
