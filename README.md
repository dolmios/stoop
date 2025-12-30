# [stoop](https://github.com/dolmios/stoop)

> A lightweight, polymorphic React component library with intuitive design tokens and built-in theming system.

![Stoop Kid Steps Off](https://stoop.dolmios.com/stoop.jpg)

[![npm version](https://img.shields.io/npm/v/stoop)](https://www.npmjs.com/package/stoop)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
- React >=16.8.0 required (Next.js Pages & App Router supported)
- Automatic prefix (`stoop` by default) for CSS class names and variables

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

const { styled, css, createTheme, globalCss, keyframes } = createStoop({
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

const Button = styled(
  "button",
  {
    padding: "$medium",
    backgroundColor: "$primary",
    color: "$text",
  },
  {
    variant: {
      primary: { backgroundColor: "$primary" },
      secondary: { backgroundColor: "$background", border: "1px solid $primary" },
    },
  },
);

<Button variant="primary">Click me</Button>;
```

See [GUIDE.md](./docs/GUIDE.md) for complete setup instructions.

## Documentation

- **[GUIDE.md](./docs/GUIDE.md)** - Step-by-step setup and usage guide
- **[API.md](./docs/API.md)** - Complete API reference
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Internal implementation details
- **[TESTING.md](./docs/TESTING.md)** - Testing guide and test suite documentation

## API Overview

### `createStoop(config)`

Creates a Stoop instance. Returns: `styled`, `css`, `createTheme`, `globalCss`, `keyframes`, `getCssText`, `warmCache`, `preloadTheme`, `theme`, `config`. If `themes` config is provided, also returns `Provider` and `useTheme`.

See [API.md](./docs/API.md) for complete API documentation.

### Theme Tokens

Use `$` prefix for theme tokens. Shorthand `$token` uses property-aware resolution (preferred); explicit `$scale.token` specifies the scale.

```tsx
{
  color: "$primary",           // Shorthand (preferred, property-aware)
  padding: "$medium",          // Property-aware → space scale
  fontSize: "$fontSizes.small", // Explicit scale
}
```

Tokens resolve to CSS variables (`var(--colors-primary)`), enabling instant theme switching without recompiling CSS.

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

## Migration from Stitches

Stoop provides a similar API for the features it implements. Key differences:

- CSS variables for theme tokens
- Simple theme system with `createTheme()`
- Full TypeScript inference

See [GUIDE.md](./docs/GUIDE.md) for migration examples.

## Related Projects

**CSS-in-JS Libraries:**

- [Stitches](https://stitches.dev) - Original library Stoop is based on (no longer maintained)
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

This is a monorepo using Bun workspaces. The project structure:

```
stoop/
├── packages/
│   ├── stoop/          # Main library package
│   └── stoop-ui/       # UI component library built with stoop
├── apps/
│   ├── website/        # Website/documentation site (Next.js)
│   └── playground/     # Component playground (Vite)
└── scripts/            # Shared scripts
```

### Setup

```sh
# Install all dependencies (for all workspaces)
bun install

# Build all packages
bun run build:all

# Build individual packages
bun run build              # Build stoop
bun run build:stoop-ui     # Build stoop-ui
bun run build:website      # Build website (includes all packages)
```

### Development Commands

```sh
# Development servers
bun run dev                # Build all packages + start website dev server
bun run dev:playground     # Build all packages + start playground dev server

# Build commands
bun run build              # Build stoop package
bun run build:stoop-ui     # Build stoop-ui package
bun run build:all          # Build both stoop and stoop-ui packages
bun run build:website      # Build all packages + website

# Publishing
bun run publish            # Publish stoop package to npm
bun run publish:stoop-ui   # Publish stoop-ui package to npm

# Code quality
bun run lint               # Lint all packages
bun run format             # Format code
bun run tidy               # Run lint + format

# Testing
bun run test               # Run tests
bun run test:coverage      # Run tests with coverage
bun run test:watch         # Run tests in watch mode
```

### Working with Packages

```sh
# Work in stoop package
cd packages/stoop
bun run build
bun run test

# Work in stoop-ui package
cd packages/stoop-ui
bun run build
bun run test

# Work in website app
cd apps/website
bun run dev
bun run build

# Work in playground app
cd apps/playground
bun run dev
bun run build
```

### Monorepo Structure

- **`packages/stoop`** - The main Stoop library
  - Build: `bun run build`
  - Test: `bun run test`
  - Publish: `bun run publish`

- **`packages/stoop-ui`** - UI component library built with stoop
  - Build: `bun run build:stoop-ui`
  - Test: `bun run test` (from package directory)
  - Publish: `bun run publish:stoop-ui`

- **`apps/website`** - Website and documentation site (Next.js)
  - Dev: `bun run dev`
  - Build: `bun run build:website`

- **`apps/playground`** - Component playground for testing stoop-ui (Vite)
  - Dev: `bun run dev:playground`
  - Build: `bun run build` (from app directory)

All apps use `stoop` and `stoop-ui` as workspace dependencies, so changes to the packages are automatically available in the apps after rebuilding.

## Contributing

Feel free to get in touch with feedback, advice or suggestions. See [Conventional Commits](https://gist.github.com/dolmios/0e33c579a500d87fc6f44df6cde97259) for new contributors.

## License

MIT © [Jackson Dolman](https://github.com/dolmios)
