import type { JSX } from "react";

import type { ButtonProps } from "./types";

import { spacing } from "../../styles/theme";
import { ButtonStyled } from "./styles";

/**
 * Button - Interactive button component
 *
 * Sharp edges design with brand colors and multiple variants
 * Supports loading states, sizing, and polymorphic rendering
 *
 * Examples:
 * <Button variant="primary">Primary Action</Button>
 * <Button variant="secondary" size="small">Secondary</Button>
 * <Button as="a" href="/link">Link Button</Button>
 */
export function Button({
  block = false,
  bottom,
  children,
  css,
  disabled,
  loading = false,
  size = "normal",
  top,
  variant = "primary",
  ...props
}: ButtonProps): JSX.Element {
  // Apply spacing styles
  const spacingStyles = {
    ...(top && { marginTop: spacing[top] }),
    ...(bottom && { marginBottom: spacing[bottom] }),
  };

  return (
    <ButtonStyled
      block={block}
      css={{ ...spacingStyles, ...css }}
      disabled={disabled || loading}
      loading={loading}
      size={size}
      variant={variant}
      {...props}>
      {loading ? "Loading..." : children}
    </ButtonStyled>
  );
}
