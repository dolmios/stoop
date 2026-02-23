"use client";

import type { ReactElement } from "react";

import { Button, Stack, Text, useTheme } from "stoop-ui";

import { Moon, Sun } from "../../lib/icons";

/**
 * Footer component with theme toggle and copyright information.
 *
 * @returns Footer element
 */
export function Footer(): ReactElement {
  const { setTheme, theme } = useTheme();
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <Stack
      align="center"
      as="footer"
      bottom="large"
      css={{
        backgroundColor: "$background",
        borderTop: "1px solid $border",
      }}
      direction="row"
      justify="between"
      left="medium"
      right="medium"
      top="large">
      <Text
        as="small"
        bottom="none"
        css={{
          marginBottom: 0,
        }}>
        © 2025 Jackson Dolman, MIT License
      </Text>

      <Button
        icon={theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        size="small"
        onClick={toggleTheme}>
        {theme === "light" ? "Dark" : "Light"}
      </Button>
    </Stack>
  );
}
