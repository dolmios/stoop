# API Reference

## Core API

## `createStoop(config)`

Creates a Stoop instance with your theme configuration.

### Parameters

#### `config.theme` (required)

Your theme object containing design tokens. **Only the 13 approved theme scales are allowed:**

- `colors` - Color values (strings)
- `opacities` - Opacity values (strings or numbers)
- `space` - Spacing values (strings)
- `radii` - Border radius values (strings)
- `sizes` - Size values (strings)
- `fonts` - Font family values (strings)
- `fontWeights` - Font weight values (strings or numbers)
- `fontSizes` - Font size values (strings)
- `lineHeights` - Line height values (strings or numbers)
- `letterSpacings` - Letter spacing values (strings)
- `shadows` - Shadow values (strings)
- `zIndices` - Z-index values (strings or numbers)
- `transitions` - Transition/animation values (strings)

```tsx
{
  colors: {
    primary: "#0070f3",
    secondary: "#7928ca",
  },
  space: {
    small: "8px",
    medium: "16px",
  },
  fontSizes: {
    small: "14px",
    medium: "16px",
  },
  // ... other approved scales only
}
```

**Note**: Custom theme scales are not allowed. TypeScript will enforce this at compile time, and runtime validation will warn/error on invalid scales.

#### `config.media` (optional)

Media query breakpoints for responsive styles:

```tsx
{
  mobile: "@media (max-width: 768px)",
  tablet: "@media (min-width: 769px) and (max-width: 1024px)",
  desktop: "@media (min-width: 1025px)",
}
```

#### `config.themes` (optional)

**New in v0.2.0**: Object mapping theme names to theme objects for multi-theme support with built-in Provider.

When provided, `createStoop` returns `Provider` and `useTheme` for automatic theme management:

```tsx
const { styled, css, Provider, useTheme } = createStoop({
  theme: lightTheme, // Default theme
  themes: {
    light: lightTheme,
    dark: darkTheme,
    // Add more themes as needed
  },
});

// Usage
<Provider defaultTheme="light" storageKey="theme">
  <App />
</Provider>;

// In components
const { theme, themeName, setTheme, toggleTheme, availableThemes } = useTheme();
```

**Benefits:**

- Automatic theme state management with localStorage persistence
- Centralized theme variable updates (prevents performance issues)
- Built-in FOUC prevention with `useLayoutEffect`

If `themes` is not provided, you can still use custom theme management by manually creating your own React Context and using `createTheme()` to create theme variants. Note that `setTheme()` and `toggleTheme()` are only available via `useTheme()` which requires the `themes` config.

#### `config.prefix` (optional)

Prefix for generated CSS class names and CSS variable names. Defaults to `"stoop"`.

When a prefix is provided, CSS class names and CSS variable names are prefixed (e.g., `my-app-abc123`, `--my-app-colors-primary`). CSS variables are always injected in `:root` selector (prefix does not affect the selector). This enables multiple Stoop instances to coexist without conflicts.

```tsx
{
  prefix: "my-app", // Classes will be: my-app-abc123
  // CSS variables will be: :root { --my-app-colors-primary: ... }
}
```

#### `config.utils` (optional)

Utility functions for CSS transformations. Utilities allow you to create shorthand properties that transform into CSS properties.

```tsx
{
  utils: {
    px: (value) => ({ paddingLeft: value, paddingRight: value }),
    py: (value) => ({ paddingTop: value, paddingBottom: value }),
    mx: (value) => ({ marginLeft: value, marginRight: value }),
    my: (value) => ({ marginTop: value, marginBottom: value }),
  },
}
```

Utilities are applied before theme token resolution, so you can use theme tokens in utility values:

```tsx
{
  px: "$medium", // Resolves to paddingLeft and paddingRight
}
```

#### `config.themeMap` (optional)

Custom property-to-scale mapping for theme token resolution. Overrides default mappings for specific CSS properties.

```tsx
{
  themeMap: {
    // Override default mapping for a specific property
    myCustomProperty: "colors",
    // Map custom properties to theme scales
    customSpacing: "space",
  },
}
```

**Resolution Priority:**

