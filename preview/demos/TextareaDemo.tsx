import { type JSX, useState } from 'react';

import { Stack, Card, Text, Textarea, Button, Badge } from '../../src/index';

export function TextareaDemo(): JSX.Element {
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [description, setDescription] = useState('');

  const maxLength = 500;
  const remainingChars = maxLength - message.length;

  return (
    <Stack gap="large">
      {/* Basic Textarea */}
      <Stack gap="medium">
        <Text as="h4">Basic Textarea</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Stack gap="small">
              <Text as="label">Message</Text>
              <Textarea
                placeholder="Enter your message here..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Feedback</Text>
              <Textarea
                placeholder="Tell us what you think"
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <Text as="small" css={{ color: "$text" }}>Your feedback helps us improve</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Textarea with Character Limit */}
      <Stack gap="medium">
        <Text as="h4">Character Limit Example</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Stack gap="small">
              <Text as="label">Project Description</Text>
              <Textarea
                placeholder="Describe your project (max 500 characters)"
                rows={4}
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= maxLength) {
                    setDescription(e.target.value);
                  }
                }}
              />
              {remainingChars < 0 && <Text as="small" css={{ color: 'red' }}>Message is too long</Text>}
            </Stack>
            
            <Stack align="center" direction="row" justify="between">
              <Text as="small" css={{ opacity: 0.7 }}>
                Character count
              </Text>
              <Badge 
              >
                {description.length}/{maxLength}
              </Badge>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Textarea States */}
      <Stack gap="medium">
        <Text as="h4">Textarea States</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Stack gap="small">
              <Text as="label">Normal State</Text>
              <Textarea
                placeholder="Normal textarea"
                rows={3}
                value=""
                onChange={() => {}}
              />
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Disabled State</Text>
              <Textarea
                disabled
                placeholder="This textarea is disabled"
                rows={3}
                value="This content cannot be edited"
                onChange={() => {}}
              />
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Error State</Text>
              <Textarea
                placeholder="Textarea with error"
                rows={3}
                value="This content has an error"
                onChange={() => {}}
              />
              <Text as="small" css={{ color: 'red' }}>This field is required</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Textarea Sizes */}
      <Stack gap="medium">
        <Text as="h4">Textarea Sizes</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Stack gap="small">
              <Text as="label">Small Size</Text>
              <Textarea
                placeholder="Small textarea"
                rows={2}
                value=""
                onChange={() => {}}
              />
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Normal Size</Text>
              <Textarea
                placeholder="Normal textarea (default)"
                rows={3}
                value=""
                onChange={() => {}}
              />
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Large Size</Text>
              <Textarea
                placeholder="Large textarea"
                rows={4}
                value=""
                onChange={() => {}}
              />
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Auto-resize Example */}
      <Stack gap="medium">
        <Text as="h4">Auto-resizing Textarea</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Stack gap="small">
              <Text as="label">Auto-resize</Text>
              <Textarea
                css={{
                  maxHeight: '200px',
                  minHeight: '80px'
                }}
                placeholder="This textarea will grow as you type more content. Try adding multiple lines to see the effect..."
                resize="vertical"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </Stack>
            <Text as="small" css={{ opacity: 0.7 }}>
              CSS resize property set to "vertical" with min/max height constraints
            </Text>
          </Stack>
        </Card>
      </Stack>

      {/* Form Example */}
      <Stack gap="medium">
        <Text as="h4">Complete Form Example</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Text as="p">Share your thoughts:</Text>
            
            <Stack gap="small">
              <Text as="label">Your Review</Text>
              <Textarea
                placeholder="What did you think about this demo?"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Text as="small" css={{ color: "$text" }}>{remainingChars} characters remaining</Text>
            </Stack>
            
            <Stack direction="row" gap="small">
              <Button 
                disabled={message.trim().length === 0}
                variant="primary"
                onClick={() => {
                  // eslint-disable-next-line no-alert
                  alert(`Review submitted: "${message}"`);
                  setMessage('');
                }}
              >
                Submit Review
              </Button>
              <Button 
                variant="secondary"
                onClick={() => setMessage('')}
              >
                Clear
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}