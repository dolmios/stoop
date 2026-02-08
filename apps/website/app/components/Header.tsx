"use client";

import type { ReactElement } from "react";

import Link from "next/link";
import { Button, Stack, Text } from "stoop-ui";

import { GithubLogo } from "../../lib/icons";

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
      }}
      direction="row"
      justify="between"
      left="medium"
      right="medium">
      <Link
        href="/"
        style={{
          flexShrink: 0,
          minWidth: 0,
          textDecoration: "none",
        }}>
        <Text
          as="h5"
          bottom="none"
          css={{
            fontWeight: "$bold",
            marginTop: 0,
            whiteSpace: "nowrap",
          }}>
          Stoop
        </Text>
      </Link>
      <Stack>
        <Button
          as={Link}
          href="https://github.com/dolmios/stoop"
          icon={<GithubLogo size={16} />}
          rel="noopener noreferrer"
          size="small"
          target="_blank">
          GitHub
        </Button>
      </Stack>
    </Stack>
  );
}
