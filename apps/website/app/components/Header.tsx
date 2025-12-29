"use client";

import type { ReactElement } from "react";

import Link from "next/link";

import { Button } from "../../ui/Button";
import { Stack } from "../../ui/Stack";
import { Text } from "../../ui/Text";

/**
 * Header component with logo and navigation links.
 *
 * @returns Header element
 */
export function Header(): ReactElement {
  return (
    <Stack
      align="center"
      as="header"
      css={{
        backgroundColor: "$background",
        borderBottom: "1px solid $border",
        height: "48px",
        padding: 0,
        paddingLeft: "$medium",
        paddingRight: "$medium",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: "100",
      }}
      direction="row"
      justify="between">
      <Link
        href="/"
        style={{
          textDecoration: "none",
        }}>
        <Text
          as="h1"
          css={{
            fontFamily: "$mono",
            margin: 0,
          }}
          variant="h1">
          Stoop
        </Text>
      </Link>
      <Stack align="center" direction="row" gap="small">
        <Button
          as={Link}
          href="https://github.com/dolmios/stoop"
          rel="noopener noreferrer"
          size="small"
          target="_blank"
          variant="secondary">
          GitHub
        </Button>
      </Stack>
    </Stack>
  );
}
