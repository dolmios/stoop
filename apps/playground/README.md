# Stoop UI Playground

Interactive playground for testing and showcasing stoop-ui components.

## Development

From the root directory:

```bash
# Build all packages and start dev server
bun run dev:playground
```

Or from the playground directory:

```bash
cd apps/playground
bun install
bun run dev
```

**Note:** Make sure to build `stoop` and `stoop-ui` packages first if you've made changes to them:

```bash
# From root directory
bun run build:all
```

The playground will be available at `http://localhost:5173` (or the port Vite assigns).

## Build

From the playground directory:

```bash
bun run build
```

This creates an optimized production build in the `dist/` directory.

## Structure

- `src/App.tsx` - Main app component with tab navigation
- `src/pages/` - Component demo pages (Badge, Button, Card, etc.)
- `src/main.tsx` - Entry point

## Purpose

This playground serves as:

- Interactive component testing environment
- Component showcase and documentation
- Development tool for iterating on stoop-ui components

## License

MIT
