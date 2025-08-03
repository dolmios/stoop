# [stoop](https://github.com/dolmios/stoop)

> A lightweight, polymorphic React component library with intuitive design tokens and built-in theming system.

![Stoop Kid Steps Off](https://nomeatballs.files.wordpress.com/2012/08/stoop-kid-steps-off.png)

## Install

```sh
npm install stoop
# or
bun add stoop
```

## Usage

### Setup Provider

Wrap your app with the `StoopProvider`:

```tsx
import { StoopProvider } from "stoop";

function App() {
  return (
    <StoopProvider theme="light">
      {/* Your app content */}
    </StoopProvider>
  );
}
```

### Using Components

```tsx
import { Stack, Text, Button } from "stoop";

function MyComponent() {
  return (
    <Stack gap="medium">
      <Text as="h1">Welcome</Text>
      <Button>Click me</Button>
    </Stack>
  );
}
```

### Theme Switching

```tsx
import { useTheme, Button } from "stoop";

function ThemeToggle() {
  const { themeName, setTheme } = useTheme();
  
  return (
    <Button onClick={() => setTheme(themeName === 'light' ? 'dark' : 'light')}>
      Switch to {themeName === 'light' ? 'Dark' : 'Light'}
    </Button>
  );
}
```

## Development

For local development:

```sh
# Install dependencies
bun install

# Start development server
bun run dev

# Build the library
bun run build

# Lint and format
bun run lint
bun run prettier
```

## Contributing

Feel free to get in touch with feedback, advice or suggestions. See [Conventional Commits](https://gist.github.com/dolmios/0e33c579a500d87fc6f44df6cde97259) for new contributors.

## License

MIT © [Jackson Dolman](https://github.com/dolmios)
