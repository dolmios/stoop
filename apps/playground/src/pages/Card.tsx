import { type JSX } from "react";
import { Stack, Card, Text, Button } from "stoop-ui";

export default function CardDemo(): JSX.Element {
  return (
    <Stack gap="large">
      <Text variant="h1">Card</Text>
      <Stack gap="medium">
        <Text variant="h3">Basic Card</Text>
        <Card>
          <Text variant="h3">Card Title</Text>
          <Text>This is a card component with enhanced depth styling.</Text>
        </Card>
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">Interactive Card</Text>
        <Card interactive>
          <Text variant="h3">Interactive Card</Text>
          <Text>Hover over this card to see the interactive effect.</Text>
        </Card>
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">States</Text>
        <Card loading>
          <Text variant="h3">Loading Card</Text>
          <Text>This card is in a loading state.</Text>
        </Card>
      </Stack>
    </Stack>
  );
}
