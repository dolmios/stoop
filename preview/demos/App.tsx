import { useState, type JSX } from 'react';

import { 
  StoopProvider, Stack, Section, Text, Button,
  useTheme
} from '../../src/index';
import { BadgeDemo } from './BadgeDemo';
import { ButtonDemo } from './ButtonDemo';
import { CardDemo } from './CardDemo';
import { InputDemo } from './InputDemo';
import { MenuDemo } from './MenuDemo';
import { ModalDemo } from './ModalDemo';
import { PopoverDemo } from './PopoverDemo';
import { SectionDemo } from './SectionDemo';
import { SelectDemo } from './SelectDemo';
// Individual component demos
import { StackDemo } from './StackDemo';
import { TabsDemo } from './TabsDemo';
import { TextareaDemo } from './TextareaDemo';
import { TextDemo } from './TextDemo';

// Component registry
const components = [
  { category: 'Layout', component: StackDemo, id: 'stack', name: 'Stack' },
  { category: 'Layout', component: SectionDemo, id: 'section', name: 'Section' },
  { category: 'Layout', component: CardDemo, id: 'card', name: 'Card' },
  { category: 'Typography', component: TextDemo, id: 'text', name: 'Text' },
  { category: 'Interactive', component: ButtonDemo, id: 'button', name: 'Button' },
  { category: 'Interactive', component: BadgeDemo, id: 'badge', name: 'Badge' },
  { category: 'Forms', component: InputDemo, id: 'input', name: 'Input' },
  { category: 'Forms', component: TextareaDemo, id: 'textarea', name: 'Textarea' },
  { category: 'Advanced', component: TabsDemo, id: 'tabs', name: 'Tabs' },
  { category: 'Advanced', component: MenuDemo, id: 'menu', name: 'Menu' },
  { category: 'Advanced', component: SelectDemo, id: 'select', name: 'Select' },
  { category: 'Advanced', component: PopoverDemo, id: 'popover', name: 'Popover' },
  { category: 'Advanced', component: ModalDemo, id: 'modal', name: 'Modal' },
];

const categories = ['All', 'Layout', 'Typography', 'Interactive', 'Forms', 'Advanced'];

function AppContent(): JSX.Element {
  const [activeComponent, setActiveComponent] = useState('stack');
  const [activeCategory, setActiveCategory] = useState('All');
  const { themeName, toggleTheme } = useTheme();

  const filteredComponents = components.filter(comp => 
    activeCategory === 'All' || comp.category === activeCategory
  );

  const ActiveDemo = components.find(c => c.id === activeComponent)?.component || StackDemo;

  return (
    <Section>
      <Stack gap="large">
        {/* Header */}
        <Stack css={{ marginBottom: '2rem', textAlign: 'center' }} gap="medium">
          <Text as="h1" css={{ margin: 0 }}>🏗️ Stoop UI Library</Text>
          <Text as="p" css={{ margin: 0, opacity: 0.8 }}>
            A modern, framework-agnostic React UI library with sharp design language
          </Text>
          <Button 
            variant="secondary" 
            size="small"
            onClick={toggleTheme}
          >
            {themeName === 'light' ? '🌙' : '☀️'} {themeName === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </Stack>

          {/* Category Filter */}
          <Stack>
            <Stack gap="small">
              <Text as="h3" css={{ margin: 0 }}>Categories</Text>
              <Stack direction="row" gap="small" wrap>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? 'primary' : 'secondary'}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Stack>

          {/* Component Navigation */}
          <Stack>
            <Stack gap="small">
              <Text as="h3" css={{ margin: 0 }}>Components</Text>
              <Stack direction="row" gap="small" wrap>
                {filteredComponents.map(component => (
                  <Button
                    key={component.id}
                    size="small"
                    variant={activeComponent === component.id ? 'primary' : 'minimal'}
                    onClick={() => setActiveComponent(component.id)}
                  >
                    {component.name}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Stack>

          {/* Active Demo */}
          <Stack>
            <Stack gap="medium">
              <Text as="h2" css={{ margin: 0 }}>
                {components.find(c => c.id === activeComponent)?.name} Demo
              </Text>
              <ActiveDemo />
            </Stack>
          </Stack>
        </Stack>
      </Section>
    );
  }

export function App(): JSX.Element {
  return (
    <StoopProvider>
      <AppContent />  
    </StoopProvider>
  );
}