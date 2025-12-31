"use client";

import type { ComponentProps, ReactNode } from "react";

import Link from "next/link";
import {
  Code,
  Text,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "stoop-ui";
import { styled } from "stoop-ui/client";

// Simple Heading component
const Heading = styled("h1", {
  fontWeight: "$fontWeights.bold",
  lineHeight: "$lineHeights.tight",
  marginBottom: "$space.medium",
  marginTop: "$space.large",
});

const Heading2 = styled("h2", {
  fontWeight: "$fontWeights.bold",
  lineHeight: "$lineHeights.tight",
  marginBottom: "$space.medium",
  marginTop: "$space.large",
});

const Heading3 = styled("h3", {
  fontWeight: "$fontWeights.bold",
  lineHeight: "$lineHeights.tight",
  marginBottom: "$space.small",
  marginTop: "$space.medium",
});

const Heading4 = styled("h4", {
  fontWeight: "$fontWeights.bold",
  lineHeight: "$lineHeights.tight",
  marginBottom: "$space.small",
  marginTop: "$space.medium",
});

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

export function MDXLink({ children, href, ...props }: ComponentProps<"a">): ReactNode {
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
}

export function MDXCode({
  children,
  className,
  ...props
}: {
  children?: ReactNode;
  className?: string;
}): ReactNode {
  const isBlock = className?.includes("language-");

  return (
    <Code block={isBlock} {...props}>
      {children}
    </Code>
  );
}

export function MDXHeading1({ children, id, ...props }: ComponentProps<"h1">): ReactNode {
  return (
    <Heading as="h1" id={id} {...props}>
      {children}
    </Heading>
  );
}

export function MDXHeading2({ children, id, ...props }: ComponentProps<"h2">): ReactNode {
  return (
    <Heading2 as="h2" id={id} {...props}>
      {children}
    </Heading2>
  );
}

export function MDXHeading3({ children, id, ...props }: ComponentProps<"h3">): ReactNode {
  return (
    <Heading3 as="h3" id={id} {...props}>
      {children}
    </Heading3>
  );
}

export function MDXHeading4({ children, id, ...props }: ComponentProps<"h4">): ReactNode {
  return (
    <Heading4 as="h4" id={id} {...props}>
      {children}
    </Heading4>
  );
}

export function MDXParagraph({ children, ...props }: ComponentProps<"p">): ReactNode {
  return (
    <Text as="p" {...props}>
      {children}
    </Text>
  );
}

export function MDXTable({ children, ...props }: ComponentProps<"table">): ReactNode {
  return <Table {...props}>{children}</Table>;
}

export function MDXTableBody({ children, ...props }: ComponentProps<"tbody">): ReactNode {
  return <TableBody {...props}>{children}</TableBody>;
}

export function MDXTableCell({ children, ...props }: ComponentProps<"td">): ReactNode {
  return <TableCell {...props}>{children}</TableCell>;
}

export function MDXTableHeader({ children, ...props }: ComponentProps<"th">): ReactNode {
  return <TableHeader {...props}>{children}</TableHeader>;
}

export function MDXTableHead({ children, ...props }: ComponentProps<"thead">): ReactNode {
  return <TableHead {...props}>{children}</TableHead>;
}

export function MDXTableRow({ children, ...props }: ComponentProps<"tr">): ReactNode {
  return <TableRow {...props}>{children}</TableRow>;
}
