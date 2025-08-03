/* eslint-disable no-alert */
import { useState, type JSX } from 'react';

import { Stack, Card, Text, Menu, Button, Badge } from '../../src/index';

export function MenuDemo(): JSX.Element {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const basicMenuOptions = [
    { disabled: false, label: 'Edit', value: 'edit' },
    { disabled: false, label: 'Copy', value: 'copy' },
    { disabled: false, label: 'Delete', value: 'delete' },
    { disabled: true, label: 'Archive', value: 'archive' }
  ];

  const userMenuOptions = [
    { disabled: false, label: 'View Profile', value: 'profile' },
    { disabled: false, label: 'Settings', value: 'settings' },
    { disabled: false, label: 'Billing', value: 'billing' },
    { disabled: false, label: 'Help & Support', value: 'help' },
    { disabled: false, label: 'Sign Out', value: 'logout' }
  ];

  const contextMenuOptions = [
    { disabled: false, label: 'Open', value: 'open' },
    { disabled: false, label: 'Open in New Tab', value: 'open-new' },
    { disabled: false, label: 'Copy Link', value: 'copy-link' },
    { disabled: false, label: 'Add to Bookmarks', value: 'bookmark' },
    { disabled: false, label: 'Share', value: 'share' }
  ];

  const handleMenuSelect = (value: string, menuType: string): void => {
    setSelectedAction(`${menuType}: ${value}`);
  };

  return (
    <Stack gap="large">
      {/* Basic Menu */}
      <Stack gap="medium">
        <Text as="h4">Basic Menu</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">A simple menu with common actions:</Text>
            <Stack align="center" direction="row" gap="medium">
              <Menu
                options={basicMenuOptions}
                trigger={<Button variant="secondary">Actions Menu</Button>}
                onSelection={(value: string) => handleMenuSelect(value, 'Basic Menu')}
              />
              
              {selectedAction && (
                <Badge>
                  Last: {selectedAction}
                </Badge>
              )}
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* User Menu */}
      <Stack gap="medium">
        <Text as="h4">User Profile Menu</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">Common pattern for user account menus:</Text>
            <Stack align="center" direction="row" gap="medium">
              <Menu
                options={userMenuOptions}
                trigger={
                  <Button 
                    css={{ 
                      backgroundColor: "$brand",
                      borderRadius: '50%',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      height: '40px',
                      padding: '8px',
                      width: '40px'
                    }} 
                    variant="minimal"
                  >
                    JD
                  </Button>
                }
                onSelection={(value: string) => handleMenuSelect(value, 'User Menu')}
              />
              
              <Stack gap="smaller">
                <Text as="small" css={{ fontWeight: 'bold' }}>John Doe</Text>
                <Text as="small" css={{ opacity: 0.7 }}>john@example.com</Text>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Context Menu */}
      <Stack gap="medium">
        <Text as="h4">Context Menu</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">Right-click style menu (click the button to trigger):</Text>
            <Stack align="center" direction="row" gap="medium">
              <Menu
                options={contextMenuOptions}
                trigger={
                  <Button variant="secondary">
                    Right-click Menu
                  </Button>
                }
                onSelection={(value: string) => handleMenuSelect(value, 'Context Menu')}
              />
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Menu with Custom Styling */}
      <Stack gap="medium">
        <Text as="h4">Custom Styled Menu</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">Menu with custom trigger and styling:</Text>
            <Menu
              css={{
                '& [role="menuitem"]': {
                  fontSize: '0.9rem',
                  padding: '12px 16px'
                },
                minWidth: '200px'
              }}
              options={[
                { label: '📊 Dashboard', value: 'dashboard' },
                { label: '📈 Analytics', value: 'analytics' },
                { label: '📋 Reports', value: 'reports' },
                { label: '📤 Export Data', value: 'export' },
                { label: '⚙️ Admin Panel', value: 'admin' }
              ]}
              trigger={
                <Button 
                  css={{
                    backgroundColor: "$brand",
                    border: 'none'
                  }}
                  
                >
                  📱 App Menu
                </Button>
              }
              onSelection={(value: string) => handleMenuSelect(value, 'Navigation Menu')}
            />
          </Stack>
        </Card>
      </Stack>

      {/* Menu States Demo */}
      <Stack gap="medium">
        <Text as="h4">Menu Item States</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">Demonstration of different menu item states:</Text>
            <Menu
              options={[
                { label: 'Normal Item', value: 'normal' },
                { label: 'Disabled Item', value: 'disabled' },
                { label: '⚠️ Warning Action', value: 'warning' },
                { label: '🗑️ Dangerous Action', value: 'danger' }
              ]}
              trigger={<Button variant="secondary">States Demo</Button>}
              onSelection={(value: string) => {
                if (value === 'danger') {
                  if (confirm('Are you sure you want to perform this dangerous action?')) {
                    handleMenuSelect(value, 'States Menu');
                  }
                } else {
                  handleMenuSelect(value, 'States Menu');
                }
              }}
            />
          </Stack>
        </Card>
      </Stack>

      {/* Usage Tips */}
      <Stack gap="medium">
        <Text as="h4">Usage Tips</Text>
          <Card css={{ backgroundColor: "$hover" }} padding="default" variant="default">
          <Stack gap="small">
            <Text as="h6">Best Practices:</Text>
            <Text as="small">• Use clear, actionable labels for menu items</Text>
            <Text as="small">• Group related actions together</Text>
            <Text as="small">• Disable items that aren't currently available</Text>
            <Text as="small">• Consider keyboard navigation for accessibility</Text>
            <Text as="small">• Use icons sparingly to maintain clean appearance</Text>
            <Text as="small">• Provide visual feedback when actions are destructive</Text>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}