/* eslint-disable no-alert */
import { JSX, useState } from 'react';

import { 
  Stack, Card, Text, Modal, Button, Badge, Input, Textarea
} from '../../src/index';

export function ModalDemo(): JSX.Element {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    title: ''
  });

  return (
    <Stack gap="large">
      {/* Basic Modal */}
      <Stack gap="medium">
        <Text as="h4">Basic Modal</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">Simple modal with basic content:</Text>
            
            <Modal
              title="Welcome!"
              trigger={<Button >Open Basic Modal</Button>}
            >
              <Stack gap="medium">
                <Text as="p">
                  This is a basic modal with a header, content area, and close functionality.
                  You can close it by clicking the X button, pressing Escape, or clicking outside.
                </Text>
                <Badge >Example Badge</Badge>
                <Stack direction="row" gap="small" justify="end">
                  <Text as="small" css={{ opacity: 0.7 }}>
                    Modal automatically handles close behavior
                  </Text>
                </Stack>
              </Stack>
            </Modal>
          </Stack>
        </Card>
      </Stack>

      {/* Form Modal */}
      <Stack gap="medium">
        <Text as="h4">Form Modal</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">Modal containing a form with validation:</Text>
            
            <Modal
              title="Create New Project"
              trigger={<Button >Create New Item</Button>}
            >
              {(close) => (
                <Stack gap="large">
                  <Stack gap="medium">
                    <Stack gap="small">
                      <Text as="label">Project Title</Text>
                      <Input
                        placeholder="Enter project title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </Stack>
                    
                    <Stack gap="small">
                      <Text as="label">Description</Text>
                      <Textarea
                        placeholder="Describe your project..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </Stack>
                    
                    <Stack gap="small">
                      <Text as="label">Category</Text>
                      <Input
                        placeholder="e.g., Web Development"
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      />
                    </Stack>
                  </Stack>
                  
                  <Stack direction="row" gap="small" justify="end">
                    <Button onClick={close}>
                      Cancel
                    </Button>
                    <Button 
                      disabled={!formData.title.trim()}
                      
                      onClick={() => {
                        alert(`Project created: ${formData.title}`);
                        setFormData({ category: '', description: '', title: '' });
                        close();
                      }}
                    >
                      Create Project
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Modal>
          </Stack>
        </Card>
      </Stack>

      {/* Confirmation Modal */}
      <Stack gap="medium">
        <Text as="h4">Confirmation Modal</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">Modal for confirming destructive actions:</Text>
            
            <Modal
              title="⚠️ Confirm Deletion"
              trigger={<Button >Delete Account</Button>}
            >
              {(close) => (
                <Stack gap="large">
                  <Stack gap="medium">
                    <Text as="p">
                      Are you sure you want to delete your account? This action cannot be undone.
                      All your data will be permanently removed.
                    </Text>
                    <Card css={{ 
                      backgroundColor: "$hover", 
                      border: `1px solid $border` 
                    }} padding="small" variant="default">
                      <Text as="small" css={{ color: "$text" }}>
                        <strong>Warning:</strong> This is a permanent action that cannot be reversed.
                      </Text>
                    </Card>
                  </Stack>
                  
                  <Stack direction="row" gap="small" justify="end">
                    <Button onClick={close}>
                      Cancel
                    </Button>
                    <Button 
                      
                      onClick={() => {
                        alert('Account would be deleted (demo)');
                        close();
                      }}
                    >
                      Delete Account
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Modal>
          </Stack>
        </Card>
      </Stack>

      {/* Dashboard Modal */}
      <Stack gap="medium">
        <Text as="h4">Dashboard Modal</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">Modal with dashboard content (default size):</Text>
            
            <Modal
              title="Project Dashboard"
              trigger={<Button >Open Project Dashboard</Button>}
            >
              {(close) => (
                <Stack gap="large">
                  <Stack direction="row" gap="medium" wrap>
                    <Card css={{ flex: 1, minWidth: '200px' }} padding="default" variant="default">
                      <Text as="h6">Total Projects</Text>
                      <Text as="h3" css={{ color: "$text", margin: '8px 0' }}>24</Text>
                      <Badge>+3 this month</Badge>
                    </Card>
                    
                    <Card css={{ flex: 1, minWidth: '200px' }} padding="default" variant="default">
                      <Text as="h6">Active Tasks</Text>
                      <Text as="h3" css={{ color: 'blue', margin: '8px 0' }}>156</Text>
                      <Badge>12 overdue</Badge>
                    </Card>
                    
                    <Card css={{ flex: 1, minWidth: '200px' }} padding="default" variant="default">
                      <Text as="h6">Team Members</Text>
                      <Text as="h3" css={{ color: 'green', margin: '8px 0' }}>8</Text>
                      <Badge>2 online</Badge>
                    </Card>
                  </Stack>
                  
                  <Stack gap="medium">
                    <Text as="h5">Recent Activity</Text>
                    <Stack gap="small">
                      <Card padding="small" variant="default">
                        <Stack align="center" direction="row" justify="between">
                          <Text as="span">New project "Website Redesign" created</Text>
                          <Text as="small" css={{ opacity: 0.7 }}>2 hours ago</Text>
                        </Stack>
                      </Card>
                      <Card padding="small" variant="default">
                        <Stack align="center" direction="row" justify="between">
                          <Text as="span">Task "Update documentation" completed</Text>
                          <Text as="small" css={{ opacity: 0.7 }}>4 hours ago</Text>
                        </Stack>
                      </Card>
                      <Card padding="small" variant="default">
                        <Stack align="center" direction="row" justify="between">
                          <Text as="span">Team member John joined the project</Text>
                          <Text as="small" css={{ opacity: 0.7 }}>1 day ago</Text>
                        </Stack>
                      </Card>
                    </Stack>
                  </Stack>
                  
                  <Stack css={{ width: '100%' }} direction="row" gap="small" justify="between">
                    <Button >
                      Export Data
                    </Button>
                    <Stack direction="row" gap="small">
                      <Button onClick={close}>
                        Close
                      </Button>
                      <Button >
                        View Full Dashboard
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              )}
            </Modal>
          </Stack>
        </Card>
      </Stack>

      {/* Custom Styled Modal */}
      <Stack gap="medium">
        <Text as="h4">Custom Styling</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">Modal with custom styling and backdrop:</Text>
            
            <Modal
              css={{
                borderRadius: '12px',
                overflow: 'hidden'
              }}
              title="✨ Custom Styled Modal"
              trigger={
                <Button 
                  css={{
                    backgroundColor: "$brand",
                    border: 'none'
                  }}
                  
                >
                  Open Custom Modal
                </Button>
              }
            >
              {(close) => (
                <div style={{
                  backgroundColor: "$brand",
                  color: 'white',
                  margin: '-24px',
                  marginTop: '-16px',
                  padding: '40px',
                  textAlign: 'center'
                }}>
                  <Text as="p" css={{ color: 'white', margin: '0 0 24px 0', opacity: 0.9 }}>
                    This modal demonstrates custom styling with gradients, 
                    custom backdrop, and creative design elements.
                  </Text>
                  <Stack direction="row" gap="small" justify="center">
                    <Button onClick={close}>
                      Close
                    </Button>
                    <Button 
                      css={{ backgroundColor: "$fill", color: "$text" }}
                      
                    >
                      Learn More
                    </Button>
                  </Stack>
                </div>
              )}
            </Modal>
          </Stack>
        </Card>
      </Stack>

      {/* Small Modal */}
      <Stack gap="medium">
        <Text as="h4">Small Modal</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Text as="p">Compact modal for simple confirmations:</Text>
            
            <Modal
              small
              title="Quick Confirmation"
              trigger={<Button>Quick Action</Button>}
            >
              {(close) => (
                <Stack gap="medium">
                  <Text as="p">
                    Are you sure you want to perform this action?
                  </Text>
                  <Stack direction="row" gap="small" justify="end">
                    <Button size="small" onClick={close}>
                      Cancel
                    </Button>
                    <Button size="small" onClick={close}>
                      Confirm
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Modal>
          </Stack>
        </Card>
      </Stack>

      {/* Usage Guidelines */}
      <Stack gap="medium">
        <Text as="h4">Usage Guidelines</Text>
        <Card css={{ backgroundColor: "$hover" }} padding="default" variant="default">
          <Stack gap="small">
            <Text as="h6">Best Practices:</Text>
            <Text as="small">• Use modals sparingly for important actions or content</Text>
            <Text as="small">• Pass a clear, descriptive title</Text>
            <Text as="small">• Use trigger prop for the element that opens the modal</Text>
            <Text as="small">• Content can be a function that receives close callback</Text>
            <Text as="small">• Use small prop for compact modals (280px vs 600px max-width)</Text>
            <Text as="small">• Modal always closes on Escape key and backdrop clicks</Text>
            <Text as="small">• Modal handles all state management internally</Text>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}