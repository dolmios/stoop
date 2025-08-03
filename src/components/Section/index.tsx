import type { JSX } from "react";

import type { SectionProps } from "./types";

import { spacing } from "../../styles/theme";
import { SectionStyled, ContainerStyled } from "./styles";

/**
 * Section - Page layout wrapper component
 *
 * Creates a standardized page section with optional max-width container
 * Similar to the old View component but simplified for our design system
 *
 * Examples:
 * <Section>Content with standard container</Section>
 * <Section container={false}>Full-width content</Section>
 * <Section wide>Wider container for app layouts</Section>
 * <Section as="main" top="large" bottom="huge">Semantic HTML with spacing</Section>
 */
export function Section({
  as = "section",
  bottom,
  children,
  container = true,
  css,
  top,
  wide = false,
  ...props
}: SectionProps): JSX.Element {
  // Apply spacing styles
  const spacingStyles = {
    ...(top && { paddingTop: spacing[top] }),
    ...(bottom && { paddingBottom: spacing[bottom] }),
  };

  const content = container ? (
    <ContainerStyled container={container} wide={wide}>
      {children}
    </ContainerStyled>
  ) : (
    children
  );

  return (
    <SectionStyled as={as} css={{ ...spacingStyles, ...css }} {...props}>
      {content}
    </SectionStyled>
  );
}
