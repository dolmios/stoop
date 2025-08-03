import { JSX } from "react";

import type { StackProps } from "./types";

import { spacing } from "../../styles/theme";
import { StackStyled } from "./styles";

/**
 * Stack - Comprehensive layout component
 *
 * Handles all flexbox layouts - replaces the need for separate Flex component
 * Supports both container properties (direction, gap, align) and item properties (grow, shrink, basis)
 * Can be used as any HTML element via 'as' prop
 *
 * Examples:
 * <Stack direction="row" gap="large" justify="between">  // Horizontal layout
 * <Stack align="center" textAlign="center">             // Vertical centered
 * <Stack as="section" direction="row" minimal>          // Semantic HTML
 * <Stack grow={1} shrink={0} basis="200px">             // As flex item
 */
export function Stack({
  align,
  alignContent,
  as = "div",
  basis,
  bottom,
  children,
  css,
  direction = "column",
  gap,
  grow,
  inline = false,
  justify,
  minimal = false,
  shrink,
  textAlign,
  top,
  wrap,
  ...props
}: StackProps): JSX.Element {
  // Build flex item styles
  const flexItemStyles = {
    ...(grow !== undefined && { flexGrow: grow }),
    ...(shrink !== undefined && { flexShrink: shrink }),
    ...(basis && { flexBasis: basis }),
    ...(gap && { gap: spacing[gap] }),
  };

  // Apply spacing styles
  const spacingStyles = {
    ...(top && { paddingTop: spacing[top] }),
    ...(bottom && { paddingBottom: spacing[bottom] }),
  };

  return (
    <StackStyled
      align={align}
      alignContent={alignContent}
      as={as}
      css={{ ...flexItemStyles, ...spacingStyles, ...css }}
      direction={direction}
      inline={inline}
      justify={justify}
      minimal={minimal}
      textAlign={textAlign}
      wrap={wrap}
      {...props}>
      {children}
    </StackStyled>
  );
}
