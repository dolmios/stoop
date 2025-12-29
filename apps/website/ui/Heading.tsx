"use client";

import type { ReactNode } from "react";

import { styled } from "../stoop.theme";
import { Text } from "./Text";

// Heading container with anchor link
const HeadingContainer = styled("div", {
  marginLeft: "-1.5rem",
  paddingLeft: "1.5rem",
  position: "relative",
});

// Anchor link that appears on hover
const AnchorLink = styled("a", {
  "&:hover": {
    opacity: 1,
  },
  [`${HeadingContainer}:hover &`]: {
    opacity: 1,
  },
  color: "$text",
  fontSize: "$default",
  left: 0,
  opacity: 0,
  position: "absolute",
  textDecoration: "none",
  top: "50%",
  transform: "translateY(-50%)",
  transition: "$default",
});

function getHeadingId(children: ReactNode, id?: string): string | undefined {
  if (id) return id;

  if (typeof children === "string") {
    return children
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  if (Array.isArray(children)) {
    const text = children
      .map((child) => (typeof child === "string" ? child : ""))
      .join("")
      .trim();

    if (text) {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
    }
  }

  return undefined;
}

interface HeadingProps {
  children?: ReactNode;
  id?: string;
  level: 1 | 2 | 3 | 4;
  [key: string]: unknown;
}

export function Heading({ children, id, level, ...props }: HeadingProps): ReactNode {
  const headingId = getHeadingId(children, id);
  const href = headingId ? `#${headingId}` : undefined;

  return (
    <HeadingContainer>
      <Text as={`h${level}` as const} id={headingId} variant={`h${level}` as const} {...props}>
        {children}
      </Text>
      {href && <AnchorLink href={href}>#</AnchorLink>}
    </HeadingContainer>
  );
}
