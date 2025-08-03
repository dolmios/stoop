import type { JSX } from "react";

import type { CardProps } from "./types";

import { CardStyled, CardHeaderStyled, CardFooterStyled, CardContentStyled } from "./styles";

/**
 * Card - Container component for grouping related content
 *
 * Sharp edges design with multiple variants and optional header/footer
 * Supports interactive states and flexible padding
 *
 * Examples:
 * <Card variant="default">Basic card content</Card>
 * <Card variant="bordered" header="Title">Card with header</Card>
 * <Card clickable padding="default">Interactive card</Card>
 */
export function Card({
  as = "div",
  children,
  clickable = false,
  css,
  footer,
  header,
  onClick,
  padding = "default",
  variant = "default",
  ...props
}: CardProps): JSX.Element {
  const isClickable = clickable || !!onClick;
  const hasHeader = !!header;
  const hasFooter = !!footer;

  return (
    <CardStyled
      as={as}
      clickable={isClickable}
      css={css}
      padding={hasHeader || hasFooter ? "minimal" : padding}
      variant={variant}
      onClick={onClick}
      {...(isClickable && { role: "button", tabIndex: 0 })}
      {...props}>
      {hasHeader && <CardHeaderStyled padding={padding}>{header}</CardHeaderStyled>}

      <CardContentStyled
        hasFooter={hasFooter}
        hasHeader={hasHeader}
        padding={hasHeader || hasFooter ? padding : "minimal"}>
        {children}
      </CardContentStyled>

      {hasFooter && <CardFooterStyled padding={padding}>{footer}</CardFooterStyled>}
    </CardStyled>
  );
}
