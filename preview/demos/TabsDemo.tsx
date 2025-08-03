import { JSX } from 'react';

import { Stack, Card, Text, Tabs, Button, Badge, Input } from '../../src/index';

export function TabsDemo(): JSX.Element {
  const basicTabs = [
    { content: (
      <Stack gap="medium">
        <Text as="h5">Welcome to the Overview</Text>
        <Text as="p">
          This is the overview tab where you can see a summary of all the important information.
          Tabs are perfect for organizing related content into separate views.
        </Text>
        <Button >Get Started</Button>
      </Stack>
    ), id: 'overview', label: 'Overview'},
    { content: (
      <Stack gap="medium">
        <Text as="h5">Detailed Information</Text>
        <Text as="p">
          Here you can find more detailed information about the topic. This demonstrates
          how different content can be organized using the tabs component.
        </Text>
        <Stack direction="row" gap="small">
          <Badge >Feature 1</Badge>
          <Badge >Feature 2</Badge>
          <Badge >Feature 3</Badge>
        </Stack>
      </Stack>
    ), id: 'details', label: 'Details'},
    { content: (
      <Stack gap="medium">
        <Text as="h5">Configuration Settings</Text>
        <Text as="p">
          Manage your preferences and configuration options here.
        </Text>
        <Stack gap="small">
          <Stack gap="small">
            <Text as="label">Display Name</Text>
            <Input
              placeholder="Enter your name"
              type="text"
              value=""
              onChange={() => {}}
            />
          </Stack>
          <Stack gap="small">
            <Text as="label">Email</Text>
            <Input
              placeholder="your.email@example.com"
              type="email"
              value=""
              onChange={() => {}}
            />
          </Stack>
        </Stack>
        <Stack direction="row" gap="small">
          <Button variant="primary">Save</Button>
          <Button variant="secondary">Cancel</Button>
        </Stack>
      </Stack>
    ), id: 'settings', label: 'Settings'}
  ];

  const documentationTabs = [
    { content: (
      <Stack gap="medium">
        <Text as="h5">How to Install</Text>
        <Text as="p">Install the Stoop UI library in your project:</Text>
        <Card css={{ 
          backgroundColor: "$background", 
          fontFamily: 'monospace',
          fontSize: '0.875rem'
        }} padding="small" variant="default">
          npm install @stoop/ui
        </Card>
        <Text as="p">Then import the components you need:</Text>
        <Card css={{ 
          backgroundColor: "$background", 
          fontFamily: 'monospace',
          fontSize: '0.875rem'
        }} padding="small" variant="default">
          {`import { Button, Card, Text } from '@stoop/ui';`}
        </Card>
      </Stack>
    ), id: 'installation', label: 'Installation'},
    { content: (
      <Stack gap="medium">
        <Text as="h5">Basic Usage</Text>
        <Text as="p">Here's how to use the Tabs component:</Text>
        <Card css={{ 
          backgroundColor: "$background", 
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          whiteSpace: 'pre'
        }} padding="small" variant="default">
{`<Tabs
  items={[
    { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
    { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> }
  ]}
  defaultActiveTab="tab1"
/>`}
        </Card>
      </Stack>
    ), id: 'usage', label: 'Usage'},
    { content: (
      <Stack gap="medium">
        <Text as="h5">More Examples</Text>
        <Text as="p">
          The Tabs component is highly customizable and can be used in various scenarios:
        </Text>
        <Stack gap="small">
          <Text as="p">• Navigation between different sections</Text>
          <Text as="p">• Settings and configuration panels</Text>
          <Text as="p">• Documentation organization</Text>
          <Text as="p">• Data visualization dashboards</Text>
          <Text as="p">• Multi-step forms</Text>
        </Stack>
        <Badge >Try switching between these tabs!</Badge>
      </Stack>
    ), id: 'examples', label: 'Examples'}
  ];

  return (
    <Stack gap="large">
      {/* Basic Tabs */}
      <Stack gap="medium">
        <Text as="h4">Basic Tabs</Text>
        <Card padding="default" variant="bordered">
          <Tabs 
            defaultActive={0}
            items={basicTabs}
          />
        </Card>
      </Stack>

      {/* Documentation Style Tabs */}
      <Stack gap="medium">
        <Text as="h4">Documentation Style</Text>
        <Card padding="default" variant="bordered">
          <Tabs 
            defaultActive={0}
            items={documentationTabs}
          />
        </Card>
      </Stack>

      {/* Tabs with Custom Styling */}
      <Stack gap="medium">
        <Text as="h4">Custom Styled Tabs</Text>
        <Card padding="default" variant="bordered">
          <Tabs 
            css={{
              '& [role="tablist"]': {
                backgroundColor: "$hover",
                borderRadius: '4px',
                padding: '4px'
              }
            }}
            defaultActive={0}
            items={[
              { 
                content: (
                  <Stack gap="medium">
                    <Text as="h5">Analytics Dashboard</Text>
                    <Stack direction="row" gap="medium" wrap>
                      <Card css={{ flex: 1, minWidth: '150px' }} padding="default" variant="default">
                        <Text as="h6">Total Users</Text>
                            <Text as="h3" css={{ color: "$text", margin: 0 }}>1,247</Text>
                      </Card>
                      <Card css={{ flex: 1, minWidth: '150px' }} padding="default" variant="default">
                        <Text as="h6">Revenue</Text>
                        <Text as="h3" css={{ color: 'green', margin: 0 }}>$12,847</Text>
                      </Card>
                      <Card css={{ flex: 1, minWidth: '150px' }} padding="default" variant="default">
                        <Text as="h6">Growth</Text>
                        <Text as="h3" css={{ color: 'blue', margin: 0 }}>+23%</Text>
                      </Card>
                    </Stack>
                  </Stack>
                ), 
                id: 'dashboard', 
                label: 'Dashboard'
              },
              { 
                content: (
                  <Stack gap="medium">
                    <Text as="h5">Generated Reports</Text>
                    <Text as="p">Here you would see a list of generated reports and analytics.</Text>
                    <Stack gap="small">
                      <Card padding="small" variant="default">
                        <Stack align="center" direction="row" justify="between">
                          <Text as="span">Monthly Revenue Report</Text>
                          <Badge>Ready</Badge>
                        </Stack>
                      </Card>
                      <Card padding="small" variant="default">
                        <Stack align="center" direction="row" justify="between">
                          <Text as="span">User Engagement Analysis</Text>
                          <Badge>Processing</Badge>
                        </Stack>
                      </Card>
                    </Stack>
                  </Stack>
                ), 
                id: 'reports', 
                label: 'Reports'
              },
              { 
                content: (
                  <Stack gap="medium">
                    <Text as="h5">Advanced Settings</Text>
                    <Text as="p">Configure advanced options and preferences.</Text>
                    <Stack gap="small">
                      <Card padding="small" variant="default">
                        <Stack align="center" direction="row" justify="between">
                          <Text as="span">Email Notifications</Text>
                          <Button size="small" variant="minimal">Configure</Button>
                        </Stack>
                      </Card>
                      <Card padding="small" variant="default">
                        <Stack align="center" direction="row" justify="between">
                          <Text as="span">Privacy Settings</Text>
                          <Button size="small" variant="minimal">Manage</Button>
                        </Stack>
                      </Card>
                    </Stack>
                  </Stack>
                ), 
                id: 'settings-advanced', 
                label: 'Settings'
              }
            ]}
          />
        </Card>
      </Stack>
    </Stack>
  );
}