/* eslint-disable no-alert */
import { useState, type JSX } from 'react';

import { Stack, Card, Text, Badge, Button } from '../../src/index';

export function BadgeDemo(): JSX.Element {
  const [notificationCount, setNotificationCount] = useState(3);
  const [isOnline, setIsOnline] = useState(true);

  return (
    <Stack gap="large">
      {/* Badge Style */}
      <Stack gap="medium">
        <Text as="h4">Badge Style</Text>
        <Card padding="default" variant="bordered">
          <Stack align="center" direction="row" gap="medium" wrap>
            <Badge>Default</Badge>
            <Badge>Always Solid</Badge>
          </Stack>
        </Card>
      </Stack>

      {/* Badge Sizes */}
      <Stack gap="medium">
        <Text as="h4">Badge Sizes</Text>
        <Card padding="default" variant="bordered">
          <Stack align="center" direction="row" gap="medium" wrap>
            <Badge >Small</Badge>
            <Badge>Normal</Badge>
          </Stack>
        </Card>
      </Stack>

      {/* Interactive Badges */}
      <Stack gap="medium">
        <Text as="h4">Interactive Badges</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">Badges can be clickable and respond to user interaction:</Text>
            <Stack direction="row" gap="medium" wrap>
              <Badge 
                clickable 
                onClick={() => alert('Badge clicked!')}
              >
                Clickable
              </Badge>
              <Badge 
                clickable 
                onClick={() => setNotificationCount(prev => prev + 1)}
              >
                Add Notification
              </Badge>
              <Badge 
                clickable
                onClick={() => setNotificationCount(0)}
              >
                Clear All
              </Badge>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Dynamic Content */}
      <Stack gap="medium">
        <Text as="h4">Dynamic Content</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Stack align="center" direction="row" gap="medium">
              <Text as="span">Notifications:</Text>
              <Badge>
                {notificationCount}
              </Badge>
            </Stack>
            
            <Stack align="center" direction="row" gap="medium">
              <Text as="span">Status:</Text>
              <Badge 
                clickable
        
                onClick={() => setIsOnline(!isOnline)}
              >
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Usage with Other Components */}
      <Stack gap="medium">
        <Text as="h4">Usage with Other Components</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Stack align="center" direction="row" gap="small">
              <Button >
                Messages
              </Button>
              <Badge  >
                {notificationCount}
              </Badge>
            </Stack>
            
            <Stack align="center" direction="row" gap="small">
              <Text as="h5">User Profile</Text>
              <Badge >Verified</Badge>
            </Stack>
            
            <Stack direction="row" gap="small" wrap>
                          <Badge >React</Badge>
            <Badge >TypeScript</Badge>
            <Badge >UI Library</Badge>
            <Badge >Design System</Badge>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Custom Styling */}
      <Stack gap="medium">
        <Text as="h4">Custom Styling</Text>
        <Card padding="default" variant="bordered">
          <Stack direction="row" gap="medium" wrap>
            <Badge 
              css={{ 
                borderRadius: '2px',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }} 
              
            >
              SQUARED
            </Badge>
            <Badge 
              css={{ 
                backgroundColor: '#007bff',
                border: 'none',
                color: 'white'
              }} 
      
            >
              Gradient
            </Badge>
            <Badge 
              css={{ 
                fontSize: '0.75rem',
                padding: '2px 8px'
              }} 
              
            >
              Custom Size
            </Badge>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}