import { JSX, useState } from 'react';

import { Stack, Card, Text, Popover, Button, Badge, Input } from '../../src/index';

export function PopoverDemo(): JSX.Element {
  const [userFormData, setUserFormData] = useState({ email: '', name: '' });

  return (
    <Stack gap="large">
      {/* Basic Popover */}
      <Stack gap="medium">
        <Text as="h4">Basic Popover</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">Click the button to open a simple popover:</Text>
            <Stack align="center" direction="row" gap="medium">
              <Popover
                trigger={<Button variant="primary">Open Popover</Button>}
              >
                <Stack css={{ padding: '16px' }} gap="small">
                  <Text as="h6">Hello from Popover!</Text>
                  <Text as="p">
                    This is a basic popover with some content. It can contain any JSX elements.
                  </Text>
                  <Badge>Example Badge</Badge>
                </Stack>
              </Popover>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Interactive Popover with Form */}
      <Stack gap="medium">
        <Text as="h4">Interactive Popover</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">Popover with interactive form elements:</Text>
            <Stack align="center" direction="row" gap="medium">
              <Popover
                trigger={<Button >Edit Profile</Button>}
              >
                <Stack css={{ minWidth: '280px', padding: '20px' }} gap="medium">
                  <Text as="h6" css={{ margin: 0 }}>Quick Edit</Text>
                  
                  <Stack gap="small">
                    <Text as="label">Name</Text>
                    <Input
                      placeholder="Enter your name"
                      type="text"
                      value={userFormData.name}
                      onChange={(e) => setUserFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </Stack>
                  
                  <Stack gap="small">
                    <Text as="label">Email</Text>
                    <Input
                      placeholder="your.email@example.com"
                      type="email"
                      value={userFormData.email}
                      onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </Stack>
                  
                  <Stack direction="row" gap="small" justify="end">
                    <Button size="small" variant="secondary">
                      Cancel
                    </Button>
                    <Button size="small" variant="primary">
                      Save
                    </Button>
                  </Stack>
                </Stack>
              </Popover>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Tooltip Style Popover */}
      <Stack gap="medium">
        <Text as="h4">Tooltip Style</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">Hover or click to show tooltip-style popover:</Text>
            <Stack align="center" direction="row" gap="medium">
              <Popover
                trigger={
                  <Button 
                    css={{ 
                      textDecoration: 'underline',
                      textDecorationStyle: 'dotted'
                    }} 
                    variant="minimal"
                  >
                    Hover for info
                  </Button>
                }
              >
                <Stack css={{ maxWidth: '200px', padding: '12px' }} gap="small">
                  <Text as="small" css={{ fontWeight: 'bold' }}>Helpful Information</Text>
                  <Text as="small">
                    This is additional context or help text that appears when the user 
                    needs more information about this element.
                  </Text>
                </Stack>
              </Popover>
              
              <Text as="small" css={{ opacity: 0.7 }}>
                (Click to open tooltip)
              </Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Popover with Rich Content */}
      <Stack gap="medium">
        <Text as="h4">Rich Content</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">Popover containing various UI elements:</Text>
            <Stack align="center" direction="row" gap="medium">
              <Popover
                trigger={<Button variant="primary">View Details</Button>}
              >
                <Stack css={{ minWidth: '320px', padding: '20px' }} gap="medium">
                  <Stack align="center" direction="row" justify="between">
                    <Text as="h6" css={{ margin: 0 }}>User Profile</Text>
                    <Badge>Active</Badge>
                  </Stack>
                    
                  <Stack gap="small">
                    <Stack align="center" direction="row" gap="small">
                      <div style={{
                        alignItems: 'center',
                        backgroundColor: "$brand",
                        borderRadius: '50%',
                        color: 'white',
                        display: 'flex',
                        fontWeight: 'bold',
                        height: '40px',
                        justifyContent: 'center',
                        width: '40px'
                      }}>
                        JD
                      </div>
                      <Stack gap="smaller">
                        <Text as="span" css={{ fontWeight: 'bold' }}>John Doe</Text>
                        <Text as="small" css={{ opacity: 0.7 }}>Software Developer</Text>
                      </Stack>
                    </Stack>
                    
                    <Stack gap="smaller">
                      <Text as="small"><strong>Email:</strong> john@example.com</Text>
                      <Text as="small"><strong>Location:</strong> San Francisco, CA</Text>
                      <Text as="small"><strong>Joined:</strong> January 2023</Text>
                    </Stack>
                    
                    <Stack direction="row" gap="small" wrap>
                      <Badge>React</Badge>
                      <Badge>TypeScript</Badge>
                      <Badge>Node.js</Badge>
                    </Stack>
                  </Stack>
                    
                  <Stack direction="row" gap="small">
                    <Button css={{ flex: 1 }} size="small" variant="primary">
                      View Profile
                    </Button>
                    <Button css={{ flex: 1 }} size="small" variant="secondary">
                      Send Message
                    </Button>
                  </Stack>
                </Stack>
              </Popover>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Multiple Popovers */}
      <Stack gap="medium">
        <Text as="h4">Multiple Popovers</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">Multiple popovers demonstrating positioning:</Text>
            <Stack direction="row" gap="medium" wrap>
              <Popover
                trigger={<Button variant="secondary">Top</Button>}
              >
                <div style={{ padding: '12px' }}>
                  <Text as="small">This popover appears above the trigger</Text>
                </div>
              </Popover>
              
              <Popover
                trigger={<Button variant="secondary">Bottom</Button>}
              >
                <div style={{ padding: '12px' }}>
                  <Text as="small">This popover appears below the trigger</Text>
                </div>
              </Popover>
              
              <Popover
                trigger={<Button variant="secondary">Left</Button>}
              >
                <div style={{ padding: '12px' }}>
                  <Text as="small">This popover appears to the left</Text>
                </div>
              </Popover>
              
              <Popover
                trigger={<Button variant="secondary">Right</Button>}
              >
                <div style={{ padding: '12px' }}>
                  <Text as="small">This popover appears to the right</Text>
                </div>
              </Popover>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Custom Styled Popover */}
      <Stack gap="medium">
        <Text as="h4">Custom Styling</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">Popover with custom styling:</Text>
            <Popover
              trigger={
                <Button 
                  css={{
                    backgroundColor: "$brand",
                    border: 'none'
                  }}
                  variant="primary"
                >
                  Styled Popover
                </Button>
              }
            >
              <Stack css={{ 
                backgroundColor: "$brand",
                borderRadius: '8px',
                color: 'white',
                minWidth: '250px',
                padding: '20px'
              }} gap="medium">
                <Text as="h6" css={{ color: 'white', margin: 0 }}>✨ Custom Theme</Text>
                <Text as="p" css={{ color: 'white', margin: 0, opacity: 0.9 }}>
                  This popover has custom styling with gradients and colors that match your design needs.
                </Text>
                <Button 
                  css={{ alignSelf: 'flex-start' }} 
                  size="small"
                  
                >
                  Got it!
                </Button>
              </Stack>
            </Popover>
          </Stack>
        </Card>
      </Stack>

      {/* Usage Guidelines */}
      <Stack gap="medium">
        <Text as="h4">Usage Guidelines</Text>
        <Card css={{ backgroundColor: "$hover" }} padding="default" variant="default">
          <Stack gap="small">
            <Text as="h6">Best Practices:</Text>
            <Text as="small">• Use popovers for contextual information and actions</Text>
            <Text as="small">• Keep content concise and scannable</Text>
            <Text as="small">• Ensure popovers don't block important content</Text>
            <Text as="small">• Make interactive elements easily clickable</Text>
            <Text as="small">• Consider mobile experience and touch targets</Text>
            <Text as="small">• Use consistent spacing and typography</Text>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}