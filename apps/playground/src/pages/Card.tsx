import { type JSX } from "react";
import { Stack, Card, Text } from "stoop-ui";

export default function CardDemo(): JSX.Element {
  return (
    <Stack gap="large">
      <Text variant="h1">Card</Text>
      <Card>
        <Text variant="h3">Card Title</Text>
        <Text>This is a card component with enhanced depth styling.</Text>
      </Card>
    </Stack>
  );
}
