import type { JSX } from "react";

import type { CardProps } from "./types";

import { CardStyled, CardHeaderStyled, CardFooterStyled, CardContentStyled } from "./styles";
import { Text } from "../Text";
import { Button } from "../Button";

/**
 * Card - Container component for grouping related content
 *
 * Includes a header with required title and optional close button
 * Supports interactive states and flexible padding
 *
 * Examples:
 * <Card title="My Card">Basic card content</Card>
 * <Card title="Settings" onClose={() => {}}>Card with close button</Card>
 * <Card title="Interactive" clickable padding="default">Interactive card</Card>
 */
export function Card({
  as = "div",
  children,
  clickable = false,
  css,
  footer,
  onClose,
  onClick,
  padding = "default",
  title,
  variant = "default",
  ...props
}: CardProps): JSX.Element {
  const isClickable = clickable || !!onClick;
  const hasFooter = !!footer;

  return (
    <CardStyled
      as={as}
      clickable={isClickable}
      css={css}
      padding="minimal"
      variant={variant}
      onClick={onClick}
      {...(isClickable && { role: "button", tabIndex: 0 })}
      {...props}>
      
      {/* Header with title and optional close button */}
      <CardHeaderStyled padding={padding}>
        <Text 
          as="span" 
          css={{ 
            flex: 1, 
            fontSize: "$small",
            fontWeight: "$semibold"
          }}
        >
          {title}
        </Text>
        {onClose && (
          <Button
            css={{
              flexShrink: 0,
              fontSize: "16px",
              height: "24px",
              padding: "0",
              width: "24px",
            }}
            size="small"
            variant="minimal"
            onClick={onClose}>
            ×
          </Button>
        )}
      </CardHeaderStyled>

      <CardContentStyled
        hasFooter={hasFooter}
        hasHeader={true}
        padding={padding}>
        {children}
      </CardContentStyled>

      {hasFooter && <CardFooterStyled padding={padding}>{footer}</CardFooterStyled>}
    </CardStyled>
  );
}
