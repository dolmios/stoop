# Stoop

CSS-in-JS library with type inference, theme creation, and variants support.

[![npm version](https://img.shields.io/npm/v/stoop)](https://www.npmjs.com/package/stoop)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Warning: Not Production Ready**
> Stoop is currently in active development and is not recommended for production use. The API may change, and there may be bugs or missing features. Use at your own risk.

## About

Stoop is a CSS-in-JS library—a TypeScript-first approach to styling that provides type-safe CSS objects with full type inference. Similar to [Stitches](https://stitches.dev) and [Vanilla Extract](https://vanilla-extract.style), Stoop focuses on type safety and developer experience.

Stoop is a minimalist implementation of Stitches' high-level features. It provides a similar API for `styled`, `css`, and variants, but omits several Stitches features.

**What's missing compared to Stitches:**
- Compound variants
- Build-time CSS extraction (runtime-only)
- Advanced utility functions (basic support only)
- Additional Stitches APIs

If you need these features, consider [Vanilla Extract](https://vanilla-extract.style) or [styled-components](https://styled-components.com).

## Features

- Type-safe theming with TypeScript inference
- CSS variables for theme tokens
- Variant system for component variations
- Utility functions for custom CSS transformations
- Multiple themes with `createTheme()`
- SSR support via `getCssText()`
- React 19+ required (Next.js Pages & App Router supported)

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

const { styled, css, createTheme, globalCss, keyframes, ThemeContext } = createStoop({
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
});

const Button = styled("button", {
  padding: "$medium",
  backgroundColor: "$primary",
}, {
  variant: {
    primary: { backgroundColor: "$primary" },
    secondary: { backgroundColor: "$secondary" },
  },
});

<Button variant="primary">Click me</Button>
```

See [GUIDE.md](./docs/GUIDE.md) for complete setup instructions.

## Documentation

- **[GUIDE.md](./docs/GUIDE.md)** - Step-by-step setup and usage guide
- **[API.md](./docs/API.md)** - Complete API reference
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Internal implementation details

## API Overview

### `createStoop(config)`

Creates a Stoop instance. Returns: `styled`, `css`, `createTheme`, `globalCss`, `keyframes`, `getCssText`, `warmCache`, `ThemeContext`, `theme`, `config`.

See [API.md](./docs/API.md) for complete API documentation.

### Theme Tokens

Use `$` prefix for theme tokens. Shorthand `$token` searches all scales; explicit `$scale.token` specifies the scale.

```tsx
{
  color: "$primary",           // Shorthand (preferred)
  padding: "$medium",          // Property-aware resolution
  fontSize: "$fontSizes.small", // Explicit scale
}
```

Tokens resolve to CSS variables (`var(--colors-primary)`), enabling instant theme switching without recompiling CSS.

### Variants

Variants create component variations via props:

```tsx
const Button = styled("button", {}, {
  variant: {
    primary: { backgroundColor: "$primary" },
    secondary: { backgroundColor: "$secondary" },
  },
  size: {
    small: { padding: "$small" },
    large: { padding: "$large" },
  },
});

<Button variant="primary" size="small" />
```

## Migration from Stitches

Stoop provides a similar API for the features it implements. Key differences:
- CSS variables for theme tokens
- Simple theme system with `createTheme()`
- Full TypeScript inference

See [GUIDE.md](./docs/GUIDE.md) for migration examples.

## Related Projects

**CSS-in-JS Libraries:**
- [Stitches](https://stitches.dev) - Original library Stoop is based on (no longer maintained)
- [Stitches](https://stitches.dev) - CSS-in-JS library (original inspiration)
- [Vanilla Extract](https://vanilla-extract.style) - Zero-runtime CSS-in-JS
- [styled-components](https://styled-components.com) - CSS-in-JS library
- [Emotion](https://emotion.sh) - CSS-in-JS library
- [Goober](https://goober.rocks) - Lightweight CSS-in-JS library
- [JSS](https://cssinjs.org) - Framework-agnostic CSS-in-JS
- [Compiled](https://compiledcssinjs.com) - Compile-time CSS-in-JS
- [Stylex](https://stylexjs.com) - Facebook's build-time CSS-in-JS
- [Panda CSS](https://panda-css.com) - CSS-in-JS with build-time generation
- [Linaria](https://linaria.dev) - Zero-runtime CSS-in-JS
- [Treat](https://seek-oss.github.io/treat) - Themeable CSS-in-JS

**Variant Systems:**
- [CVA](https://cva.style) - Class Variance Authority for component variants
- [clsx](https://github.com/lukeed/clsx) - Tiny utility for constructing className strings

**Utility-First:**
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [UnoCSS](https://unocss.dev) - Instant atomic CSS engine

**Component Libraries:**
- [Radix UI](https://www.radix-ui.com) - Unstyled, accessible component primitives
- [Chakra UI](https://chakra-ui.com) - Component library built on Emotion
- [Mantine](https://mantine.dev) - React components library with Emotion

## Development

```sh
bun install
bun run dev
bun run build
bun run lint
```

## Contributing

Contributions welcome. See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for implementation details.

## License

MIT © [Jackson Dolman](https://github.com/dolmios)
