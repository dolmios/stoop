/* eslint-disable no-alert */
import { type ChangeEvent, useState, type JSX } from 'react';

import { Stack, Card, Text, Input, Button } from '../../src/index';

export function InputDemo(): JSX.Element {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    phone: '',
    website: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string) => (event: ChangeEvent<HTMLInputElement>): void => {
    const {value} = event.target;

    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <Stack gap="large">
      {/* Basic Inputs */}
      <Stack gap="medium">
        <Text as="h4">Basic Input Types</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Stack gap="small">
              <Text as="label">Name</Text>
              <Input
                placeholder="Enter your name"
                state={errors.name ? 'error' : 'default'}
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
              />
              {errors.name && <Text as="small" css={{ color: 'red' }}>{errors.name}</Text>}
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Email Address</Text>
              <Input
                placeholder="your.email@example.com"
                state={errors.email ? 'error' : 'default'}
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
              />
              {errors.email && <Text as="small" css={{ color: 'red' }}>{errors.email}</Text>}
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Password</Text>
              <Input
                placeholder="Enter password"
                state={errors.password ? 'error' : 'default'}
                type="password"
                value={formData.password}
                onChange={handleChange('password')}
              />
              <Text as="small">Must be at least 6 characters</Text>
              {errors.password && <Text as="small" css={{ color: 'red' }}>{errors.password}</Text>}
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Phone Number</Text>
              <Input
                placeholder="+1 (555) 123-4567"
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
              />
              <Text as="small">Optional</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Input States */}
      <Stack gap="medium">
        <Text as="h4">Input States</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Stack gap="small">
              <Text as="label">Normal State</Text>
              <Input
                placeholder="Normal input"
                type="text"
                value=""
                onChange={() => {}}
              />
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Disabled State</Text>
              <Input
                disabled
                placeholder="This input is disabled"
                type="text"
                value=""
                onChange={() => {}}
              />
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Error State</Text>
              <Input
                placeholder="Input with error"
                state="error"
                type="text"
                value="invalid-value"
                onChange={() => {}}
              />
              <Text as="small" css={{ color: 'red' }}>This field has an error</Text>
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Success State</Text>
              <Input
                css={{ '&:focus': { borderColor: 'green' } }}
                placeholder="Input with success"
                type="text"
                value="valid-value@example.com"
                onChange={() => {}}
              />
              <Text as="small" css={{ color: 'green' }}>This looks good!</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Different Input Types */}
      <Stack gap="medium">
        <Text as="h4">Different Input Types</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Stack gap="small">
              <Text as="label">Number Input</Text>
              <Input
                placeholder="Enter a number"
                type="number"
                value=""
                onChange={() => {}}
              />
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Date Input</Text>
              <Input
                type="date"
                value=""
                onChange={() => {}}
              />
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Search Input</Text>
              <Input
                placeholder="Search..."
                type="search"
                value=""
                onChange={() => {}}
              />
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Form Example */}
      <Stack gap="medium">
        <Text as="h4">Form Example</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Stack gap="small">
              <Text as="label">Website</Text>
              <Input
                placeholder="https://yourwebsite.com"
                type="url"
                value={formData.website}
                onChange={handleChange('website')}
              />
              <Text as="small">Include http:// or https://</Text>
            </Stack>
            
            <Stack direction="row" gap="small">
              <Button 
                variant="primary" 
                onClick={() => {
                  if (validateForm()) {
                    alert('Form is valid!');
                  }
                }}
              >
                Validate Form
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setFormData({
                    email: '',
                    name: '',
                    password: '',
                    phone: '',
                    website: ''
                  });
                  setErrors({});
                }}
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