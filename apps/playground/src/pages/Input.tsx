import { useState, type ChangeEvent, type JSX } from "react";
import { Stack, Input, Text } from "stoop-ui";

export default function InputDemo(): JSX.Element {
  const [value, setValue] = useState("");

  return (
    <Stack gap="large">
      <Text variant="h1">Input</Text>
      <Stack gap="medium" style={{ maxWidth: "400px" }}>
        <Text variant="h3">Basic Input</Text>
        <Input
          label="Name"
          placeholder="Enter your name"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>): void => setValue(e.target.value)}
        />
      </Stack>
      <Stack gap="medium" style={{ maxWidth: "400px" }}>
        <Text variant="h3">Textarea</Text>
        <Input label="Description" placeholder="Enter description" textarea />
      </Stack>
      <Stack gap="medium" style={{ maxWidth: "400px" }}>
        <Text variant="h3">States</Text>
        <Input error errorMessage="This field has an error" label="Error" />
        <Input label="Success" success successMessage="This field is valid" />
      </Stack>
    </Stack>
  );
}
