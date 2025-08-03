/* eslint-disable no-alert */
import { useState, type JSX } from 'react';

import { Stack, Card, Text, Button } from '../../src/index';

export function ButtonDemo(): JSX.Element {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleLoadingDemo = (buttonId: string): void => {
    setLoadingStates(prev => ({ ...prev, [buttonId]: true }));
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [buttonId]: false }));
    }, 2000);
  };

  return (
    <Stack gap="large">
      {/* Button Variants */}
      <Stack gap="medium">
        <Text as="h4">Button Variants</Text>
        <Card padding="default" variant="bordered">
          <Stack direction="row" gap="medium" wrap>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="minimal">Minimal</Button>
          </Stack>
        </Card>
      </Stack>

      {/* Button Sizes */}
      <Stack gap="medium">
        <Text as="h4">Button Sizes</Text>
        <Card padding="default" variant="bordered">
          <Stack align="center" direction="row" gap="medium" wrap>
            <Button size="small" variant="primary">Small</Button>
          </Stack>
        </Card>
      </Stack>

      {/* Button States */}
      <Stack gap="medium">
        <Text as="h4">Button States</Text>
        <Card padding="default" variant="bordered">
          <Stack direction="row" gap="medium" wrap>
            <Button variant="primary">Normal</Button>
            <Button disabled variant="primary">Disabled</Button>
            <Button 
              loading={loadingStates.demo1} 
              variant="primary"
              onClick={() => handleLoadingDemo('demo1')}
            >
              {loadingStates.demo1 ? 'Loading...' : 'Click for Loading'}
            </Button>
          </Stack>
        </Card>
      </Stack>

      {/* Polymorphic Buttons */}
      <Stack gap="medium">
        <Text as="h4">Polymorphic Rendering</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">Buttons can render as different HTML elements:</Text>
            <Stack direction="row" gap="medium" wrap>
              <Button variant="primary">Button Element</Button>
              <Button variant="secondary">Link Element</Button>
              <Button variant="minimal">Div Element</Button>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Interactive Examples */}
      <Stack gap="medium">
        <Text as="h4">Interactive Examples</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Stack direction="row" gap="small" wrap>
              <Button 
                loading={loadingStates.save} 
                variant="primary"
                onClick={() => handleLoadingDemo('save')}
              >
                Save Changes
              </Button>
              <Button variant="secondary">Cancel</Button>
            </Stack>
            
            <Stack direction="row" gap="small" wrap>
              <Button 
                loading={loadingStates.upload} 
                size="small"
                variant="minimal"
                onClick={() => handleLoadingDemo('upload')}
              >
                Upload File
              </Button>
              <Button 
                size="small" 
                variant="primary"
                onClick={() => confirm('Are you sure you want to delete this item?')}
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Custom Styling */}
      <Stack gap="medium">
        <Text as="h4">Custom Styling</Text>
        <Card padding="default" variant="bordered">
          <Stack direction="row" gap="medium" wrap>
            <Button 
              css={{ 
                borderRadius: '20px',
                minWidth: '120px'
              }} 
              variant="primary"
            >
              Rounded
            </Button>
            <Button 
              css={{ 
                backgroundColor: '#007bff',
                border: 'none',
                color: 'white'
              }} 
              variant="secondary"
            >
              Gradient
            </Button>
            <Button 
              css={{ 
                fontWeight: 'bold',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }} 
              variant="minimal"
            >
              Styled
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}