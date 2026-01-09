import { type JSX } from "react";
import { Stack, Text } from "stoop-ui";

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
        <Text as="h1">Heading 1</Text>
        <Text as="h2">Heading 2</Text>
        <Text as="h3">Heading 3</Text>
        <Text as="h4">Heading 4</Text>
        <Text as="h1" variant="h3">
          Semantic h1 styled as h3
        </Text>
        {/* @ts-expect-error - Testing: "red" is not a valid variant */}
        <Text variant="red">This should error</Text>
        {/* @ts-expect-error - Testing: "invalid" is not a valid variant */}
        <Text as="h1" variant="invalid">
          This should also error
        </Text>
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">Body Text</Text>
        <Text>This is regular body text.</Text>
        <Text variant="small">This is small text.</Text>
        <Text as="strong">This is bold text using strong element</Text>
      </Stack>
    </Stack>
  );
}
