import { type JSX } from "react";
import { Stack, Code, Text } from "stoop-ui";

export default function CodeDemo(): JSX.Element {
  return (
    <Stack gap="large">
      <Text variant="h1">Code</Text>
      <Stack gap="medium">
        <Text variant="h3">Inline Code</Text>
        <Text>
          This is inline code: <Code>const x = 1</Code>
        </Text>
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">Code Block</Text>
        <Code block>
          {`function hello() {
  console.log("Hello, world!");
}`}
        </Code>
      </Stack>
    </Stack>
  );
}
