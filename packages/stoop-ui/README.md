# stoop-ui

UI component library built with stoop. A collection of accessible, customizable React components.

## Installation

```sh
npm install stoop-ui
# or
bun add stoop-ui
# or
yarn add stoop-ui
```

## Quick Start

```tsx
import { ThemeProvider, Button, Card, Stack } from "stoop-ui";

function App() {
  return (
    <ThemeProvider>
      <Stack gap="large">
        <Card>
          <Button variant="primary">Click me</Button>
        </Card>
      </Stack>
    </ThemeProvider>
  );
}
```

## Components

- **Badge** - Status indicators and labels
- **Button** - Interactive button component with variants
- **Card** - Container component for content
- **Code** - Code block display component
- **Input** - Form input component
- **Menu** - Dropdown menu component
- **Modal** - Dialog/modal component
- **Select** - Select dropdown component for forms
- **Spinner** - Loading spinner component
- **Stack** - Layout component for vertical/horizontal stacking
- **Table** - Table component with head, body, rows, cells
- **Tabs** - Tab navigation component
- **Text** - Typography component
- **Tooltip** - Tooltip component

## Hooks

- **useEventListener** - Hook for event listeners
- **useFloatingUI** - Hook for floating UI positioning
- **useModal** - Hook for modal state management
- **useOutsideClick** - Hook for detecting outside clicks

## Theme Provider

All components require the `ThemeProvider` wrapper:

```tsx
import { ThemeProvider } from "stoop-ui";

<ThemeProvider>{/* Your app */}</ThemeProvider>;
```

## SSR Support

For Next.js App Router:

```tsx
import { getCssText } from "stoop-ui";
import { useServerInsertedHTML } from "next/navigation";

export function Styles() {
  useServerInsertedHTML(() => {
    return <style dangerouslySetInnerHTML={{ __html: getCssText() }} />;
  });
  return null;
}
```

## Development

```sh
# Build
bun run build

# Test
bun run test
```

## License

MIT
