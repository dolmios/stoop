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
// stoop.theme.ts
import { createStoop } from "stoop";

const stoop = createStoop({
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

export const { styled, css, Provider, useTheme } = stoop;

// Usage
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

📚 **[Full Documentation →](https://stoop.dolmios.com)**

- [Installation](https://stoop.dolmios.com/installation)
- [Theme Setup](https://stoop.dolmios.com/theme-setup)
- [Creating Components](https://stoop.dolmios.com/creating-components)
- [SSR Guide](https://stoop.dolmios.com/ssr)
- [API Reference](https://stoop.dolmios.com/api)

For internal architecture details, see [ARCHITECTURE.md](./ARCHITECTURE.md) (developer-only).

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
const Button = styled("button", {
  variants: {
    variant: {
      primary: { backgroundColor: "$primary" },
      secondary: { backgroundColor: "$secondary" },
    },
    size: {
      small: { padding: "$small" },
      large: { padding: "$large" },
    },
  },
});

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
