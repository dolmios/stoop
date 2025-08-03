import { type JSX } from 'react';

import { Stack, Card, Text } from '../../src/index';

export function TextDemo(): JSX.Element {
  return (
    <Stack gap="large">
      {/* Heading Elements */}
      <Stack gap="medium">
        <Text as="h4">Heading Elements</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="h1">Heading 1 - Main Page Title</Text>
            <Text as="h2">Heading 2 - Section Title</Text>
            <Text as="h3">Heading 3 - Subsection Title</Text>
            <Text as="h4">Heading 4 - Component Title</Text>
            <Text as="h5">Heading 5 - Card Title</Text>
            <Text as="h6">Heading 6 - Small Title</Text>
          </Stack>
        </Card>
      </Stack>

      {/* Body Text */}
      <Stack gap="medium">
        <Text as="h4">Body Text</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">
              This is a paragraph of body text. It demonstrates the default styling for readable content.
              The text should be comfortable to read with proper line height and font size.
            </Text>
            <Text as="span">This is span text, inheriting from parent context.</Text>
            <Text as="small">This is small text for secondary information.</Text>
            <Text as="strong">This is strong text for emphasis.</Text>
          </Stack>
        </Card>
      </Stack>

      {/* Custom Styling */}
      <Stack gap="medium">
        <Text as="h4">Custom Styling with CSS Props</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p" css={{ color: "$text", fontWeight: 'bold' }}>
              Brand colored text with custom styling
            </Text>
            <Text as="p" css={{ fontSize: '1.25rem', lineHeight: '1.6' }}>
              Larger text with increased line height for better readability
            </Text>
            <Text as="p" css={{ fontStyle: 'italic', opacity: 0.7 }}>
              Muted italic text for supplementary information
            </Text>
          </Stack>
        </Card>
      </Stack>

      {/* Semantic Usage */}
      <Stack gap="medium">
        <Text as="h4">Semantic HTML Elements</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="div">
              <Text as="strong">Note:</Text> The Text component can render as any HTML element
              while maintaining consistent typography styling.
            </Text>
            <Text as="blockquote" css={{ 
              borderLeft: `3px solid $brand`, 
              fontStyle: 'italic',
              margin: '16px 0',
              paddingLeft: '16px'
            }}>
              "This is a blockquote demonstrating how Text can be used with semantic HTML elements
              while preserving the design system's typography rules."
            </Text>
            <Text as="code" css={{ 
              backgroundColor: "$hover", 
              borderRadius: '2px',
              fontFamily: 'monospace',
              padding: '2px 4px'
            }}>
              const example = "code text"
            </Text>
          </Stack>
        </Card>
      </Stack>

      {/* Responsive Typography */}
      <Stack gap="medium">
        <Text as="h4">Responsive Typography</Text>
        <Card padding="default" variant="bordered">
          <Text as="p" css={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>
            This text scales responsively using CSS clamp() for optimal readability across devices.
            Resize your browser window to see the effect.
          </Text>
        </Card>
      </Stack>
    </Stack>
  );
}