1. User's custom `themeMap` (if provided)
2. Default `themeMap` (common CSS properties)
3. Pattern-based auto-detection (fallback for unmapped properties)
4. Search all categories (backward compatibility)

Most users don't need to configure `themeMap` - the default covers common CSS properties and pattern matching handles edge cases gracefully.

### Returns

An object containing:

- **`styled`** - Function to create styled components
- **`css`** - Function to create CSS classes
- **`createTheme`** - Function to create additional themes
- **`globalCss`** - Function to create global styles
- **`keyframes`** - Function to create CSS keyframe animations
- **`getCssText`** - Function to get CSS text for SSR
- **`warmCache`** - Function to pre-compile CSS objects for cache warming
- **`preloadTheme`** - Function to preload theme CSS variables before React renders
- **`theme`** - Frozen copy of your theme object
- **`config`** - Your configuration object
- **`Provider`** - Theme provider component (only if `themes` config provided)
- **`useTheme`** - Hook to access theme management (only if `themes` config provided)

---

## `styled(element, baseStyles?, variants?)`

Creates a styled React component with variant support.

### Parameters

#### `element` (required)

HTML element name as a string: `"div"`, `"button"`, `"span"`, etc.

You can also pass another styled component to compose components:

```tsx
const BaseButton = styled("button", { padding: "$medium" });
const PrimaryButton = styled(BaseButton, { backgroundColor: "$primary" });
```

#### `baseStyles` (optional)

Base CSS object applied to all instances:

```tsx
{
  padding: "$medium",
  backgroundColor: "$primary",
  "&:hover": {
    opacity: 0.9,
  },
}
```

#### `variants` (optional)

Variant configuration object:

```tsx
{
  variant: {
    primary: { backgroundColor: "$primary" },
    secondary: { backgroundColor: "$secondary" },
  },
  size: {
    small: { padding: "$small" },
    large: { padding: "$large" },
  },
}
```

### Returns

A React component that accepts:

- All standard HTML element props
- Variant props (from your variants config)
- `css` prop for additional styles
- `as` prop to change the underlying element

The component also has a **`selector`** property that returns a `StyledComponentRef` for component targeting in nested styles:

```tsx
const Button = styled("button", { padding: "$medium" });

const Card = styled("div", {
  [Button.selector]: {
    marginTop: "$small",
  },
});
```

### Example

```tsx
const Button = styled(
  "button",
  {
    padding: "$medium",
    borderRadius: "8px",
  },
  {
    variant: {
      primary: { backgroundColor: "$primary" },
    },
  },
);

<Button variant="primary" css={{ marginTop: "10px" }} as="a" href="/">
  Click me
</Button>;
```

---

## `css(styles)`

Generates a CSS class name from a CSS object.

### Parameters

#### `styles` (required)

CSS object:

```tsx
{
  color: "$text",
  padding: "$medium",
  backgroundColor: "$background",
}
```

### Returns

A string class name that can be applied to elements.

### Example

```tsx
const className = css({
  color: "$text",
  padding: "$medium",
});

<div className={className}>Styled content</div>;
```

---

## `createTheme(themeOverrides)`

Creates a new theme by extending the base theme.

### Parameters

#### `themeOverrides` (optional)

Partial theme object that will be merged with the base theme. Defaults to an empty object if not provided:

```tsx
{
  colors: {
    primary: "#ff0000", // Overrides base theme's colors.primary
  },
  // Other tokens from base theme are preserved
}
```

### Returns

A new theme object that extends the base theme. When used with the `themes` config in `createStoop`, themes are automatically merged with the default theme.

### Example

```tsx
const { createTheme } = createStoop({
  theme: {
    colors: {
      primary: "#0070f3",
      background: "#ffffff",
      text: "#000000",
    },
  },
});

// Create a dark theme variant
const darkTheme = createTheme({
  colors: {
    background: "#000000",
    text: "#ffffff",
  },
});

// Use with themes config for automatic theme management
const { Provider } = createStoop({
  theme: lightTheme,
  themes: {
    light: lightTheme,
    dark: darkTheme, // Uses createTheme result
  },
});
```

---

## `globalCss(styles)`

