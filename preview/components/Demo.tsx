/**
 * Comprehensive demo component showcasing all Stoop features
 * This serves as a visual test suite demonstrating:
 * - Complex values with tokens
 * - Multiple tokens in single values
 * - Keyframes with tokens
 * - calc() expressions
 * - Negative values
 * - Media queries with tokens
 * - Nested selectors with tokens
 * - Shorthand vs explicit tokens
 * - All theme scales
 * - Theme switching
 * - Polymorphic components
 * - Utilities
 */

import type { JSX } from "react";

import { css, keyframes, useTheme } from "../stoop.theme";
import { Badge } from "./Badge";
import { Box } from "./Box";
import { Button } from "./Button";
import { Card } from "./Card";
import { Stack } from "./Stack";
import { Text } from "./Text";

// Keyframes with theme tokens
const fadeInUp = keyframes({
  from: {
    opacity: 0,
    transform: "translateY($medium)", // Shorthand token - property-aware resolution
  },
  to: {
    opacity: 1,
    transform: "translateY(0)",
  },
});

const pulse = keyframes({
  "0%, 100%": {
    boxShadow: "$subtle", // Shorthand token - resolves to shadows scale via property-aware resolution
    transform: "scale(1)",
  },
  "50%": {
    boxShadow: "$medium", // Shorthand token - resolves to shadows scale
    transform: "scale(1.05)",
  },
});

const rotate = keyframes({
  from: {
    transform: "rotate(0deg)",
  },
  to: {
    transform: "rotate(360deg)",
  },
});

// CSS classes demonstrating various features
const complexBorderClass = css({
  border: "2px solid $primary", // Complex value: token mixed with literals
  borderRadius: "$radii.default",
  padding: "$space.small $space.medium", // Multiple tokens in single value
});

const calcClass = css({
  marginLeft: "calc(-$small)", // Negative calc() with shorthand token
  width: "calc(100% - $large)", // calc() with shorthand token
});

const negativeClass = css({
  "&::before": {
    backgroundColor: "$accent",
    borderRadius: "$small",
    color: "$background",
    content: '"Original Position"',
    fontSize: "$small",
    fontWeight: "$semibold",
    left: "$medium",
    padding: "2px 6px",
    position: "absolute",
    top: "$small", // Positive offset to show negative margin effect
    whiteSpace: "nowrap",
    zIndex: "$zIndices.tooltip",
  },
  marginLeft: "-$medium",
  marginTop: "-$small", // Negative value with shorthand token
  position: "relative",
});

const multipleShadowsClass = css({
  backgroundColor: "$background",
  border: "1px solid $border",
  boxShadow: "0 0 0 2px $primary, 0 4px 8px $subtle, 0 8px 16px rgba(0, 0, 0, 0.1)", // Multiple tokens in complex value (shorthand)
});

const nestedSelectorsClass = css({
  "&:active": {
    transform: "translateY(0)",
  },
  "&:focus": {
    outline: "2px solid $primary", // Complex value with shorthand token
    outlineOffset: "$small", // Shorthand token
  },
  "&:hover": {
    backgroundColor: "$hover", // Shorthand token
    border: "1px solid $border", // Complex value with shorthand token
    padding: "$large", // Shorthand token
    transform: "translateY(-2px)",
  },
  padding: "$medium", // Shorthand token
  transition: "$default",
});

const mediaQueryClass = css({
  desktop: {
    fontSize: "$large", // Shorthand token in media query
    padding: "$large", // Shorthand token in media query
  },
  fontSize: "$small", // Shorthand token
  mobile: {
    fontSize: "$medium", // Shorthand token in media query
    padding: "$medium", // Shorthand token in media query
  },
  padding: "$small", // Shorthand token
});

const animationClass = css({
  animation: `${fadeInUp} 0.5s ease-out`,
});

const pulseClass = css({
  animation: `${pulse} 2s ease-in-out infinite`,
});

const rotateClass = css({
  animation: `${rotate} 2s linear infinite`,
});

// Demonstrating all theme scales
const allScalesClass = css({
  backgroundColor: "$colors.background",
  border: "1px solid $colors.border",
  borderBottomRightRadius: "$radii.large",
  borderColor: "$colors.border",
  // Radii
  borderRadius: "$radii.default",
  borderTopLeftRadius: "$radii.small",
  // Shadows
  boxShadow: "$shadows.subtle",
  // Colors
  color: "$colors.text",
  // Fonts
  fontFamily: "$fonts.body",
  fontSize: "$fontSizes.medium",
  fontWeight: "$fontWeights.bold",
  gap: "$space.small",
  letterSpacing: "$letterSpacings.default",
  margin: "$space.medium",
  // Opacities
  opacity: "$opacities.hover",
  // Space
  padding: "$space.small $space.medium $space.large $space.xlarge",
  // Transitions
  transition: "$transitions.default",
  // Z-index
  zIndex: "$zIndices.tooltip",
});

