"use client";

import type { ComponentProps, ReactNode } from "react";

import NextLink from "next/link";
import {
  Badge,
  Code as StoopCode,
  ProseHeading,
  ProseHeading2,
  ProseHeading3,
  ProseHeading4,
  ProseHeadingWrapper2,
  ProseHeadingWrapper3,
  ProseLink,
  ProseLinkWrapper,
  ProseListItem,
  ProseOrderedList,
  ProseTableWrapper,
  ProseUnorderedList,
  Stack,
  Table as StoopTable,
  TableBody as StoopTableBody,
  TableCell as StoopTableCell,
  TableHead as StoopTableHead,
  TableHeader as StoopTableHeader,
  TableRow as StoopTableRow,
  Text,
} from "stoop-ui";

function MarkdownLink({ children, href, ...props }: ComponentProps<"a">): ReactNode {
  const isInternal = href?.startsWith("/");

  if (isInternal && href) {
    return (
      <ProseLinkWrapper>
        <NextLink href={href} {...props}>
          {children}
        </NextLink>
      </ProseLinkWrapper>
    );
  }

  return (
    <ProseLink href={href} {...props}>
      {children}
    </ProseLink>
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
    <ProseHeading as="h1" id={id} {...props}>
      {children}
    </ProseHeading>
  );
}

function MarkdownHeadingTwo({ children, id, ...props }: ComponentProps<"h2">): ReactNode {
  const childrenArray = Array.isArray(children) ? children : [children];
  const processedChildren: ReactNode[] = [];
  let i = 0;
  let hasBadges = false;

  while (i < childrenArray.length) {
    const child = childrenArray[i];
    const nextChild = childrenArray[i + 1];

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
      i += 3;
      continue;
    }

    processedChildren.push(child);
    i++;
  }

  if (hasBadges) {
    return (
      <ProseHeadingWrapper2 id={id} {...props}>
        {processedChildren}
      </ProseHeadingWrapper2>
    );
  }

  return (
    <ProseHeading2 as="h2" id={id} {...props}>
      {children}
    </ProseHeading2>
  );
}

function MarkdownHeadingThree({ children, id, ...props }: ComponentProps<"h3">): ReactNode {
  const childrenArray = Array.isArray(children) ? children : [children];
  const processedChildren: ReactNode[] = [];
  let i = 0;
  let hasBadges = false;

  while (i < childrenArray.length) {
    const child = childrenArray[i];
    const nextChild = childrenArray[i + 1];

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
      i += 3;
      continue;
    }

    processedChildren.push(child);
    i++;
  }

  if (hasBadges) {
    return (
      <ProseHeadingWrapper3 id={id} {...props}>
        {processedChildren}
      </ProseHeadingWrapper3>
    );
  }

  return (
    <ProseHeading3 as="h3" id={id} {...props}>
      {children}
    </ProseHeading3>
  );
}

function MarkdownHeadingFour({ children, id, ...props }: ComponentProps<"h4">): ReactNode {
  return (
    <ProseHeading4 as="h4" id={id} {...props}>
      {children}
    </ProseHeading4>
  );
}

function MarkdownParagraph({ children, ...props }: ComponentProps<"p">): ReactNode {
  return (
    <Text as="p" css={{ marginBottom: "$medium", marginTop: 0 }} {...props}>
      {children}
    </Text>
  );
}

function MarkdownUnorderedList({ children, ...props }: ComponentProps<"ul">): ReactNode {
  return <ProseUnorderedList {...props}>{children}</ProseUnorderedList>;
}

function MarkdownOrderedList({ children, ...props }: ComponentProps<"ol">): ReactNode {
  return <ProseOrderedList {...props}>{children}</ProseOrderedList>;
}

function MarkdownListItem({ children, ...props }: ComponentProps<"li">): ReactNode {
  return <ProseListItem {...props}>{children}</ProseListItem>;
}

function MarkdownTable({ children, ...props }: ComponentProps<"table">): ReactNode {
  return (
    <ProseTableWrapper>
      <StoopTable
        css={{
          minWidth: "100%",
          width: "100%",
        }}
        {...props}>
        {children}
      </StoopTable>
    </ProseTableWrapper>
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