Creates global CSS styles.

### Parameters

#### `styles` (required)

CSS object with selectors:

```tsx
{
  "*": {
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  body: {
    fontFamily: "system-ui, sans-serif",
  },
  "@media (max-width: 768px)": {
    body: {
      fontSize: "14px",
    },
  },
}
```

### Returns

A function that injects the global styles when called. Returns a cleanup function.

### Example

```tsx
const globalStyles = globalCss({
  "*": {
    margin: 0,
    padding: 0,
  },
});

// Inject styles
const cleanup = globalStyles();

// Later, remove styles
cleanup();
```

---

## `keyframes(keyframesObj)`

Creates CSS keyframe animations.

### Parameters

#### `keyframesObj` (required)

Object defining keyframe steps:

```tsx
{
  from: { opacity: 0 },
  "50%": { opacity: 0.5 },
  to: { opacity: 1 },
}
```

Or using percentage strings:

```tsx
{
  "0%": { transform: "translateY(0)" },
  "100%": { transform: "translateY(-20px)" },
}
```

### Returns

A string animation name that can be used in CSS `animation` property.

### Example

```tsx
const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const Button = styled("button", {
  animation: `${fadeIn} 0.3s ease-in`,
});
```

---

## `getCssText(theme?)`

Gets all generated CSS text for server-side rendering. Always includes theme CSS variables.

### Parameters

#### `theme` (optional)

Theme to include CSS variables for (defaults to default theme):

- String: theme name (looks up in `themes` config)
- Theme object: use directly

### Returns

A string containing all CSS including theme variables and component styles.

### Example

```tsx
// Server-side - basic usage (includes default theme vars)
const cssText = getCssText();

// With specific theme name
const darkCssText = getCssText("dark");

// With theme object
const darkCssText = getCssText(darkTheme);

// Inject into HTML
<style dangerouslySetInnerHTML={{ __html: cssText }} />;
```

---

## `warmCache(styles)`

Pre-compiles CSS objects to warm the cache. Useful for eliminating FOUC by pre-compiling common styles.

### Parameters

#### `styles` (required)

Array of CSS objects to pre-compile:

```tsx
warmCache([
  { padding: "$medium", color: "$text" },
  { margin: "$small", backgroundColor: "$background" },
]);
```

### Returns

`void`

### Example

```tsx
const { warmCache } = createStoop({
  theme: {
    /* ... */
  },
});

// Pre-compile common styles
warmCache([{ padding: "$medium" }, { color: "$text" }, { backgroundColor: "$background" }]);
```

---

## `preloadTheme(theme)`

Preloads themes by injecting CSS variables for all configured themes before React renders.

Critical for preventing FOUC when loading a non-default theme from localStorage on initial page load.

**Note**: This function always injects CSS variables for ALL themes configured in `themes`, regardless of the `theme` parameter. The parameter is kept for backward compatibility but is ignored. All themes are injected using attribute selectors (e.g., `[data-theme="light"]`), allowing instant theme switching by changing the `data-theme` attribute.

### Parameters

#### `theme` (optional, deprecated)

Theme parameter is kept for backward compatibility but is ignored. The function always injects all themes from the `themes` config.

### Returns

`void`

### Example

```tsx
const { preloadTheme } = createStoop({
  theme: lightTheme,
  themes: { light: lightTheme, dark: darkTheme },
});

// Before React renders - prevents FOUC
// This injects CSS variables for ALL themes (light and dark)
preloadTheme(); // Parameter is optional and ignored

// Then render React
const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

**Best Practice**: Call `preloadTheme` in your entry point before React renders:

```tsx
// main.tsx or index.tsx
import { createRoot } from "react-dom/client";
import { preloadTheme } from "./theme";

// Prevent FOUC by preloading all themes
try {
  preloadTheme(); // Injects all themes synchronously
} catch {}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
```

---

## `Provider` Component

Built-in theme provider component (only available when `themes` config is provided).

Manages theme state, localStorage persistence, and centralized theme variable updates.

### Props

- `children: ReactNode` - Child components
- `defaultTheme?: string` - Default theme name (defaults to first theme in `themes` config)
- `storageKey?: string` - LocalStorage key for theme persistence (defaults to `"stoop-theme"`)
- `cookieKey?: string` - Cookie key for theme persistence (optional, enables cookie sync with localStorage)
- `attribute?: string` - HTML attribute to set on document root (defaults to `"data-theme"`)

### Example

```tsx
const { Provider } = createStoop({
  theme: lightTheme,
  themes: { light: lightTheme, dark: darkTheme },
});

