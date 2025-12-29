"use client";

import type { ReactElement } from "react";

import { useTheme } from "../../stoop.theme";
import { Button } from "../../ui/Button";
import { Stack } from "../../ui/Stack";
import { Text } from "../../ui/Text";

/**
 * Footer component with theme toggle and copyright information.
 *
 * @returns Footer element
 */
export function Footer(): ReactElement {
  const { themeName, toggleTheme } = useTheme();

  const handleToggle = (): void => {
    toggleTheme();

    // Update cookie for SSR theme persistence
    const newTheme = themeName === "light" ? "dark" : "light";

    document.cookie = `stoop-theme=${newTheme}; path=/; max-age=31536000`;
  };

  return (
    <Stack
      align="center"
      as="footer"
      css={{
        borderTop: "1px solid $border",
        marginTop: "$larger",
        padding: 0,
        paddingLeft: "$medium",
        paddingRight: "$medium",
        width: "100%",
      }}
      direction="row"
      gap="medium"
      justify="between">
      <Stack align="center" direction="row" gap="small">
        <Text
          as="span"
          css={{
            color: "$text",
            fontSize: "$small",
            margin: 0,
            opacity: 0.7,
          }}>
          © 2025 Jackson Dolman
        </Text>
        <Text
          as="span"
          css={{
            color: "$text",
            fontSize: "$small",
            margin: 0,
            opacity: 0.5,
          }}>
          •
        </Text>
        <Text
          as="span"
          css={{
            color: "$text",
            fontSize: "$small",
            margin: 0,
            opacity: 0.7,
          }}>
          MIT License
        </Text>
      </Stack>
      <Button size="small" variant="minimal" onClick={handleToggle}>
        {themeName === "light" ? "🌙" : "☀️"}
      </Button>
    </Stack>
  );
}
