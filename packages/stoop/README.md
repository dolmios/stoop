# stoop

A lightweight, type-safe CSS-in-JS library for React with theme support, variants, and SSR capabilities.

## Installation

```sh
npm install stoop
# or
bun add stoop
# or
yarn add stoop
```

## Quick Start

```tsx
import { createStoop } from "stoop";

const { styled, css, Provider, useTheme } = createStoop({
  theme: {
    colors: {
      primary: "#0070f3",
      background: "#ffffff",
      text: "#000000",
    },
    space: {
      small: "8px",
      medium: "16px",
      large: "24px",
    },
  },
  themes: {
    light: {
      /* ... */
    },
    dark: {
      /* ... */
    },
  },
});

const Button = styled("button", {
  padding: "$medium",
  backgroundColor: "$primary",
  color: "$text",
});

<Button>Click me</Button>;
```

## Features

- **Type-safe theming** with TypeScript inference
- **CSS variables** for instant theme switching
- **Variant system** for component variations
- **SSR support** via `getCssText()`
- **Multiple themes** with built-in Provider
- **Utility functions** for custom CSS transformations
- **Zero runtime overhead** for theme switching

## Documentation

- **[GUIDE.md](./docs/GUIDE.md)** - Step-by-step setup and usage guide
- **[API.md](./docs/API.md)** - Complete API reference
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Internal implementation details
- **[TESTING.md](./docs/TESTING.md)** - Testing guide and test suite documentation

## API Overview

### `createStoop(config)`

Creates a Stoop instance. Returns: `styled`, `css`, `createTheme`, `globalCss`, `keyframes`, `getCssText`, `warmCache`, `preloadTheme`, `theme`, `config`. If `themes` config is provided, also returns `Provider` and `useTheme`.

### Theme Tokens

Use `$` prefix for theme tokens. Shorthand `$token` uses property-aware resolution (preferred); explicit `$scale.token` specifies the scale.

```tsx
{
  color: "$primary",           // Shorthand (preferred, property-aware)
  padding: "$medium",         // Property-aware → space scale
  fontSize: "$fontSizes.small", // Explicit scale
}
```

### Variants

Variants create component variations via props:

```tsx
const Button = styled(
  "button",
  {},
  {
    variant: {
      primary: { backgroundColor: "$primary" },
      secondary: { backgroundColor: "$secondary" },
    },
    size: {
      small: { padding: "$small" },
      large: { padding: "$large" },
    },
  },
);

<Button variant="primary" size="small" />;
```

## Development

```sh
# Build
bun run build

# Test
bun run test

# Watch mode
bun run test:watch
```

## License

MIT