<Provider defaultTheme="light" storageKey="my-app-theme" attribute="data-theme">
  <App />
</Provider>;
```

The Provider:

- Reads initial theme from localStorage
- Updates CSS variables when theme changes (centralized)
- Persists theme changes to localStorage
- Sets HTML attribute on document root
- Uses `useLayoutEffect` to prevent FOUC

---

## `useTheme()` Hook

Hook to access theme management context (only available when `themes` config is provided).

### Returns

Object with theme management methods:

- `theme: Theme` - Current theme object
- `themeName: string` - Current theme name
- `setTheme: (themeName: string) => void` - Function to change theme
- `toggleTheme: () => void` - Function to cycle to next theme
- `availableThemes: readonly string[]` - Array of available theme names

### Example

```tsx
const { useTheme } = createStoop({
  theme: lightTheme,
  themes: { light: lightTheme, dark: darkTheme },
});

function ThemeToggle() {
  const { themeName, toggleTheme, availableThemes } = useTheme();

  return (
    <button onClick={toggleTheme}>Switch to {themeName === "light" ? "dark" : "light"} mode</button>
  );
}
```

**Note**: Must be used within the `Provider` component, otherwise throws an error.

---

## Theme Tokens

Stoop uses `$` prefix for theme tokens, converted to CSS variables.

### Syntax

- **Shorthand**: `$token` (preferred, uses property-aware resolution)
- **Explicit**: `$scale.token` (e.g., `$colors.primary`)

### Examples

```tsx
{
  color: "$text",                    // Property-aware → colors scale
  padding: "$medium",                 // Property-aware → space scale
  padding: "$small $medium",          // Multiple tokens resolved independently
  border: "1px solid $red",          // Token in complex value
  fontSize: "$fontSizes.small",      // Explicit scale
}
```

### Resolution

1. **Explicit scale**: `$colors.primary` → `var(--colors-primary)`
2. **Shorthand with property**: `backgroundColor: "$primary"` → uses `themeMap` → `colors` scale
3. **Shorthand fallback**: searches all categories (backward compatibility)

Property-aware resolution uses `themeMap` or pattern matching. Each property maps to a specific scale, eliminating ambiguity.

CSS variables are injected once in `:root` selector. Prefix affects CSS variable names (e.g., `--my-app-colors-primary`) and class names, but not the selector. Theme switching updates variables, not CSS classes.

---

## Variants

Variants create component variations via props.

### Configuration

```tsx
{
  variantName: {
    option1: { /* CSS */ },
    option2: { /* CSS */ },
    true: { /* CSS for boolean true */ },
    false: { /* CSS for boolean false */ },
  },
}
```

### Usage

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
    disabled: {
      true: { opacity: 0.5, cursor: "not-allowed" },
    },
  },
);

<Button variant="primary" size="large" disabled />;
```

**Note**: Compound variants (variants that depend on multiple props) are not supported.

---

## CSS Object Syntax

### Basic Properties

```tsx
{
  color: "red",
  padding: "10px",
  margin: "10px 20px",
}
```

### Nested Selectors

```tsx
{
  "&:hover": {
    opacity: 0.9,
  },
  "&:focus": {
    outline: "2px solid $primary",
  },
  "> span": {
    color: "$text",
  },
}
```

### Component Targeting

You can target other styled components using the `selector` property:

```tsx
const Button = styled("button", { padding: "$medium" });
const Card = styled("div", {
  [Button.selector]: {
    marginTop: "$small",
  },
});
```

### Media Queries

Using configured media:

```tsx
{
  padding: "$medium",
  mobile: {
    padding: "$small",
  },
  desktop: {
    padding: "$large",
  },
}
```

Using @media syntax:

