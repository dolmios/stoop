import { useState, type JSX } from "react";
import { Stack, Select, Text } from "stoop-ui";

export default function SelectDemo(): JSX.Element {
  const [value, setValue] = useState<string | undefined>(undefined);

  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
    { label: "Option 4", value: "option4" },
    { label: "Option 5", value: "option5" },
  ];

  const optionsWithIcons = [
    { icon: "🚀", iconPosition: "left" as const, label: "Rocket", value: "rocket" },
    { icon: "⭐", iconPosition: "left" as const, label: "Star", value: "star" },
    { icon: "💎", iconPosition: "left" as const, label: "Diamond", value: "diamond" },
  ];

  return (
    <Stack gap="large">
      <Text variant="h1">Select</Text>
      <Stack gap="medium" style={{ maxWidth: "400px" }}>
        <Text variant="h3">Basic Select</Text>
        <Select
          label="Choose an option"
          options={options}
          placeholder="Select an option..."
          value={value}
          onSelection={(val) => setValue(val)}
        />
      </Stack>
      <Stack gap="medium" style={{ maxWidth: "400px" }}>
        <Text variant="h3">With Icons</Text>
        <Select label="Choose an icon" options={optionsWithIcons} />
      </Stack>
      <Stack gap="medium" style={{ maxWidth: "400px" }}>
        <Text variant="h3">States</Text>
        <Select disabled label="Disabled" options={options} />
        <Select error errorMessage="This field has an error" label="Error" options={options} />
        <Select label="Success" options={options} success successMessage="This field is valid" />
      </Stack>
    </Stack>
  );
}
