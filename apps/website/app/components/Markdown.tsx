"use client";

import type { ComponentProps, ReactNode } from "react";

import NextLink from "next/link";
import { styled } from "stoop";
import {
  Badge,
  Code as StoopCode,
  Stack,
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
  fontWeight: "$bold",
  lineHeight: "$tight",
  marginBottom: "$medium",
  marginTop: "$large",
});

const Heading2 = styled("h2", {
  fontWeight: "$bold",
  lineHeight: "$tight",
  marginBottom: "$medium",
  marginTop: "$large",
});

const Heading3 = styled("h3", {
  fontWeight: "$bold",
  lineHeight: "$tight",
  marginBottom: "$small",
  marginTop: "$medium",
});

const Heading4 = styled("h4", {
  fontWeight: "$bold",
  lineHeight: "$tight",
  marginBottom: "$small",
  marginTop: "$medium",
});

// Heading wrapper for badges - styled h2/h3 with flex layout
const HeadingWrapper2 = styled("h2", {
  alignItems: "center",
  display: "inline-flex",
  fontWeight: "$bold",
  gap: "$small",
  lineHeight: "$tight",
  marginBottom: "$medium",
  marginTop: "$large",
});

const HeadingWrapper3 = styled("h3", {
  alignItems: "center",
  display: "inline-flex",
  fontWeight: "$bold",
  gap: "$small",
  lineHeight: "$tight",
  marginBottom: "$small",
  marginTop: "$medium",
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
}: ComponentProps<"code"> & {
  children?: ReactNode;
}): ReactNode {
  const isBlock = className?.includes("language-");

  if (isBlock) {
    return (
      <Stack
        bottom="medium"
        css={{
          minWidth: 0,
          width: "100%",
        }}
        top="medium">
        <StoopCode block={isBlock} {...props}>
          {children}
        </StoopCode>
      </Stack>
    );
  }

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
  // Check if children contain badges or need special handling
  const childrenArray = Array.isArray(children) ? children : [children];
  const processedChildren: ReactNode[] = [];
  let i = 0;
  let hasBadges = false;

  while (i < childrenArray.length) {
    const child = childrenArray[i];
    const nextChild = childrenArray[i + 1];

    // Pattern 1: String with parentheses and backticks: "text (`badge`)"
    if (typeof child === "string") {
      const badgeMatch = /^(.*?)\s*\(`([^`]+)`\)(.*)$/.exec(child);

      if (badgeMatch) {
        const [, before, badgeText, after] = badgeMatch;

        if (before.trim()) processedChildren.push(before.trim() + " ");
        processedChildren.push(
          <Badge
            key={`badge-${i}`}
            css={{ fontSize: "inherit", lineHeight: "inherit" }}
            variant="secondary">
            {badgeText}
          </Badge>,
        );
        hasBadges = true;
        if (after.trim()) processedChildren.push(" " + after.trim());
        i++;
        continue;
      }
    }

    // Pattern 2: Check for code element wrapped in parentheses pattern
    // MDX might parse as: ["text (", <code>badge</code>, ")"]
    if (
      typeof child === "string" &&
      child.trim().endsWith("(") &&
      nextChild &&
      typeof nextChild === "object" &&
      "type" in nextChild &&
      nextChild.type === "code" &&
      childrenArray[i + 2] &&
      typeof childrenArray[i + 2] === "string" &&
      childrenArray[i + 2].trim().startsWith(")")
    ) {
      const beforeText = child.trim().slice(0, -1).trim();

      if (beforeText) processedChildren.push(beforeText + " ");
      processedChildren.push(
        <Badge
          key={`badge-${i}`}
          css={{ fontSize: "inherit", lineHeight: "inherit" }}
          variant="secondary">
          {nextChild.props?.children || nextChild}
        </Badge>,
      );
      hasBadges = true;
      i += 3; // Skip the code element and closing paren
      continue;
    }

    processedChildren.push(child);
    i++;
  }

  // If we found badges, wrap in flex container
  if (hasBadges) {
    return (
      <HeadingWrapper2 id={id} {...props}>
        {processedChildren}
      </HeadingWrapper2>
    );
  }

  return (
    <Heading2 as="h2" id={id} {...props}>
      {children}
    </Heading2>
  );
}

function MarkdownHeadingThree({ children, id, ...props }: ComponentProps<"h3">): ReactNode {
  // Check if children contain badges or need special handling
  const childrenArray = Array.isArray(children) ? children : [children];
  const processedChildren: ReactNode[] = [];
  let i = 0;
  let hasBadges = false;

  while (i < childrenArray.length) {
    const child = childrenArray[i];
    const nextChild = childrenArray[i + 1];

    // Pattern 1: String with parentheses and backticks: "text (`badge`)"
    if (typeof child === "string") {
      const badgeMatch = /^(.*?)\s*\(`([^`]+)`\)(.*)$/.exec(child);

      if (badgeMatch) {
        const [, before, badgeText, after] = badgeMatch;

        if (before.trim()) processedChildren.push(before.trim() + " ");
        processedChildren.push(
          <Badge
            key={`badge-${i}`}
            css={{ fontSize: "inherit", lineHeight: "inherit" }}
            variant="secondary">
            {badgeText}
          </Badge>,
        );
        hasBadges = true;
        if (after.trim()) processedChildren.push(" " + after.trim());
        i++;
        continue;
      }
    }

    // Pattern 2: Check for code element wrapped in parentheses pattern
    if (
      typeof child === "string" &&
      child.trim().endsWith("(") &&
      nextChild &&
      typeof nextChild === "object" &&
      "type" in nextChild &&
      nextChild.type === "code" &&
      childrenArray[i + 2] &&
      typeof childrenArray[i + 2] === "string" &&
      childrenArray[i + 2].trim().startsWith(")")
    ) {
      const beforeText = child.trim().slice(0, -1).trim();

      if (beforeText) processedChildren.push(beforeText + " ");
      processedChildren.push(
        <Badge
          key={`badge-${i}`}
          css={{ fontSize: "inherit", lineHeight: "inherit" }}
          variant="secondary">
          {nextChild.props?.children || nextChild}
        </Badge>,
      );
      hasBadges = true;
      i += 3; // Skip the code element and closing paren
      continue;
    }

    processedChildren.push(child);
    i++;
  }

  // If we found badges, wrap in flex container
  if (hasBadges) {
    return (
      <HeadingWrapper3 id={id} {...props}>
        {processedChildren}
      </HeadingWrapper3>
    );
  }

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
    <Text as="p" css={{ marginBottom: "$medium", marginTop: 0 }} {...props}>
      {children}
    </Text>
  );
}

