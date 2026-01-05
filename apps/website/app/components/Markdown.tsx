"use client";

import type { ComponentProps, ReactNode } from "react";

import NextLink from "next/link";
import {
  Code as StoopCode,
  styled,
  Table as StoopTable,
  TableBody as StoopTableBody,
  TableCell as StoopTableCell,
  TableHead as StoopTableHead,
  TableHeader as StoopTableHeader,
  TableRow as StoopTableRow,
  Text,
} from "stoop-ui";

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

function MarkdownLink({ children, href, ...props }: ComponentProps<"a">): ReactNode {
  // Check if it's an internal link (starts with /)
  const isInternal = href?.startsWith("/");

  if (isInternal && href) {
    return (
      <LinkWrapper>
        <NextLink href={href} {...props}>
          {children}
        </NextLink>
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

function MarkdownCode({
  children,
  className,
  ...props
}: {
  children?: ReactNode;
  className?: string;
}): ReactNode {
  const isBlock = className?.includes("language-");

  return (
    <StoopCode block={isBlock} {...props}>
      {children}
    </StoopCode>
  );
}

function MarkdownHeadingOne({ children, id, ...props }: ComponentProps<"h1">): ReactNode {
  return (
    <Heading as="h1" id={id} {...props}>
      {children}
    </Heading>
  );
}

function MarkdownHeadingTwo({ children, id, ...props }: ComponentProps<"h2">): ReactNode {
  return (
    <Heading2 as="h2" id={id} {...props}>
      {children}
    </Heading2>
  );
}

function MarkdownHeadingThree({ children, id, ...props }: ComponentProps<"h3">): ReactNode {
  return (
    <Heading3 as="h3" id={id} {...props}>
      {children}
    </Heading3>
  );
}

function MarkdownHeadingFour({ children, id, ...props }: ComponentProps<"h4">): ReactNode {
  return (
    <Heading4 as="h4" id={id} {...props}>
      {children}
    </Heading4>
  );
}

function MarkdownParagraph({ children, ...props }: ComponentProps<"p">): ReactNode {
  return (
    <Text as="p" {...props}>
      {children}
    </Text>
  );
}

function MarkdownTable({ children, ...props }: ComponentProps<"table">): ReactNode {
  return <StoopTable {...props}>{children}</StoopTable>;
}

function MarkdownTableBody({ children, ...props }: ComponentProps<"tbody">): ReactNode {
  return <StoopTableBody {...props}>{children}</StoopTableBody>;
}

function MarkdownTableCell({ children, ...props }: ComponentProps<"td">): ReactNode {
  return <StoopTableCell {...props}>{children}</StoopTableCell>;
}

function MarkdownTableHeader({ children, ...props }: ComponentProps<"th">): ReactNode {
  return <StoopTableHeader {...props}>{children}</StoopTableHeader>;
}

function MarkdownTableHead({ children, ...props }: ComponentProps<"thead">): ReactNode {
  return <StoopTableHead {...props}>{children}</StoopTableHead>;
}

function MarkdownTableRow({ children, ...props }: ComponentProps<"tr">): ReactNode {
  return <StoopTableRow {...props}>{children}</StoopTableRow>;
}

// Export individual components
export const Code = MarkdownCode;
export const HeadingOne = MarkdownHeadingOne;
export const HeadingTwo = MarkdownHeadingTwo;
export const HeadingThree = MarkdownHeadingThree;
export const HeadingFour = MarkdownHeadingFour;
export const Link = MarkdownLink;
export const Paragraph = MarkdownParagraph;
export const Table = MarkdownTable;
export const TableBody = MarkdownTableBody;
export const TableCell = MarkdownTableCell;
export const TableHead = MarkdownTableHead;
export const TableHeader = MarkdownTableHeader;
export const TableRow = MarkdownTableRow;

// Export as namespace object
export const Markdown = {
  Code: MarkdownCode,
  HeadingFour: MarkdownHeadingFour,
  HeadingOne: MarkdownHeadingOne,
  HeadingThree: MarkdownHeadingThree,
  HeadingTwo: MarkdownHeadingTwo,
  Link: MarkdownLink,
  Paragraph: MarkdownParagraph,
  Table: MarkdownTable,
  TableBody: MarkdownTableBody,
  TableCell: MarkdownTableCell,
  TableHead: MarkdownTableHead,
  TableHeader: MarkdownTableHeader,
  TableRow: MarkdownTableRow,
};
