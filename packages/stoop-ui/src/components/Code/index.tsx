"use client";

import { useState, type ComponentProps, type ReactNode } from "react";

import { styled } from "../../stoop.theme";

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

// Inline code styling
const InlineCode = styled("code" as const, {
  backgroundColor: "$hover",
  borderRadius: "$small",
  fontFamily: "$mono",
  fontSize: "$small",
  padding: "2px 6px",
});

// Code block container with relative positioning for copy button
const CodeBlockContainer = styled("div", {
  position: "relative",
});

// Code block styling
const CodeBlock = styled("pre", {
  backgroundColor: "$hover",
  border: "1px solid $border",
  borderRadius: "$small",
  fontFamily: "$mono",
  fontSize: "$small",
  lineHeight: "1.6",
  margin: 0,
  overflowX: "auto",
  padding: "$medium",
});

const CodeBlockCode = styled("code", {
  fontFamily: "inherit",
  fontSize: "inherit",
});

// Copy button styling
const CopyButton = styled("button", {
  "&:hover": {
    backgroundColor: "$border",
  },
  [`${CodeBlockContainer}:hover &`]: {
    opacity: 1,
  },
  alignItems: "center",
  backgroundColor: "$background",
  border: "1px solid $border",
  borderRadius: "$small",
  color: "$text",
  cursor: "pointer",
  display: "flex",
  fontFamily: "$body",
  fontSize: "$small",
  justifyContent: "center",
  opacity: 0,
  padding: "$small",
  position: "absolute",
  right: "$small",
  top: "$small",
  transition: "$default",
});

export interface CodeProps extends ComponentProps<typeof InlineCode> {
  children?: ReactNode;
  block?: boolean;
}

export function Code({ block, children, ...props }: CodeProps): ReactNode {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<void> => {
    const text = extractText(children);

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (block) {
    return (
      <CodeBlockContainer>
        <CodeBlock>
          <CodeBlockCode {...props}>{children}</CodeBlockCode>
        </CodeBlock>
        <CopyButton type="button" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </CopyButton>
      </CodeBlockContainer>
    );
  }

  return <InlineCode {...props}>{children}</InlineCode>;
}