const UnorderedListStyled = styled("ul", {
  "&:last-child": {
    marginBottom: 0,
  },
  color: "$text",
  fontFamily: "$body",
  fontSize: "$default",
  fontWeight: "$default",
  lineHeight: 1.4,
  listStyle: "disc",
  margin: 0,
  marginBlock: 0,
  marginBottom: "$medium",
  marginTop: 0,
  paddingLeft: "$large",
});

const OrderedListStyled = styled("ol", {
  "&:last-child": {
    marginBottom: 0,
  },
  color: "$text",
  fontFamily: "$body",
  fontSize: "$default",
  fontWeight: "$default",
  lineHeight: 1.4,
  listStyle: "decimal",
  margin: 0,
  marginBlock: 0,
  marginBottom: "$medium",
  marginTop: 0,
  paddingLeft: "$large",
});

const ListItemStyled = styled("li", {
  marginBottom: "$small",
  marginTop: 0,
});

function MarkdownUnorderedList({ children, ...props }: ComponentProps<"ul">): ReactNode {
  return <UnorderedListStyled {...props}>{children}</UnorderedListStyled>;
}

function MarkdownOrderedList({ children, ...props }: ComponentProps<"ol">): ReactNode {
  return <OrderedListStyled {...props}>{children}</OrderedListStyled>;
}

function MarkdownListItem({ children, ...props }: ComponentProps<"li">): ReactNode {
  return <ListItemStyled {...props}>{children}</ListItemStyled>;
}

const TableWrapper = styled("div", {
  marginBottom: "$medium",
  marginTop: "$medium",
  maxWidth: "100vw",
  overflowX: "auto",
  width: "100%",
});

function MarkdownTable({ children, ...props }: ComponentProps<"table">): ReactNode {
  return (
    <TableWrapper>
      <StoopTable
        css={{
          minWidth: "100%",
          width: "100%",
        }}
        {...props}>
        {children}
      </StoopTable>
    </TableWrapper>
  );
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
export const ListItem = MarkdownListItem;
export const OrderedList = MarkdownOrderedList;
export const Paragraph = MarkdownParagraph;
export const Table = MarkdownTable;
export const TableBody = MarkdownTableBody;
export const TableCell = MarkdownTableCell;
export const TableHead = MarkdownTableHead;
export const TableHeader = MarkdownTableHeader;
export const TableRow = MarkdownTableRow;
export const UnorderedList = MarkdownUnorderedList;

// Export as namespace object
export const Markdown = {
  Code: MarkdownCode,
  HeadingFour: MarkdownHeadingFour,
  HeadingOne: MarkdownHeadingOne,
  HeadingThree: MarkdownHeadingThree,
  HeadingTwo: MarkdownHeadingTwo,
  Link: MarkdownLink,
  ListItem: MarkdownListItem,
  OrderedList: MarkdownOrderedList,
  Paragraph: MarkdownParagraph,
  Table: MarkdownTable,
  TableBody: MarkdownTableBody,
  TableCell: MarkdownTableCell,
  TableHead: MarkdownTableHead,
  TableHeader: MarkdownTableHeader,
  TableRow: MarkdownTableRow,
  UnorderedList: MarkdownUnorderedList,
};
