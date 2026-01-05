# Getting Started with stoop-swc

Build-time CSS-in-JS library using Rust SWC plugin.

## Installation

```bash
npm install stoop-swc
```

## Setup

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

### 3. Import Generated CSS

In your root layout or `_app.tsx`:

```typescript
import "../.stoop/styles.css";
```

### 4. Use ThemeProvider

Wrap your app with ThemeProvider:

```typescript
import { ThemeProvider } from 'stoop-swc/runtime';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 5. Create Styled Components

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

## Next Steps

- See [API Reference](./api-reference.md) for full API documentation
- See [Migration Guide](./migration.md) to migrate from stoop
- See [Theming](./theming.md) for theme configuration details
