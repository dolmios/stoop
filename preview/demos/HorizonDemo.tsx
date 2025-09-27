import type { JSX } from 'react';
import { useState } from 'react';

import { Stack, Card, Text, Horizon, useEventListener } from '../../src/index';

export function HorizonDemo(): JSX.Element {
  const [scrollY, setScrollY] = useState(0);

  // Track scroll position for dynamic height effect
  useEventListener('scroll', () => {
    setScrollY(window.scrollY);
  });

  // Calculate dynamic height based on scroll
  // Default 1000px, shrinks to 100px on scroll down
  const dynamicHeight = Math.max(100, 1000 - scrollY * 0.5);

  return (
    <Stack gap="large">
      {/* Fixed Height Example */}
      <Stack gap="medium">
        <Text as="h4">Fixed Height (500px)</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Text as="p">A horizon effect with fixed 500px height:</Text>
            <Horizon height="500px" />
          </Stack>
        </Card>
      </Stack>

      {/* Dynamic Scroll-Based Height */}
      <Stack gap="medium">
        <Text as="h4">Dynamic Scroll-Based Height</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Text as="p">
              This horizon responds to scroll! Default 1000px, shrinks to 100px as you scroll down.
              Current height: {Math.round(dynamicHeight)}px
            </Text>
            <Horizon height={dynamicHeight} />
          </Stack>
        </Card>
      </Stack>

      {/* Basic Usage */}
      <Stack gap="medium">
        <Text as="h4">Basic Usage</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Text as="p">Simple horizon effects with different heights:</Text>
            <Stack gap="small">
              <Text as="span">Height: 100px</Text>
              <Horizon height="100px" />
            </Stack>
            <Stack gap="small">
              <Text as="span">Height: 150px</Text>
              <Horizon height="150px" />
            </Stack>
            <Stack gap="small">
              <Text as="span">Height: 200px</Text>
              <Horizon height="200px" />
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Numeric Heights */}
      <Stack gap="medium">
        <Text as="h4">Numeric Heights</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Text as="p">Heights can be passed as numbers (converted to pixels):</Text>
            <Stack gap="small">
              <Text as="span">Height: 80 (80px)</Text>
              <Horizon height={80} />
            </Stack>
            <Stack gap="small">
              <Text as="span">Height: 120 (120px)</Text>
              <Horizon height={120} />
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Different Units */}
      <Stack gap="medium">
        <Text as="h4">Different Units</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Text as="p">Supports various CSS units:</Text>
            <Stack gap="small">
              <Text as="span">Height: 10vh (viewport height)</Text>
              <Horizon height="10vh" />
            </Stack>
            <Stack gap="small">
              <Text as="span">Height: 8rem</Text>
              <Horizon height="8rem" />
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Custom Styling */}
      <Stack gap="medium">
        <Text as="h4">Custom Styling</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Text as="p">The horizon effect can be customized with CSS:</Text>
            <Stack gap="small">
              <Text as="span">With border radius</Text>
              <Horizon 
                height="120px" 
                css={{ 
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 0, 0, 0.1)'
                }} 
              />
            </Stack>
            <Stack gap="small">
              <Text as="span">With opacity effect</Text>
              <Horizon 
                height="100px" 
                css={{ 
                  opacity: 0.7,
                  borderRadius: '4px'
                }} 
              />
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* As a Divider */}
      <Stack gap="medium">
        <Text as="h4">As a Visual Divider</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Text as="p">Perfect as a visual separator between sections:</Text>
            
            <Text as="h5">Section One</Text>
            <Text as="p">Some content here...</Text>
            
            <Horizon height="60px" />
            
            <Text as="h5">Section Two</Text>
            <Text as="p">More content here...</Text>
            
            <Horizon height="60px" />
            
            <Text as="h5">Section Three</Text>
            <Text as="p">Final content here...</Text>
          </Stack>
        </Card>
      </Stack>

      {/* SVG Precision */}
      <Stack gap="medium">
        <Text as="h4">SVG Precision</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Text as="p">Now using SVG for mathematically precise line positioning:</Text>
            <Stack gap="small">
              <Text as="span">Mathematical perspective progression</Text>
              <Horizon height="80px" />
            </Stack>
            <Stack gap="small">
              <Text as="span">Exponential line spacing creates perfect horizon effect</Text>
              <Horizon height="120px" />
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Performance Notes */}
      <Stack gap="medium">
        <Text as="h4">Performance Features</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">The Horizon component is optimized for performance:</Text>
            <Text as="span">✓ SVG-based precise line positioning</Text>
            <Text as="span">✓ Memoized line calculations</Text>
            <Text as="span">✓ Hardware-accelerated SVG rendering</Text>
            <Text as="span">✓ No layout reflows or repaints on render</Text>
            <Text as="span">✓ Mathematical precision for perspective effect</Text>
            <Text as="span">✓ Minimal bundle size impact</Text>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}
