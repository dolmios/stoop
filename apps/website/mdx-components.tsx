"use client";

import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ReactNode } from "react";

import Link from "next/link";

import { Code, Heading, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Text, styled } from "./ui";

// Styled link component with border-bottom (using Text styling)
const LinkText = styled("a", {
  "&:hover": {
    borderBottomColor: "currentColor",
    opacity: "$opacities.hover",
  },
  borderBottom: "1px solid currentColor",
  color: "inherit",
  display: "inline",
  textDecoration: "none",
  transition: "$transitions.default",
});

// Styled wrapper for Next.js Link
const LinkWrapper = styled("span", {
  "& a": {
    "&:hover": {
      borderBottomColor: "currentColor",
      opacity: "$opacities.hover",
    },
    borderBottom: "1px solid currentColor",
    color: "inherit",
    textDecoration: "none",
    transition: "$transitions.default",
  },
  display: "inline",
});

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({
      children,
      href,
      ...props
    }: ComponentProps<"a">): ReactNode => {
      // Check if it's an internal link (starts with /)
      const isInternal = href?.startsWith("/");

      if (isInternal && href) {
        return (
          <LinkWrapper>
            <Link href={href} {...props}>
              {children}
            </Link>
          </LinkWrapper>
        );
      }

      // External link or anchor link
      return (
        <LinkText href={href} {...props}>
          {children}
        </LinkText>
      );
    },
    code: ({
      children,
      className,
      ...props
    }: {
      children?: ReactNode;
      className?: string;
    }): ReactNode => {
      const isBlock = className?.includes("language-");

      return (
        <Code block={isBlock} {...props}>
          {children}
        </Code>
      );
    },
    h1: ({ children, id, ...props }) => (
      <Heading id={id} level={1} {...props}>
        {children}
      </Heading>
    ),
    h2: ({ children, id, ...props }) => (
      <Heading id={id} level={2} {...props}>
        {children}
      </Heading>
    ),
    h3: ({ children, id, ...props }) => (
      <Heading id={id} level={3} {...props}>
        {children}
      </Heading>
    ),
    h4: ({ children, id, ...props }) => (
      <Heading id={id} level={4} {...props}>
        {children}
      </Heading>
    ),
    p: ({ children, ...props }) => (
      <Text as="p" {...props}>
        {children}
      </Text>
    ),
    table: ({ children, ...props }) => <Table {...props}>{children}</Table>,
    tbody: ({ children, ...props }) => <TableBody {...props}>{children}</TableBody>,
    td: ({ children, ...props }) => <TableCell {...props}>{children}</TableCell>,
    th: ({ children, ...props }) => <TableHeader {...props}>{children}</TableHeader>,
    thead: ({ children, ...props }) => <TableHead {...props}>{children}</TableHead>,
    tr: ({ children, ...props }) => <TableRow {...props}>{children}</TableRow>,
    ...components,
  };
}
