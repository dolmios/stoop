# Stoop Preview

This directory contains a comprehensive example implementation demonstrating all Stoop features and best practices.

## Structure

```
preview/
├── stoop.theme.ts      # Theme configuration and Stoop instance
├── dev.tsx             # Development entry point
├── index.html          # HTML template
├── components/         # Example styled components
│   ├── Provider.tsx    # ThemeProvider implementation example
│   ├── Demo.tsx        # Comprehensive feature showcase
│   ├── Button.tsx      # Button with variants
│   ├── Card.tsx        # Card component
│   └── ...
└── lib/                # Shared utilities and types
    ├── types.ts        # TypeScript type definitions
    ├── utils.ts        # Utility functions
    └── global.ts       # Global styles example
```

## Key Files

### `stoop.theme.ts`

The core theme file that:
- Defines all theme scales (colors, space, fonts, etc.)
- Creates the Stoop instance with `createStoop()`
- Exports theme-aware functions (`styled`, `css`, `globalCss`, `keyframes`)
- Creates light and dark themes using `createTheme()`

**Convention**: This file MUST be named `stoop.theme.ts` to follow Stoop conventions.

### `components/Provider.tsx`

Example implementation of a ThemeProvider that:
- Manages theme state (light/dark)
- Persists theme preference to localStorage
- Integrates with Stoop's `ThemeContext`
- Provides theme switching functionality

### `lib/`

Shared utilities and types:
- `types.ts` - TypeScript type definitions for the preview
- `utils.ts` - Utility functions for Stoop (margin, padding, etc.)
- `global.ts` - Global styles using `globalCss`

### `components/Demo.tsx`

Comprehensive showcase demonstrating:
- Complex values with tokens (`border: "1px solid $primary"`)
- Multiple tokens in single values (`padding: "$small $medium"`)
- Keyframes with tokens
- calc() expressions
- Negative values
- Media queries
- Nested selectors
- All 12 approved theme scales

## Running the Preview

```bash
bun run dev
```

This will:
1. Build the Stoop library
2. Serve the preview app
3. Open in your browser

## Best Practices Demonstrated

1. **Theme Organization**: All theme scales properly organized
2. **Token Usage**: Shorthand and explicit tokens shown
3. **Component Patterns**: Reusable components with variants
4. **Type Safety**: Full TypeScript inference
5. **Theme Switching**: Instant theme switching via CSS variables

