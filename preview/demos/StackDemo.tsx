import { type JSX, type ReactNode } from 'react';

import { CSSObject } from '@/styles/types';

import { Stack, Text, styled } from '../../src/index';

// Styled demo box for visual examples
const DemoCard = styled("div", {
  alignItems: 'center',
  backgroundColor: "$hover",
  border: `1px solid $border`,
  borderRadius: "$small",
  display: 'flex',
  justifyContent: 'center',
  minHeight: '40px',
  padding: "$small",
});

// Demo box for visual examples
function DemoBox({ children, style = {} }: { children: ReactNode; style?: CSSObject }): JSX.Element {
  return (
    <DemoCard css={style}>
      {children}
    </DemoCard>
  );
}

export function StackDemo(): JSX.Element {
  return (
    <Stack gap="large">
      {/* Basic Column Demo */}
      <Stack gap="medium">
        <Text as="h4">Column Direction (Default)</Text>
        <Stack css={{ maxWidth: '400px' }} gap="medium">
          <DemoBox>Item 1</DemoBox>
          <DemoBox>Item 2</DemoBox>
          <DemoBox>Item 3</DemoBox>
        </Stack>
      </Stack>

      {/* Basic Row Demo */}
      <Stack gap="medium">
        <Text as="h4">Row Direction</Text>
        <Stack css={{ maxWidth: '400px' }} direction="row" gap="medium">
          <DemoBox>A</DemoBox>
          <DemoBox>B</DemoBox>
          <DemoBox>C</DemoBox>
        </Stack>
      </Stack>

      {/* Alignment Examples */}
      <Stack gap="medium">
        <Text as="h4">Alignment Examples</Text>
        <Stack gap="small">
          <Stack align="center" direction="row" gap="small">
            <Text as="small" css={{ fontWeight: 'bold', minWidth: '100px' }}>Center:</Text>
            <Stack align="center" css={{ 
              backgroundColor: '#f8f9fa', 
              borderRadius: '4px', 
              padding: '8px' 
            }} direction="row" gap="small">
              <DemoBox>Small</DemoBox>
              <DemoBox style={{ minHeight: '60px' }}>Tall</DemoBox>
              <DemoBox>Small</DemoBox>
            </Stack>
          </Stack>
          
          <Stack direction="row" gap="small" justify="between">
            <Text as="small" css={{ fontWeight: 'bold', minWidth: '100px' }}>Between:</Text>
            <Stack css={{ 
              backgroundColor: '#f8f9fa', 
              borderRadius: '4px', 
              padding: '8px', 
              width: '300px' 
            }} direction="row" gap="small" justify="between">
              <DemoBox>A</DemoBox>
              <DemoBox>B</DemoBox>
              <DemoBox>C</DemoBox>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* Spacing Examples */}
      <Stack gap="medium">
        <Text as="h4">Gap Spacing</Text>
        <Stack gap="medium">
          <Stack gap="smaller">
            <Text as="small" css={{ fontWeight: 'bold' }}>Gap: smaller</Text>
            <Stack direction="row" gap="smaller">
              <DemoBox>A</DemoBox>
              <DemoBox>B</DemoBox>
              <DemoBox>C</DemoBox>
            </Stack>
          </Stack>
          
          <Stack gap="medium">
            <Text as="small" css={{ fontWeight: 'bold' }}>Gap: medium</Text>
            <Stack direction="row" gap="medium">
              <DemoBox>A</DemoBox>
              <DemoBox>B</DemoBox>
              <DemoBox>C</DemoBox>
            </Stack>
          </Stack>
          
          <Stack gap="large">
            <Text as="small" css={{ fontWeight: 'bold' }}>Gap: large</Text>
            <Stack direction="row" gap="large">
              <DemoBox>A</DemoBox>
              <DemoBox>B</DemoBox>
              <DemoBox>C</DemoBox>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}