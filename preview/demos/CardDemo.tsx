import { useState, type JSX } from 'react';

import { Stack, Card, Text, Button, Badge } from '../../src/index';

export function CardDemo(): JSX.Element {
  const [clickCount, setClickCount] = useState(0);

  return (
    <Stack gap="large">
      {/* Card Variants */}
      <Stack gap="medium">
        <Text as="h4">Card Variants</Text>
        <Stack css={{ '@media (max-width: 768px)': { flexDirection: 'column' } }} direction="row" gap="medium" wrap>
          <Card css={{ minWidth: '200px' }} padding="default" variant="default">
            <Text as="h5">Default Card</Text>
            <Text as="p">Basic card with no visible border.</Text>
          </Card>
          
          <Card css={{ minWidth: '200px' }} padding="default" variant="bordered">
            <Text as="h5">Bordered Card</Text>
            <Text as="p">Card with visible border.</Text>
          </Card>
          
          <Card css={{ minWidth: '200px' }} padding="default" variant="bordered">
            <Text as="h5">Elevated Card</Text>
            <Text as="p">Card with subtle shadow.</Text>
          </Card>
        </Stack>
      </Stack>

      {/* Interactive Card */}
      <Stack gap="medium">
        <Text as="h4">Interactive Card</Text>
        <Card 
          clickable 
          css={{ maxWidth: '300px' }} 
          padding="default"
          variant="bordered"
          onClick={() => setClickCount(prev => prev + 1)}
        >
          <Stack gap="small">
            <Text as="h5">Clickable Card</Text>
            <Text as="p">This card responds to clicks and has hover effects.</Text>
            <Badge>Clicked {clickCount} times</Badge>
          </Stack>
        </Card>
      </Stack>

      {/* Card with Header/Footer */}
      <Stack gap="medium">
        <Text as="h4">Card with Header & Footer</Text>
        <Card 
          css={{ maxWidth: '400px' }} 
          footer={
            <Stack direction="row" gap="small" justify="end">
              <Button size="small" variant="minimal">Cancel</Button>
              <Button size="small" variant="primary">Save</Button>
            </Stack>
          }
          header={
            <Stack align="center" direction="row" justify="between">
              <Text as="h5">Card Title</Text>
              <Badge>New</Badge>
            </Stack>
          }
          padding="minimal"
          variant="bordered"
        >
          <Text as="p">
            This card demonstrates header and footer sections with automatic spacing.
            The content area adjusts its padding when headers/footers are present.
          </Text>
        </Card>
      </Stack>

      {/* Minimal Card */}
      <Stack gap="medium">
        <Text as="h4">Minimal Styling</Text>
        <Card css={{ maxWidth: '300px' }} padding="small" variant="default">
          <Text as="p">
            Minimal card variant with very subtle styling, perfect for grouping content
            without drawing too much attention to the container itself.
          </Text>
        </Card>
      </Stack>
    </Stack>
  );
}