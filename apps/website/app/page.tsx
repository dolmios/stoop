"use client";

import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";
import { Badge, Button, Code, Stack, Text } from "stoop-ui";

import { GithubLogo, RocketLaunch } from "../lib/icons";

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
          <Badge variant="secondary">Build-time CSS-in-JS</Badge>
          <Badge variant="secondary">SWC-powered</Badge>
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
          Build-time CSS-in-JS with Stitches ergonomics. Zero runtime. SWC-powered.
        </Text>
        <Stack align="center" css={{ marginTop: "$medium", maxWidth: "700px" }} gap="small">
          <Text
            css={{
              color: "$textSecondary",
              fontSize: "$small",
              margin: 0,
              textAlign: "center",
            }}>
            Key features: SWC plugin transforms styled() calls at build time • Zero runtime overhead
            • Stitches-compatible API • Full Next.js App Router support • Type-safe variants and
            themes
          </Text>
        </Stack>
      </Stack>
      <Stack align="center" direction="row" gap="medium" justify="center" wrap>
        <Button as={Link} href="/installation" icon={<RocketLaunch size={18} />} variant="primary">
          Get Started
        </Button>
        <Button
          as="a"
          href="https://github.com/dolmios/stoop"
          icon={<GithubLogo size={18} />}
          rel="noopener noreferrer"
          target="_blank"
          variant="secondary">
          View on GitHub
        </Button>
      </Stack>
      <Stack css={{ marginTop: "$large", maxWidth: "400px", width: "100%" }}>
        <Code block>npm install stoop stoop-ui</Code>
      </Stack>
      <Stack align="center" css={{ marginTop: "$large", maxWidth: "600px" }} gap="small">
        <Text
          css={{
            color: "$textSecondary",
            fontSize: "$medium",
            margin: 0,
            textAlign: "center",
          }}>
          Migrating from Stitches or the runtime stoop package? See our{" "}
          <Link
            href="/migration"
            style={{
              color: "inherit",
              fontWeight: "bold",
              textDecoration: "underline",
            }}>
            migration guide
          </Link>
          .
        </Text>
      </Stack>
    </Stack>
  );
}
