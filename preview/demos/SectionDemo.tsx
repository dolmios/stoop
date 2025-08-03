import { type JSX } from 'react';

import { Stack, Section, Card, Text, colors } from '../../src/index';

export function SectionDemo(): JSX.Element {
  return (
    <Stack gap="large">
      <Text as="h4">Section Component - Page Layout Wrapper</Text>
      
      <div style={{ 
                  border: `1px dashed ${colors.border}`, 
        minHeight: '200px', 
        padding: '8px',
        position: 'relative'
      }}>
        <Text as="small" css={{ 
          backgroundColor: 'white', 
          borderRadius: '2px', 
          left: '12px', 
          opacity: 0.7,
          padding: '2px 4px',
          position: 'absolute',
          top: '12px'
        }}>
          Browser Window
        </Text>
        
        <Section css={{ backgroundColor: colors.hover }}>
          <Stack gap="medium">
            <Text as="h5">Content inside Section</Text>
            <Text as="p">
              The Section component acts as a page-level wrapper that controls max-width and provides
              consistent responsive padding. It uses the Stack component internally for layout.
            </Text>
            
            <Stack css={{ '@media (max-width: 768px)': { flexDirection: 'column' } }} direction="row" gap="medium">
              <Card css={{ flex: 1 }} padding="small" variant="bordered">
                <Text as="h6">Card 1</Text>
                <Text as="p">Content automatically respects the section's max-width constraints.</Text>
              </Card>
              
              <Card css={{ flex: 1 }} padding="small" variant="bordered">
                <Text as="h6">Card 2</Text>
                <Text as="p">Responsive padding adjusts based on screen size.</Text>
              </Card>
            </Stack>
          </Stack>
        </Section>
      </div>
      
      <Text as="small" css={{ opacity: 0.7 }}>
        ✨ Section automatically centers content and provides consistent max-width across your app
      </Text>
    </Stack>
  );
}