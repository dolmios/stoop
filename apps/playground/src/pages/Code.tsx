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
        <Text>Hover over the code block to see the copy button.</Text>
        <Code block>
          {`function hello() {
  console.log("Hello, world!");
}`}
        </Code>
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">Multiple Code Blocks</Text>
        <Code block>
          {`const greeting = "Hello";
const name = "World";
console.log(\`\${greeting}, \${name}!\`);`}
        </Code>
        <Code block>
          {`// This is a comment
function calculateSum(a: number, b: number): number {
  return a + b;
}`}
        </Code>
      </Stack>
    </Stack>
  );
}
