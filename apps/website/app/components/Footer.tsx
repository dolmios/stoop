"use client";

import type { ReactElement } from "react";

import { Button, Stack, Text, useTheme } from "stoop-ui";

/**
 * Footer component with theme toggle and copyright information.
 *
 * @returns Footer element
 */
export function Footer(): ReactElement {
  const { themeName, toggleTheme } = useTheme();

  return (
    <Stack
      align="center"
      as="footer"
      bottom="medium"
      css={{
        backgroundColor: "$background",
        borderTop: "1px solid $border",
      }}
      direction="row"
      justify="between"
      left="medium"
      right="medium"
      top="medium">
      <Text
        as="small"
        bottom="none"
        css={{
          marginBottom: 0,
        }}>
        © 2025 Jackson Dolman, MIT License
      </Text>

      <Button size="small" onClick={toggleTheme}>
        {themeName === "light" ? "Dark" : "Light"}
      </Button>
    </Stack>
  );
}