const gradientClass = css({
  background: "linear-gradient(135deg, $primary 0%, $accent 100%)",
  borderRadius: "$default",
  color: "$background",
  padding: "$large",
});

const headerClass = css({
  backgroundColor: "$background",
  borderBottom: "1px solid $border",
  boxShadow: "$subtle",
  padding: "$medium $large",
  position: "sticky",
  top: 0,
  zIndex: "$zIndices.modal",
});

const codeBlockClass = css({
  backgroundColor: "$hover",
  border: "1px solid $border",
  borderRadius: "$default",
  fontFamily: "$mono",
  fontSize: "$small",
  overflowX: "auto",
  padding: "$medium",
});

const colorSwatchClass = css({
  alignItems: "center",
  border: "1px solid $border",
  borderRadius: "$default",
  color: "$background",
  display: "flex",
  fontSize: "$small",
  fontWeight: "$semibold",
  height: "60px",
  justifyContent: "center",
  width: "100%",
});

export function Demo(): JSX.Element {
  if (!useTheme) {
    throw new Error("useTheme is not available. Ensure themes config is provided to createStoop.");
  }

  const { themeName, toggleTheme } = useTheme();

  return (
    <Box>
      {/* Header */}
      <Box className={headerClass}>
        <Stack align="center" direction="row" justify="between">
          <Stack gap="small">
            <Text style={{ fontSize: "var(--fontSizes-h1)", margin: 0 }} variant="h1">
              Stoop
            </Text>
            <Text size="small" style={{ color: "var(--colors-textSecondary)", margin: 0 }}>
              CSS-in-JS with type inference and theme tokens
            </Text>
          </Stack>
          <Button variant="secondary" onClick={toggleTheme}>
            {themeName === "light" ? "🌙" : "☀️"} {themeName === "light" ? "Dark" : "Light"} Mode
          </Button>
        </Stack>
      </Box>

      {/* Main Content */}
      <Stack gap="xlarge" style={{ margin: "0 auto", maxWidth: "1200px", padding: "var(--space-xlarge)" }}>
        {/* Hero Section */}
        <Card variant="elevated">
          <Stack gap="medium">
            <Text variant="h2">Feature Showcase</Text>
            <Text>
              Stoop is a CSS-in-JS library that provides type-safe styling with theme tokens, variants, and full TypeScript inference.
              This preview demonstrates all visual aspects and capabilities.
            </Text>
            <Stack direction="row" gap="small" wrap>
              <Badge variant="primary">Type-Safe</Badge>
              <Badge variant="secondary">Theme Tokens</Badge>
              <Badge variant="outline">Variants</Badge>
              <Badge variant="secondary">CSS Variables</Badge>
            </Stack>
          </Stack>
        </Card>

        {/* Theme Colors */}
        <Card>
          <Stack gap="medium">
            <Text variant="h2">Theme Colors</Text>
            <Text size="small">All colors are theme tokens that update instantly when switching themes</Text>
            <Stack direction="row" gap="small" wrap>
              <Box style={{ flex: "1", minWidth: "150px" }}>
                <Box className={colorSwatchClass} style={{ backgroundColor: "var(--colors-primary)" }}>
                  Primary
                </Box>
                <Text size="small" style={{ marginTop: "var(--space-small)", textAlign: "center" }}>
                  $primary
                </Text>
              </Box>
              <Box style={{ flex: "1", minWidth: "150px" }}>
                <Box className={colorSwatchClass} style={{ backgroundColor: "var(--colors-accent)" }}>
                  Accent
                </Box>
                <Text size="small" style={{ marginTop: "var(--space-small)", textAlign: "center" }}>
                  $accent
                </Text>
              </Box>
              <Box style={{ flex: "1", minWidth: "150px" }}>
                <Box className={colorSwatchClass} style={{ backgroundColor: "var(--colors-background)", color: "var(--colors-text)" }}>
                  Background
                </Box>
                <Text size="small" style={{ marginTop: "var(--space-small)", textAlign: "center" }}>
                  $background
                </Text>
              </Box>
              <Box style={{ flex: "1", minWidth: "150px" }}>
                <Box className={colorSwatchClass} style={{ backgroundColor: "var(--colors-hover)", color: "var(--colors-text)" }}>
                  Hover
                </Box>
                <Text size="small" style={{ marginTop: "var(--space-small)", textAlign: "center" }}>
                  $hover
                </Text>
              </Box>
            </Stack>
          </Stack>
        </Card>

        {/* Gradient Example */}
        <Card>
          <Stack gap="medium">
            <Text variant="h2">Gradients with Tokens</Text>
            <Text size="small">Theme tokens work in gradient values</Text>
            <Box className={gradientClass}>
              <Text style={{ color: "var(--colors-background)", fontWeight: "var(--fontWeights-bold)" }}>
                background: linear-gradient(135deg, $primary 0%, $accent 100%)
              </Text>
            </Box>
          </Stack>
        </Card>

        {/* Complex Values */}
        <Card>
          <Stack gap="medium">
            <Text variant="h2">Complex Values</Text>
            <Text size="small">Tokens mixed with literal CSS values</Text>
            <Box className={complexBorderClass}>
              <Text>border: "2px solid $primary"</Text>
              <Text>padding: "$small $medium"</Text>
            </Box>
            <Box className={codeBlockClass}>
              <pre style={{ margin: 0 }}>
                {`border: "2px solid $primary"
padding: "$small $medium"`}
              </pre>
            </Box>
          </Stack>
        </Card>

        {/* calc() Expressions */}
        <Card>
          <Stack gap="medium">
            <Text variant="h2">calc() Expressions</Text>
            <Text size="small">Tokens work inside calc() expressions. Notice the width is narrower and the box is shifted left!</Text>
            <Box style={{ backgroundColor: "var(--colors-hover)", border: "2px dashed var(--colors-border)", borderRadius: "var(--radii-default)", padding: "var(--space-medium)", position: "relative" }}>
              <Box style={{ backgroundColor: "var(--colors-accent)", borderRadius: "var(--radii-small)", color: "var(--colors-background)", fontSize: "var(--fontSizes-small)", fontWeight: "var(--fontWeights-semibold)", padding: "2px 6px", position: "absolute", right: "var(--space-small)", top: "var(--space-small)" }}>
                Full Width
              </Box>
              <Box className={calcClass} style={{ backgroundColor: "var(--colors-background)", border: "2px solid var(--colors-primary)", borderRadius: "var(--radii-default)", padding: "var(--space-large)" }}>
                <Text style={{ fontWeight: "var(--fontWeights-bold)" }}>⬅️ Narrower & Shifted Left</Text>
                <Text>width: calc(100% - $large)</Text>
                <Text>marginLeft: calc(-$small)</Text>
                <Text size="small" style={{ color: "var(--colors-textSecondary)", marginTop: "var(--space-small)" }}>
                  This box is narrower than the container and shifted left with negative margin
                </Text>
              </Box>
            </Box>
          </Stack>
        </Card>

        {/* Negative Values */}
        <Card>
          <Stack gap="medium">
            <Text variant="h2">Negative Values</Text>
            <Text size="small">Tokens work with negative values. The blue badge shows the original position - notice how the box is shifted up and left!</Text>
            <Box style={{ backgroundColor: "var(--colors-hover)", border: "2px dashed var(--colors-border)", borderRadius: "var(--radii-default)", padding: "var(--space-xlarge)", position: "relative" }}>
              <Box className={negativeClass} style={{ backgroundColor: "var(--colors-background)", border: "2px solid var(--colors-primary)", borderRadius: "var(--radii-default)", padding: "var(--space-large)" }}>
                <Text style={{ fontWeight: "var(--fontWeights-bold)" }}>⬅️ This box has negative margins!</Text>
                <Text>marginTop: "-$small"</Text>
                <Text>marginLeft: "-$medium"</Text>
                <Text size="small" style={{ color: "var(--colors-textSecondary)", marginTop: "var(--space-small)" }}>
                  Notice how it's shifted up and left from the dashed container
                </Text>
              </Box>
            </Box>
          </Stack>
        </Card>

        {/* Multiple Tokens */}
        <Card>
          <Stack gap="medium">
            <Text variant="h2">Multiple Tokens</Text>
            <Text size="small">Multiple tokens in single CSS property value (box-shadow with multiple shadows)</Text>
            <Box className={multipleShadowsClass} style={{ borderRadius: "var(--radii-default)", margin: "var(--space-medium) 0", padding: "var(--space-xlarge)" }}>
              <Text style={{ fontSize: "var(--fontSizes-large)", fontWeight: "var(--fontWeights-bold)" }}>
                ✨ Multiple Box Shadows ✨
              </Text>
              <Text style={{ marginTop: "var(--space-medium)" }}>
                boxShadow: "0 0 0 2px $primary, 0 4px 8px $subtle"
              </Text>
              <Text size="small" style={{ color: "var(--colors-textSecondary)", marginTop: "var(--space-small)" }}>
                <strong>First shadow:</strong> 2px border using $primary color (visible outline)
                <br />
                <strong>Second shadow:</strong> Drop shadow using $subtle token
                <br />
                <strong>Third shadow:</strong> Additional depth shadow
              </Text>
            </Box>
            <Text size="small" style={{ color: "var(--colors-textSecondary)", fontStyle: "italic" }}>
              💡 Tip: Look at the edges - you should see a colored border and layered shadows!
            </Text>
          </Stack>
        </Card>

        {/* Nested Selectors */}
        <Card>
          <Stack gap="medium">
            <Text variant="h2">Nested Selectors</Text>
            <Text size="small">Tokens work in nested selectors. <strong>Hover</strong>, <strong>focus</strong>, or <strong>click</strong> the box below to see the effects!</Text>
            <Box className={nestedSelectorsClass} style={{ backgroundColor: "var(--colors-background)", border: "2px solid var(--colors-border)", borderRadius: "var(--radii-default)", cursor: "pointer", padding: "var(--space-large)" }}>
              <Text style={{ fontWeight: "var(--fontWeights-semibold)" }}>🎯 Interactive Box</Text>
              <Text style={{ marginTop: "var(--space-small)" }}>
                Hover: Background changes, border appears, box lifts up
              </Text>
              <Text>Focus: Primary colored outline appears</Text>
              <Text>Active: Box returns to original position</Text>
              <Text size="small" style={{ color: "var(--colors-textSecondary)", fontStyle: "italic", marginTop: "var(--space-medium)" }}>
                Try it now! 👆
              </Text>
            </Box>
          </Stack>
        </Card>

        {/* Media Queries */}
        <Card>
          <Stack gap="medium">
            <Text variant="h2">Media Queries</Text>
            <Text size="small">Tokens work in media query breakpoints. Resize your window to see the changes.</Text>
            <Box className={mediaQueryClass} style={{ backgroundColor: "var(--colors-hover)", borderRadius: "var(--radii-default)" }}>
              <Text>Responsive padding and fontSize</Text>
              <Text size="small">Mobile: $small → Desktop: $large</Text>
            </Box>
          </Stack>
        </Card>

        {/* Animations */}
        <Card>
          <Stack gap="medium">
            <Text variant="h2">Keyframes with Tokens</Text>
            <Text size="small">Animations can use theme tokens. Watch the boxes below animate!</Text>
            <Stack direction="row" gap="medium" wrap>
              <Box className={animationClass} style={{ backgroundColor: "var(--colors-accent)", borderRadius: "var(--radii-default)", color: "var(--colors-background)", flex: 1, minWidth: "200px", padding: "var(--space-large)", textAlign: "center" }}>
                <Text style={{ fontSize: "var(--fontSizes-large)", fontWeight: "var(--fontWeights-bold)" }}>⬆️</Text>
                <Text style={{ fontWeight: "var(--fontWeights-semibold)" }}>fadeInUp</Text>
                <Text size="small">Uses $medium token</Text>
              </Box>
              <Box className={pulseClass} style={{ backgroundColor: "var(--colors-primary)", borderRadius: "var(--radii-default)", color: "var(--colors-background)", flex: 1, minWidth: "200px", padding: "var(--space-large)", textAlign: "center" }}>
                <Text style={{ fontSize: "var(--fontSizes-large)", fontWeight: "var(--fontWeights-bold)" }}>💓</Text>
                <Text style={{ fontWeight: "var(--fontWeights-semibold)" }}>pulse</Text>
                <Text size="small">Uses $shadows tokens</Text>
              </Box>
              <Box className={rotateClass} style={{ backgroundColor: "var(--colors-accent)", borderRadius: "var(--radii-default)", color: "var(--colors-background)", flex: 1, minWidth: "200px", padding: "var(--space-large)", textAlign: "center" }}>
                <Text style={{ fontSize: "var(--fontSizes-large)", fontWeight: "var(--fontWeights-bold)" }}>🌀</Text>
                <Text style={{ fontWeight: "var(--fontWeights-semibold)" }}>rotate</Text>
                <Text size="small">Continuous rotation</Text>
              </Box>
            </Stack>
            <Text size="small" style={{ color: "var(--colors-textSecondary)", fontStyle: "italic", textAlign: "center" }}>
              💡 Refresh the page to see fadeInUp animation again
            </Text>
          </Stack>
        </Card>

        {/* All Theme Scales */}
        <Card>
          <Stack gap="medium">
            <Text variant="h2">All Theme Scales</Text>
            <Text size="small">Demonstrating all 12 approved theme scales</Text>
            <Box className={allScalesClass} style={{ borderRadius: "var(--radii-default)" }}>
              <Text style={{ fontWeight: "var(--fontWeights-bold)" }}>This box uses tokens from all theme scales:</Text>
              <Stack gap="small" style={{ marginTop: "var(--space-medium)" }}>
                <Text size="small">• colors (color, backgroundColor, borderColor)</Text>
                <Text size="small">• space (padding, margin, gap)</Text>
                <Text size="small">• radii (borderRadius variants)</Text>
                <Text size="small">• fonts (fontFamily)</Text>
                <Text size="small">• fontSizes (fontSize)</Text>
                <Text size="small">• fontWeights (fontWeight)</Text>
                <Text size="small">• letterSpacings (letterSpacing)</Text>
                <Text size="small">• shadows (boxShadow)</Text>
                <Text size="small">• transitions (transition)</Text>
                <Text size="small">• opacities (opacity)</Text>
                <Text size="small">• zIndices (zIndex)</Text>
                <Text size="small">• media (responsive breakpoints)</Text>
              </Stack>
            </Box>
          </Stack>
        </Card>

        {/* Shorthand vs Explicit */}
        <Card>
          <Stack gap="medium">
            <Text variant="h2">Shorthand vs Explicit Tokens</Text>
            <Text size="small">Both shorthand and explicit tokens work. Shorthand uses property-aware resolution.</Text>
            <Stack gap="small">
              <Box style={{ backgroundColor: "var(--colors-hover)", borderRadius: "var(--radii-default)", padding: "var(--space-medium)" }}>
                <Text style={{ fontFamily: "var(--fonts-mono)", fontSize: "var(--fontSizes-small)" }}>
                  Shorthand: padding: "$small" (property-aware resolution)
                </Text>
              </Box>
              <Box style={{ backgroundColor: "var(--colors-hover)", borderRadius: "var(--radii-default)", padding: "var(--space-medium)" }}>
                <Text style={{ fontFamily: "var(--fonts-mono)", fontSize: "var(--fontSizes-small)" }}>
                  Explicit: padding: "$space.small" (explicit scale)
                </Text>
              </Box>
            </Stack>
          </Stack>
        </Card>

        {/* Styled Components */}
        <Card>
          <Stack gap="medium">
            <Text variant="h2">Styled Components</Text>
            <Text size="small">Components using theme tokens with variants</Text>
            <Stack gap="large">
              <Stack gap="small">
                <Text style={{ fontSize: "var(--fontSizes-medium)", fontWeight: "var(--fontWeights-semibold)" }} variant="h2">
                  Buttons
                </Text>
                <Stack direction="row" gap="small" wrap>
                  <Button size="small" variant="primary">Primary Small</Button>
                  <Button size="medium" variant="primary">Primary Medium</Button>
                  <Button size="large" variant="primary">Primary Large</Button>
                </Stack>
                <Stack direction="row" gap="small" wrap>
                  <Button size="small" variant="secondary">Secondary</Button>
                  <Button size="medium" variant="minimal">Minimal</Button>
                </Stack>
              </Stack>
              <Stack gap="small">
                <Text style={{ fontSize: "var(--fontSizes-medium)", fontWeight: "var(--fontWeights-semibold)" }} variant="h2">
                  Badges
                </Text>
                <Stack direction="row" gap="small" wrap>
                  <Badge variant="primary">Primary Badge</Badge>
                  <Badge variant="secondary">Secondary Badge</Badge>
                  <Badge variant="outline">Outline Badge</Badge>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Card>

        {/* Footer */}
        <Card variant="outlined">
          <Stack align="center" gap="small">
            <Text style={{ fontSize: "var(--fontSizes-medium)", fontWeight: "var(--fontWeights-semibold)" }} variant="h2">
              Stoop Preview
            </Text>
            <Text size="small" style={{ color: "var(--colors-textSecondary)", textAlign: "center" }}>
              This preview demonstrates all visual aspects and capabilities of Stoop.
              <br />
              Toggle between light and dark themes to see instant theme switching via CSS variables.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
