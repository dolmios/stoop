# Architecture

This document explains how Stoop works internally.

## Overview

Stoop is a CSS-in-JS library that compiles CSS objects into CSS classes at runtime. It uses a hash-based class generation system, CSS variables for theme tokens, and injects all styles into a single stylesheet in the document head.

## Core Components

### 1. `createStoop`

The main factory function that creates a Stoop instance. It:

- Accepts theme configuration
- Creates a React Context for theme access
- Returns configured functions (`styled`, `css`, `createTheme`, `globalCss`, `keyframes`, `getCssText`, `warmCache`, `preloadTheme`), `theme`, and `config`
- Conditionally returns `Provider` and `useTheme` if `themes` config is provided

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

- Generates CSS variables from theme objects using attribute selectors (e.g., `[data-theme="light"] { --colors-primary: #0070f3; }`)
- Converts theme tokens to CSS variable references
- Enables instant theme switching without recompiling CSS
- Uses token index cache (Map) for O(1) token lookups instead of O(n) recursive search
- Prefix affects CSS variable names (e.g., `--my-app-colors-primary`) and class names, but CSS variables are injected using attribute selectors (e.g., `[data-theme="light"]`) when themes are configured

### 4. CSS Injection (`inject.ts`)

Unified CSS injection system that handles both browser and SSR contexts:

- **Browser injection** - Stylesheet management, theme variable injection, and DOM manipulation
- **SSR cache** - CSS text cache for server-side rendering (LRU cache)
- **Deduplication** - Tracks injected rules to prevent duplicates using rule keys
- **Theme variables** - Injects all themes using attribute selectors for instant switching

Features:

- Maintains one `<style>` tag per prefix for all CSS
- Updates stylesheet content instead of creating multiple tags
- Injects CSS variables at the top of stylesheet
- Deduplicates CSS rules to prevent duplicates
- Supports SSR via `getCssText()` and SSR cache
- Reuses SSR stylesheet element if present to prevent FOUC

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
- Works in both SSR and client environments

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
4. Convert to CSS variable: "var(--colors-primary)" (or "var(--prefix-colors-primary)" with prefix)
5. CSS variables injected using attribute selectors (e.g., `[data-theme="light"]`) when themes are configured, or `:root` if no themes config (prefix affects variable names, not selector)
6. Theme switching changes the `data-theme` attribute, not CSS variables (all themes are available simultaneously)
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

- **CSS Variables**: Theme tokens use CSS variables, enabling theme switching without recompiling CSS
- **Single Stylesheet**: All CSS is injected into one `<style>` tag
- **Style Caching**: Styles are cached by CSS string to avoid duplicate injection
- **Memoization**: Styled components use `useMemo` hooks to cache class names
- **Hash-based Classes**: Class name generation using hash functions
- **Deduplication**: CSS rules are deduplicated to prevent redundant styles
- **Theme Updates**: All themes are injected upfront using attribute selectors; theme switching changes the `data-theme` attribute
- **Token Index Cache**: Theme token lookups use Map-based index for O(1) lookups (built per theme)
- **Unified Injection**: CSS injection handled in single module with browser/SSR support

## SSR Support

Stoop fully supports server-side rendering with Next.js App Router:

### Dual Entry Points

- **`stoop`** - Full client-side instance with all APIs (`styled`, `Provider`, `useTheme`, `getCssText`, etc.)
- **`stoop/ssr`** - Server-safe instance with only non-React APIs (`createStoop`, `getCssText`, `generateCSSVariables`, etc.)

### SSR Flow

1. **Server Components**: Can import from `stoop/ssr` for server-safe utilities
2. **Client Components**: Import from `stoop` for full functionality
3. **CSS Injection**: Use `useServerInsertedHTML` hook from Next.js to capture styles during SSR
4. **Global Styles**: `globalCss` works in both SSR and client environments
5. **Theme Variables**: Generated during SSR and included in initial HTML

### Next.js App Router Pattern

```tsx
// stoop.theme.ts (client-side)
import { createStoop } from "stoop";
export const { styled, Provider, useTheme, getCssText, globalCss } = createStoop(config);

// app/components/Styles.tsx (client component)
("use client");
import { useServerInsertedHTML } from "next/navigation";
import { getCssText } from "../stoop.theme";

export function Styles({ initialTheme }) {
  useServerInsertedHTML(() => {
    // Global styles are automatically included from theme config
    // Note: getCssText() always includes all themes, the parameter is ignored
    const cssText = getCssText();
    return <style id="stoop-ssr" dangerouslySetInnerHTML={{ __html: cssText }} />;
  });
  return null;
}

// app/layout.tsx (server component)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Styles initialTheme="light" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Key Features

- No FOUC: Styles are included in initial HTML
- Streaming SSR: Works with React 18 streaming
- Theme Detection: Server can detect theme from cookies
- Automatic Hydration: Client reuses SSR-generated styles

## Limitations

- **No Compound Variants**: Unlike stitches, Stoop doesn't support compound variants (variants that depend on multiple props)
- **CSS-in-JS Runtime**: All styles are generated at runtime (no build-time extraction)

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

- **Theme Switching**: Changing themes updates the `data-theme` attribute, not CSS variables (all themes are available simultaneously)
- **No Recompilation**: Components don't need to recompile when theme changes
- **Browser Native**: Browser handles theme updates natively via CSS attribute selectors

### How It Works

1. Theme tokens (`$primary` or `$colors.primary`) are converted to CSS variables (`var(--colors-primary)` or `var(--prefix-colors-primary)` with prefix)
2. CSS variables are injected using attribute selectors (e.g., `[data-theme="light"]`) when themes are configured, or `:root` if no themes config (prefix affects variable names, not the selector)
3. All themes are injected upfront, allowing instant theme switching by changing the `data-theme` attribute
4. All components automatically reflect new theme values via CSS variable references
5. Prefix in variable names enables multiple Stoop instances to coexist without CSS variable conflicts
