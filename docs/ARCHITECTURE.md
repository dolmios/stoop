# Architecture

This document explains how Stoop works internally.

## Overview

Stoop is a CSS-in-JS library that compiles CSS objects into CSS classes at runtime. It uses a hash-based class generation system, CSS variables for theme tokens, and injects all styles into a single stylesheet in the document head.

## Core Components

### 1. `createStoop`

The main factory function that creates a Stoop instance. It:
- Accepts theme configuration
- Creates a React Context for theme access
- Returns configured functions (`styled`, `css`, `createTheme`, `globalCss`, `keyframes`, `getCssText`, `warmCache`), `ThemeContext`, `theme`, and `config`

### 2. CSS Compilation (`core/compiler.ts`)

The CSS compilation engine that:
- Converts theme tokens to CSS variables (`$colors.primary` → `var(--colors-primary)`)
- Converts CSS objects to CSS strings
- Generates unique class names using hash functions
- Caches styles to avoid duplicate injection
- Handles nested CSS (pseudo-classes, media queries, etc.)
- Uses Symbol-based component targeting for styled component references

### 3. CSS Variables (`utils/theme.ts`)

Theme token system that:
- Generates CSS variables from theme objects (`:root { --colors-primary: #0070f3; }` or `:root[data-stoop="prefix"] { --colors-primary: #0070f3; }` when prefix is provided)
- Converts theme tokens to CSS variable references
- Enables instant theme switching without recompiling CSS
- Uses token index cache (WeakMap) for O(1) token lookups instead of O(n) recursive search
- Scopes CSS variables with prefix to enable multiple Stoop instances

### 4. CSS Injection (`inject/`)

Modular CSS injection system split into focused modules:
- **`browser.ts`** - Browser-specific injection logic (stylesheet management, theme variables)
- **`ssr.ts`** - SSR cache management (CSS text cache for server-side rendering)
- **`dedup.ts`** - Deduplication logic (tracks injected rules to prevent duplicates)
- **`index.ts`** - Public API that composes the modules

Features:
- Maintains one `<style>` tag for all CSS
- Updates stylesheet content instead of creating multiple tags
- Injects CSS variables at the top of stylesheet
- Deduplicates CSS rules to prevent duplicates
- Supports SSR via `getCssText()`

### 5. Styled Components (`api/styled.ts`)

Creates React components that:
- Accept variant props
- Support `css` prop for additional styles
- Support `as` prop for polymorphic elements
- Can accept other styled components as the element parameter for composition
- Have a `selector` property for component targeting in nested styles
- Access theme from React Context
- Use `useMemo` for performance

### 6. CSS Function (`api/css.ts`)

Generates CSS classes from CSS objects:
- Uses default theme (doesn't access context)
- Returns class name string
- Useful for utility classes

### 7. Global CSS (`api/globalCss.ts`)

Injects global styles:
- Supports selectors (`*`, `body`, etc.)
- Resolves theme tokens
- Returns cleanup function
- No-op for SSR

### 8. Keyframes (`api/keyframes.ts`)

Creates CSS keyframe animations:
- Generates `@keyframes` rules
- Returns animation name string
- Supports prefix for scoped animations

## Data Flow

### Creating a Styled Component

```
1. User calls: styled("button", baseStyles, variants)
2. Returns a React component
3. Component renders with props
4. Extract variant props from props
5. Get theme from Context (or use default)
6. Apply variants to base styles
7. Resolve theme tokens
8. Generate CSS string
9. Hash CSS string → class name
10. Inject CSS into <head>
11. Return class name
```

### Theme Token Resolution

```
1. CSS object: { color: "$primary" }
2. Extract token: "primary" (shorthand) or "colors.primary" (full path)
3. Resolve via themeMap (property-aware) or search all categories
4. Convert to CSS variable: "var(--colors-primary)"
5. CSS variables injected once in :root (or :root[data-stoop="prefix"] with prefix)
6. Theme switching updates CSS variables, not CSS classes
```

### Variant Application

```
1. Base styles: { padding: "10px" }
2. Variant prop: variant="primary"
3. Variant styles: { backgroundColor: "$primary" }
4. Merge: { padding: "10px", backgroundColor: "$primary" }
5. Convert tokens to CSS variables: { backgroundColor: "var(--colors-primary)" }
6. Generate CSS with CSS variables
```

## Performance Optimizations

1. **CSS Variables**: Theme tokens use CSS variables, enabling theme switching without recompiling CSS
2. **Single Stylesheet**: All CSS is injected into one `<style>` tag
3. **Style Caching**: Styles are cached by CSS string to avoid duplicate injection
4. **Memoization**: Styled components use `useMemo` hooks to cache class names
5. **Hash-based Classes**: Class name generation using hash functions
6. **Deduplication**: CSS rules are deduplicated to prevent redundant styles
7. **Theme Updates**: CSS variables update in-place when theme changes
8. **Token Index Cache**: Theme token lookups use WeakMap-based index for O(1) lookups
9. **Modular Injection**: CSS injection split into focused modules (browser, SSR, dedup)

## SSR Support

Stoop supports server-side rendering through:
- `getCssText()` function that returns all generated CSS
- No-op functions for `globalCss` when `document` is undefined
- Theme context that can be provided server-side

## Limitations

1. **No Compound Variants**: Unlike stitches, Stoop doesn't support compound variants (variants that depend on multiple props)
2. **CSS-in-JS Runtime**: All styles are generated at runtime (no build-time extraction)

## Utility Functions

Utility functions allow you to create shorthand properties that transform into CSS properties. They are applied before theme token resolution, enabling you to use theme tokens in utility values.

### How Utilities Work

1. CSS object is processed
2. Utility functions are applied (transform shorthand → CSS properties)
3. Theme tokens are resolved
4. CSS is generated and injected

### Example

```tsx
const { styled } = createStoop({
  theme: { space: { medium: "16px" } },
  utils: {
    px: (value) => ({ paddingLeft: value, paddingRight: value }),
  },
});

// Usage
const Button = styled("button", {
  px: "$medium", // → { paddingLeft: "16px", paddingRight: "16px" }
});
```

## CSS Variables Implementation

Stoop uses CSS variables (CSS custom properties) for theme tokens:

1. **Theme Switching**: Changing themes updates CSS variables, not CSS classes
2. **No Recompilation**: Components don't need to recompile when theme changes
3. **Browser Native**: Browser handles theme updates natively

### How It Works

1. Theme tokens (`$primary` or `$colors.primary`) are converted to CSS variables (`var(--colors-primary)`)
2. CSS variables are injected once in `:root` block (or `:root[data-stoop="prefix"]` when a prefix is configured)
3. When theme changes, only CSS variables are updated
4. All components automatically reflect new theme values
5. Prefix scoping enables multiple Stoop instances to coexist without CSS variable conflicts

