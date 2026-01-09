"use client";

import { useState, type ComponentProps, type ElementType, type ReactNode } from "react";

import { styled } from "../../stoop.theme";

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

// Copy button for copyable text
const CopyButton = styled("button", {
  "&:hover": {
    backgroundColor: "$hover",
  },
  [`${HeadingContainer}:hover &`]: {
    opacity: 1,
  },
  backgroundColor: "transparent",
  border: "none",
  color: "$text",
  cursor: "pointer",
  fontSize: "$small",
  marginLeft: "$small",
  opacity: 0,
  padding: "$smaller",
  transition: "$default",
});

export const Text = styled("p", {
  "&:last-child": {
    marginBottom: 0,
  },
  color: "$text",
  fontFamily: "$body",
  fontSize: "$default",
  fontWeight: "$default",
  lineHeight: 1.4,
  margin: 0,
  marginBlock: 0,
  marginBottom: "$medium",
  variants: {
    bottom: {
      none: {
        marginBottom: 0,
      },
    },
    size: {
      large: {
        fontSize: "$large",
      },
      medium: {
        fontSize: "$default",
      },
      small: {
        fontSize: "$small",
      },
    },
    variant: {
      h1: {
        "&:first-child": {
          marginTop: 0,
        },
        fontFamily: "$mono",
        fontSize: "$h1",
        fontWeight: "$bold",
        lineHeight: 1.2,
        marginBlock: 0,
        marginBottom: "$large",
        marginTop: "$larger",
      },
      h2: {
        fontFamily: "$heading",
        fontSize: "$h2",
        fontWeight: "$bold",
        lineHeight: 1.2,
        marginBlock: 0,
        marginBottom: "$medium",
        marginTop: "$large",
      },
      h3: {
        fontFamily: "$heading",
        fontSize: "$h3",
        fontWeight: "$bold",
        lineHeight: 1.2,
        marginBlock: 0,
        marginBottom: "$medium",
        marginTop: "$large",
      },
      h4: {
        fontFamily: "$heading",
        fontSize: "$h4",
        fontWeight: "$bold",
        lineHeight: 1.2,
        marginBlock: 0,
        marginBottom: "$small",
        marginTop: "$medium",
      },
      h5: {
        fontFamily: "$heading",
        fontSize: "$h5",
        fontWeight: "$bold",
        lineHeight: 1.2,
        marginBlock: 0,
        marginBottom: "$small",
        marginTop: "$medium",
      },
      h6: {
        fontFamily: "$heading",
        fontSize: "$h6",
        fontWeight: "$bold",
        lineHeight: 1.2,
        marginBlock: 0,
        marginBottom: "$small",
        marginTop: "$medium",
      },
    },
  },
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

function extractText(children: ReactNode): string {
  if (typeof children === "string") {
    return children;
  }
  if (typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractText).join("");
  }
  if (children && typeof children === "object" && "props" in children) {
    const element = children as { props: { children?: ReactNode } };

    if (element.props?.children) {
      return extractText(element.props.children);
    }
  }

  return String(children ?? "");
}

export type TextProps<T extends ElementType = "p"> = ComponentProps<typeof Text> & {
  as?: T;
  copyable?: boolean;
  id?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

export function TextComponent<T extends ElementType = "p">({
  as,
  children,
  copyable,
  id,
  level,
  variant,
  ...props
}: TextProps<T>): ReactNode {
  const [copied, setCopied] = useState(false);

  // Determine variant from level if provided
  const finalVariant = variant || (level ? `h${level}` : undefined);

  // Determine if this is a heading variant
  const isHeading = finalVariant?.startsWith("h");

  // Get heading ID for anchor links
  const headingId = isHeading ? getHeadingId(children, id) : undefined;
  const href = headingId ? `#${headingId}` : undefined;

  // Determine element type
  const elementType = as || (isHeading ? `h${level || finalVariant?.slice(1)}` : "p");

  const handleCopy = async (): Promise<void> => {
    const text = extractText(children);

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const textElement = (
    <Text as={elementType as ElementType} id={headingId} variant={finalVariant} {...props}>
      {children}
    </Text>
  );

  // If it's a heading, wrap with container for anchor link
  if (isHeading) {
    return (
      <HeadingContainer>
        {textElement}
        {href && <AnchorLink href={href}>#</AnchorLink>}
        {copyable && (
          <CopyButton type="button" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </CopyButton>
        )}
      </HeadingContainer>
    );
  }

  // If copyable but not heading, wrap with container
  if (copyable) {
    return (
      <HeadingContainer>
        {textElement}
        <CopyButton type="button" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </CopyButton>
      </HeadingContainer>
    );
  }

  return textElement;
}
