/* eslint-disable no-alert */
import { JSX, useState } from 'react';

import { Stack, Card, Text, Select, Button, Badge } from '../../src/index';

export function SelectDemo(): JSX.Element {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTech, setSelectedTech] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');

  const countries = [
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Germany', value: 'de' },
    { label: 'France', value: 'fr' },
    { label: 'Japan', value: 'jp' },
    { label: 'Australia', value: 'au' }
  ];

  const categories = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Books', value: 'books' },
    { label: 'Home & Garden', value: 'home' },
    { label: 'Sports', value: 'sports' },
    { label: 'Toys', value: 'toys' },
    { label: 'Automotive', value: 'automotive' }
  ];

  const technologies = [
    { label: 'React', value: 'react' },
    { label: 'Vue.js', value: 'vue' },
    { label: 'Angular', value: 'angular' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Next.js', value: 'nextjs' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'JavaScript', value: 'javascript' }
  ];

  const priorities = [
    { label: '🟢 Low Priority', value: 'low' },
    { label: '🟡 Medium Priority', value: 'medium' },
    { label: '🟠 High Priority', value: 'high' },
    { label: '🔴 Urgent', value: 'urgent' },
    { label: '💀 Critical', value: 'critical' }
  ];

  return (
    <Stack gap="large">
      {/* Basic Select */}
      <Stack gap="medium">
        <Text as="h4">Basic Select</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Stack gap="small">
              <Text as="p">Country</Text>
              <Stack align="center" direction="row" gap="medium">

              <Select
                options={countries}
                trigger={<Button >{selectedCountry ? countries.find(c => c.value === selectedCountry)?.label : "Choose a country"}</Button>}
                onSelection={(value) => setSelectedCountry(value)}
              />
              </Stack>
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Product Category</Text>
              <Select
                options={categories}
                trigger={<Button >{selectedCategory ? categories.find(c => c.value === selectedCategory)?.label : "Select category"}</Button>}
                onSelection={(value) => setSelectedCategory(value)}
              />
              <Text as="small" css={{ color: "$text" }}>Choose the most relevant category</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Select States */}
      <Stack gap="medium">
        <Text as="h4">Select States</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Stack gap="small">
              <Text as="label">Normal State</Text>
              <Select
                options={technologies}
                trigger={<Button >Normal select</Button>}
                onSelection={() => {}}
              />
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Disabled State</Text>
              <Select
                disabled
                options={technologies}
                trigger={<Button disabled >This select is disabled</Button>}
                onSelection={() => {}}
              />
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Error State</Text>
              <Select
                options={technologies}
                trigger={<Button >Select with error</Button>}
                onSelection={() => {}}
              />
              <Text as="small" css={{ color: 'red' }}>Please make a valid selection</Text>
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Loading State</Text>
              <Select
                loading
                options={technologies}
                trigger={<Button >Loading options...</Button>}
                onSelection={() => {}}
              />
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Select Variations */}
      <Stack gap="medium">
        <Text as="h4">Select Variations</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Stack gap="small">
              <Text as="label">Small Trigger</Text>
              <Select
                options={priorities}
                trigger={<Button size="small" variant="secondary">Small select</Button>}
                onSelection={() => {}}
              />
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Normal Trigger</Text>
              <Select
                options={priorities}
                trigger={<Button >Normal select</Button>}
                onSelection={() => {}}
              />
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Primary Trigger</Text>
              <Select
                options={priorities}
                trigger={<Button >Primary select</Button>}
                onSelection={() => {}}
              />
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Interactive Form Example */}
      <Stack gap="medium">
        <Text as="h4">Form Example</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="medium">
            <Text as="h5">Project Configuration</Text>
            
            <Stack gap="small">
              <Text as="label">Primary Technology</Text>
              <Select
                options={technologies}
                trigger={<Button >{selectedTech ? technologies.find(t => t.value === selectedTech)?.label : "Select technology"}</Button>}
                onSelection={(value) => setSelectedTech(value)}
              />
              <Text as="small" css={{ color: "$text" }}>Choose your main development framework</Text>
            </Stack>
            
            <Stack gap="small">
              <Text as="label">Project Priority</Text>
              <Select
                options={priorities}
                trigger={<Button >{selectedPriority ? priorities.find(p => p.value === selectedPriority)?.label : "Set priority level"}</Button>}
                onSelection={(value) => setSelectedPriority(value)}
              />
            </Stack>
            
            <Stack align="center" direction="row" gap="small">
              <Text as="small">Selected:</Text>
              {selectedTech && (
                <Badge>
                  Tech: {technologies.find(t => t.value === selectedTech)?.label}
                </Badge>
              )}
              {selectedPriority && (
                <Badge>
                  Priority: {priorities.find(p => p.value === selectedPriority)?.label}
                </Badge>
              )}
            </Stack>
            
            <Stack direction="row" gap="small">
              <Button 
                disabled={!selectedTech || !selectedPriority}
                
                onClick={() => {
                  alert(`Project configured!\nTech: ${selectedTech}\nPriority: ${selectedPriority}`);
                }}
              >
                Create Project
              </Button>
              <Button 
                
                onClick={() => {
                  setSelectedTech('');
                  setSelectedPriority('');
                }}
              >
                Reset
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Large Options List */}
      <Stack gap="medium">
        <Text as="h4">Many Options</Text>
        <Card padding="default" variant="bordered">
          <Stack gap="small">
            <Stack gap="small">
              <Text as="label">Many Options</Text>
              <Select
                options={[
                  { label: 'Option 1', value: 'option1' },
                  { label: 'Option 2', value: 'option2' },
                  { label: 'Option 3', value: 'option3' },
                  { label: 'Option 4', value: 'option4' },
                  { label: 'Option 5', value: 'option5' },
                  { label: 'Option 6', value: 'option6' },
                  { label: 'Option 7', value: 'option7' },
                  { label: 'Option 8', value: 'option8' },
                  { label: 'Option 9', value: 'option9' },
                  { label: 'Option 10', value: 'option10' },
                  { label: 'Option 11', value: 'option11' },
                  { label: 'Option 12', value: 'option12' }
                ]}
                trigger={<Button >Select from many options</Button>}
                onSelection={() => {}}
              />
              <Text as="small" css={{ color: "$text" }}>This select has many options to demonstrate scrolling</Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {/* Usage Tips */}
      <Stack gap="medium">
        <Text as="h4">Usage Guidelines</Text>
          <Card css={{ backgroundColor: "$hover" }} padding="default" variant="default">
          <Stack gap="small">
            <Text as="h6">Best Practices:</Text>
            <Text as="small">• Use clear, descriptive labels for options</Text>
            <Text as="small">• Provide helpful placeholder text</Text>
            <Text as="small">• Include helper text for complex selections</Text>
            <Text as="small">• Consider loading states for dynamic options</Text>
            <Text as="small">• Group related options when possible</Text>
            <Text as="small">• Use appropriate sizes for the context</Text>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}