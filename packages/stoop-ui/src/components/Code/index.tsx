"use client";

import type { ComponentProps, JSX, ReactNode } from "react";

import { useCallback, useState } from "react";

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
const CodeStyled = styled("code", {
  backgroundColor: "$hover",
  borderRadius: "$small",
  fontSize: "$small",
  padding: "2px 6px",
});

// Code block container with relative positioning for copy button
const CodeBlockContainerStyled = styled("div", {
  position: "relative",
});

// Code block styling
const CodeBlockStyled = styled("pre", {
  backgroundColor: "$hover",
  border: "1px solid $borderStrong",
  borderBottomColor: "$borderEmphasis",
  borderRadius: "$default",
  borderTopColor: "$borderLight",
  boxShadow: "$subtle",
  fontFamily: "$mono",
  fontSize: "$small",
  lineHeight: 1.6,
  margin: 0,
  overflowX: "auto",
  padding: "$medium",
});

const CodeBlockCodeStyled = styled("code", {
  fontFamily: "inherit",
  fontSize: "inherit",
});

// Copy button styling
const CodeCopyButtonStyled = styled("button", {
  "&:active": {
    boxShadow: "$inset",
    transform: "translateY(0)",
  },
  "&:hover": {
    backgroundColor: "$surfaceHover",
    borderColor: "$borderStrong",
    boxShadow: "$subtle",
  },
  alignItems: "center",
  backgroundColor: "$surface",
  border: "1px solid $borderStrong",
  borderBottomColor: "$borderEmphasis",
  borderRadius: "$small",
  borderTopColor: "$borderLight",
  boxShadow: "$subtle",
  color: "$text",
  cursor: "pointer",
  display: "flex",
  fontFamily: "$body",
  fontSize: "$small",
  fontWeight: "$default",
  gap: "$smaller",
  justifyContent: "center",
  padding: "$smaller $small",
  position: "absolute",
  right: "$small",
  top: "$small",
  transition: "$default",
  zIndex: 1,
});

export interface CodeProps extends ComponentProps<typeof CodeStyled> {
  block?: boolean;
  children?: ReactNode;
  fontFamily?: string;
}

export const Code = ({ block, children, fontFamily, ...props }: CodeProps): JSX.Element => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (): Promise<void> => {
    const text = extractText(children);

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [children]);

  const fontFamilyStyle = fontFamily ? { fontFamily } : undefined;

  if (block) {
    return (
      <CodeBlockContainerStyled>
        <CodeBlockStyled css={fontFamilyStyle}>
          <CodeBlockCodeStyled {...props}>{children}</CodeBlockCodeStyled>
        </CodeBlockStyled>
        <CodeCopyButtonStyled type="button" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </CodeCopyButtonStyled>
      </CodeBlockContainerStyled>
    );
  }

  return (
    <CodeStyled css={fontFamilyStyle} {...props}>
      {children}
    </CodeStyled>
  );
};
