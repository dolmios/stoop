"use client";

import type { ReactElement } from "react";

import { Button, Stack, Text, useTheme } from "../../ui";

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
      css={{
        borderTop: "1px solid $border",
        marginTop: "$larger",
        maxWidth: "100%",
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
      <Button size="small" variant="minimal" onClick={toggleTheme}>
        {themeName === "light" ? "Dark" : "Light"}
      </Button>
    </Stack>
  );
}
