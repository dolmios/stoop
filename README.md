# [stoop](https://github.com/dolmios/stoop)

> A small component library for quickly spinning up a pretty Next.js project.

![Stoop Kid Steps Off](https://nomeatballs.files.wordpress.com/2012/08/stoop-kid-steps-off.png)

## Features

- 🎨 Theme system with dark mode support
- 🎯 Zero-config theme switching
- 🎭 System preference detection
- 🎪 SSR-friendly
- 🎭 No flash of unstyled content
- 🎨 Type-safe CSS variables
- 🎭 Stitches-like variants API

## Install

```sh
bun add stoop
```

## Usage

### Theme Provider

Wrap your app with the ThemeProvider:

```tsx
import { ThemeProvider } from "stoop";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

### Using the Theme

```tsx
import { useTheme } from "stoop";

function MyComponent() {
  const { mode, toggleTheme } = useTheme();

  return <button onClick={toggleTheme}>Current theme: {mode}</button>;
}
```

### Global Styles

Import the global styles in your app:

```tsx
import "stoop/styles/global.css";
```

### Using CSS Variables

The theme system provides CSS variables that you can use in your components:

```css
.my-component {
  color: var(--color-text);
  background-color: var(--color-background);
  padding: var(--space-medium);
  border-radius: var(--radius-small);
}
```

### Using Variants

Create type-safe component variants using the `createVariants` utility:

```tsx
import { createVariants } from "stoop";

const buttonVariants = createVariants({
  size: {
    small: "text-sm px-2 py-1",
    medium: "text-base px-4 py-2",
    large: "text-lg px-6 py-3",
  },
  variant: {
    primary: "bg-primary text-white",
    secondary: "bg-muted text-text",
    outline: "border border-border",
  },
});

function Button({ size, variant, ...props }) {
  return <button className={buttonVariants({ size, variant })} {...props} />;
}

// Usage:
<Button size="medium" variant="primary">
  Click me
</Button>;
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
