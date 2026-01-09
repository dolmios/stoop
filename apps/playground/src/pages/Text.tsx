import { type JSX } from "react";
import { Stack, Text, TextComponent } from "stoop-ui";

export default function TextDemo(): JSX.Element {
  return (
    <Stack
      css={{
        "& > *:last-child": {
          marginBottom: 0,
        },
      }}
      gap="large">
      <Text variant="h1">Text</Text>
      <Stack gap="medium">
        <Text variant="h3">Headings</Text>
        <TextComponent level={1} variant="h1">
          Heading 1
        </TextComponent>
        <TextComponent level={2} variant="h2">
          Heading 2
        </TextComponent>
        <TextComponent level={3} variant="h3">
          Heading 3
        </TextComponent>
        <TextComponent level={4} variant="h4">
          Heading 4
        </TextComponent>
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">Body Text</Text>
        <Text>This is regular body text.</Text>
        <Text size="small">This is small text.</Text>
        <Text size="large">This is large text.</Text>
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">Copyable Text</Text>
        <TextComponent copyable>Click the copy button to copy this text</TextComponent>
      </Stack>
    </Stack>
  );
}
