# stoop-swc

Build-time CSS-in-JS library using Rust SWC plugin. Compiles `styled()` components at build time, generating static CSS files with <2KB runtime.

## Features

- **Zero Runtime Overhead**: <2KB runtime bundle (only variant selection logic)
- **Build-Time Compilation**: All CSS generation happens via Rust SWC plugin
- **Framework Agnostic**: Works anywhere SWC works (Next.js, Vite, Remix)
- **Type-Safe**: Full TypeScript inference for variants and themes
- **CSS Variables**: Theme switching without recompilation

## Installation

```bash
npm install stoop-swc
```

**Note**: The compiler export (`stoop-swc/compiler`) is platform-specific. The package.json currently exports a macOS-specific binary (`.dylib`). For Linux (`.so`) or Windows (`.dll`), you'll need to build the compiler locally or use platform-specific builds. The runtime export (`stoop-swc/runtime`) works on all platforms.

## Quick Start

### 1. Create Theme Configuration

Create `styled.config.ts` in your project root:

```typescript
export default {
  theme: {
    colors: {
      primary: "#0070f3",
      secondary: "#666",
    },
    space: {
      sm: "8px",
      md: "16px",
      lg: "24px",
    },
  },
  themes: {
    dark: {
      colors: {
        primary: "#3b82f6",
      },
    },
  },
};
```

### 2. Configure Next.js

Update `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcPlugins: [["stoop-swc/compiler", {}]],
  },
};

export default nextConfig;
```

### 3. Use in Components

```typescript
import { styled } from 'stoop-swc/runtime';

const Button = styled('button', {
  padding: '$md',
  backgroundColor: '$primary',
  color: 'white',
}, {
  size: {
    sm: { padding: '$sm' },
    lg: { padding: '$lg' },
  },
});

// Usage
<Button size="sm">Click me</Button>
```

### 4. Import Generated CSS

In your root layout or `_app.tsx`:

```typescript
import "../.stoop/styles.css";
```

## API

### `styled(element, baseStyles?, variants?)`

Creates a styled component. Must be compiled by the SWC plugin.

### `ThemeProvider`

Provides theme context for theme switching.

```typescript
import { ThemeProvider } from 'stoop-swc/runtime';

<ThemeProvider defaultTheme="light">
  <App />
</ThemeProvider>
```

### `useTheme()`

Hook to access and change theme.

```typescript
import { useTheme } from "stoop-swc/runtime";

const { theme, setTheme } = useTheme();
```

## Configuration

See `docs/api-reference.md` for full configuration options.

## Migration from stoop

See `docs/migration.md` for migration guide.

## Development

```sh
# Build Rust compiler
bun run build:rust

# Build runtime
bun run build:runtime

# Build both
bun run build

# Test Rust compiler
bun run test:rust

# Test runtime
bun run test:runtime
```

## License

MIT
