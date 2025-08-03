import type { JSX } from "react";

import type { TextProps, TextElement } from "./types";

import { spacing } from "../../styles/theme";
import { TextStyled } from "./styles";

/**
 * Text - Typography component
 *
 * Provides consistent typography with semantic HTML elements
 * Supports size override, muted styling, and spacing props
 *
 * Examples:
 * <Text as="h1">Page Title</Text>
 * <Text as="p" size="small" muted>Subtitle</Text>
 * <Text as="span" size="h3">Custom sized span</Text>
 */
export function Text({
  as = "p",
  bottom,
  children,
  css,
  muted = false,
  size,
  top,
  ...props
}: TextProps): JSX.Element {
  // Use size prop if provided, otherwise default to the 'as' element
  const effectiveSize = size || (as as TextElement);

  // Apply spacing styles
  const spacingStyles = {
    ...(top && { marginTop: 0, paddingTop: spacing[top] }),
    ...(bottom && { marginBottom: 0, paddingBottom: spacing[bottom] }),
  };

  return (
    <TextStyled
      as={as}
      css={{ ...spacingStyles, ...css }}
      muted={muted}
      size={effectiveSize}
      {...props}>
      {children}
    </TextStyled>
  );
}
