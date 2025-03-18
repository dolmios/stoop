# [stoop](https://github.com/dolmios/stoop)

> A small component library for quickly spinning up a pretty Next.js project.

![Stoop Kid Steps Off](https://nomeatballs.files.wordpress.com/2012/08/stoop-kid-steps-off.png)

## Install

```sh
bun add stoop
```

## Usage

### Global Styles

Import the global styles in your app:

```tsx
import "stoop/styles";
```

### Using Components

```tsx
import { Button } from "stoop";

function MyComponent() {
  return <Button>Click me</Button>;
}
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
