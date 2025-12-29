"use client";

import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Code } from "../ui/Code";
import { Stack } from "../ui/Stack";
import { Text } from "../ui/Text";

/**
 * Home page component with hero section and call-to-action.
 *
 * @returns Home page content
 */
export default function HomePage(): ReactNode {
  return (
    <Stack
      align="center"
      as="section"
      css={{ padding: "$larger 0", textAlign: "center" }}
      gap="larger">
      <Image
        alt="Stoop CSS-in-JS library"
        height={300}
        src="/stoop.jpg"
        style={{
          height: "auto",
          maxWidth: "300px",
          width: "100%",
        }}
        width={300}
      />
      <Stack align="center" gap="medium">
        <Stack align="center" direction="row" gap="small">
          <Badge variant="secondary">CSS-in-JS Library</Badge>
          <Badge variant="secondary">Beta</Badge>
        </Stack>
        <Text
          as="h1"
          css={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: "$bold",
            lineHeight: "1.1",
            margin: 0,
          }}
          variant="h1">
          Stoop
        </Text>
        <Text
          css={{
            color: "$textSecondary",
            fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
            margin: 0,
            maxWidth: "600px",
          }}>
          CSS-in-JS library with type inference, theme creation, and variants support. Similar to
          Stitches, built for modern React. Currently in active development.
        </Text>
      </Stack>
      <Stack align="center" direction="row" gap="medium" justify="center" wrap>
        <Button as={Link} href="/installation" variant="primary">
          Get Started
        </Button>
        <Button
          as="a"
          href="https://github.com/dolmios/stoop"
          rel="noopener noreferrer"
          target="_blank"
          variant="secondary">
          View on GitHub
        </Button>
      </Stack>
      <Stack css={{ marginTop: "$large", maxWidth: "400px", width: "100%" }}>
        <Code block>npm install stoop</Code>
      </Stack>
      <Stack align="center" css={{ marginTop: "$large", maxWidth: "600px" }} gap="small">
        <Text
          css={{
            color: "$textSecondary",
            fontSize: "$medium",
            margin: 0,
            textAlign: "center",
          }}>
          Migrating from Stitches? See the{" "}
          <Link
            href="/migration"
            style={{
              color: "inherit",
              textDecoration: "underline",
            }}>
            migration guide
          </Link>{" "}
          or check out the{" "}
          <Link
            href="/comparison"
            style={{
              color: "inherit",
              textDecoration: "underline",
            }}>
            comparison
          </Link>
          .
        </Text>
      </Stack>
    </Stack>
  );
}