```tsx
{
  "@media (max-width: 768px)": {
    padding: "$small",
  },
}
```

### Pseudo-classes

```tsx
{
  ":hover": {
    backgroundColor: "$hover",
  },
  ":active": {
    transform: "scale(0.98)",
  },
}
```

## Utility Functions

Stoop provides several utility functions to reduce boilerplate and improve developer experience. These are available as named exports from sub-packages, not the main `stoop` package.

### Theme Detection

#### `detectTheme(options?)`

Automatically detects the best theme to use based on various sources with priority ordering.

```typescript
import { detectTheme } from "stoop/utils/storage";

const result = detectTheme({
  localStorage: "stoop-theme",
  cookie: "stoop-theme",
  systemPreference: true, // Detect dark/light mode
  default: "light",
  themes: { light: lightTheme, dark: darkTheme },
});

console.log(result.theme); // 'dark'
console.log(result.source); // 'system'
console.log(result.confidence); // 0.6
```

**Parameters:**

- `localStorage` (optional): localStorage key to check
- `cookie` (optional): Cookie name to check
- `systemPreference` (optional): Whether to check system color scheme
- `default` (optional): Default theme name
- `themes` (optional): Available themes for validation

**Returns:** `ThemeDetectionResult` with theme name, source, and confidence level.

#### `detectThemeForSSR(options?)`

Theme detection optimized for server-side rendering contexts.

```typescript
import { detectThemeForSSR } from "stoop/utils/storage";

const theme = detectThemeForSSR({
  cookie: "stoop-theme",
  default: "light",
});
```

#### `onSystemThemeChange(callback)`

Listen for system theme changes.

```typescript
import { onSystemThemeChange } from "stoop/utils/storage";

onSystemThemeChange((theme) => {
  console.log("System theme changed to:", theme); // 'dark' or 'light'
});
```

### Storage Management

#### `getStorage(key, options?)`

Unified API for getting values from localStorage or cookies.

```typescript
import { getStorage } from "stoop/utils/storage";

const result = getStorage("theme", { type: "localStorage" });
if (result.success) {
  console.log(result.value);
}
```

#### `setStorage(key, value, options?)`

Unified API for setting values in localStorage or cookies.

```typescript
import { setStorage } from "stoop/utils/storage";

setStorage("theme", "dark", {
  type: "cookie",
  maxAge: 31536000, // 1 year
});
```

#### `createStorage(key, options?)`

Creates a typed storage interface for a specific key.

```typescript
import { createStorage } from "stoop/utils/storage";

const themeStorage = createStorage<string>("theme");
themeStorage.set("dark");
const currentTheme = themeStorage.get();
```

### Auto-Preloading

#### `autoPreload(warmCacheFn, preloadThemeFn, options?)`

Automatically warms cache and preloads themes to eliminate FOUC.

```typescript
import { autoPreload, COMMON_UI_STYLES } from "stoop/utils/auto-preload";

autoPreload(stoop.warmCache, stoop.preloadTheme, {
  themeDetection: {
    localStorage: "stoop-theme",
    systemPreference: true,
  },
  commonStyles: COMMON_UI_STYLES,
}).then((result) => {
  console.log("Cache warmed:", result.cacheWarmed);
  console.log("Theme preloaded:", result.themePreloaded);
});
```

**Parameters:**

- `warmCacheFn`: The `warmCache` function from your Stoop instance
- `preloadThemeFn`: The `preloadTheme` function from your Stoop instance
- `options.themeDetection`: Theme detection options
- `options.commonStyles`: Array of common CSS objects to warm
- `options.enableThemePreload`: Whether to enable theme preloading (default: true)
- `options.enableCacheWarm`: Whether to enable cache warming (default: true)

### Common UI Styles

#### `COMMON_UI_STYLES`

Pre-defined array of commonly used UI component styles for cache warming.

```typescript
import { COMMON_UI_STYLES } from "stoop/utils/auto-preload";

stoop.warmCache(COMMON_UI_STYLES);
```

Includes styles for:

- Layout primitives (flex, position)
- Spacing utilities
- Typography
- Colors (theme tokens)
- Interactive states
- Borders and radii
