# API Reference

## `createStoop(config)`

Creates a Stoop instance with your theme configuration.

### Parameters

#### `config.theme` (required)

Your theme object containing design tokens. Can include any structure you need:

```tsx
{
  colors: {
    primary: "#0070f3",
    secondary: "#7928ca",
  },
  spacing: {
    small: "8px",
    medium: "16px",
  },
  // ... any other tokens
}
```

#### `config.media` (optional)

Media query breakpoints for responsive styles:

```tsx
{
  mobile: "@media (max-width: 768px)",
  tablet: "@media (min-width: 769px) and (max-width: 1024px)",
  desktop: "@media (min-width: 1025px)",
}
```

#### `config.prefix` (optional)

Prefix for generated CSS class names. Defaults to empty string.

```tsx
{
  prefix: "my-app", // Classes will be: my-app-abc123
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

### Returns

An object containing:

- **`styled`** - Function to create styled components
- **`css`** - Function to create CSS classes
- **`createTheme`** - Function to create additional themes
- **`globalCss`** - Function to create global styles
- **`keyframes`** - Function to create CSS keyframe animations
- **`getCssText`** - Function to get CSS text for SSR
- **`ThemeContext`** - React context for theme access
- **`config`** - Your configuration object

---

## `styled(element, baseStyles?, variants?)`

Creates a styled React component with variant support.

### Parameters

#### `element` (required)

HTML element name as a string: `"div"`, `"button"`, `"span"`, etc.

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

### Example

```tsx
const Button = styled("button", {
  padding: "$medium",
  borderRadius: "8px",
}, {
  variant: {
    primary: { backgroundColor: "$primary" },
  },
});

<Button variant="primary" css={{ marginTop: "10px" }} as="a" href="/">
  Click me
</Button>
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

<div className={className}>Styled content</div>
```

---

## `createTheme(themeOverrides)`

Creates a new theme by extending the base theme.

### Parameters

#### `themeOverrides` (required)

Partial theme object that will be merged with the base theme:

```tsx
{
  colors: {
    primary: "#ff0000", // Overrides base theme's colors.primary
  },
  // Other tokens from base theme are preserved
}
```

### Returns

A new theme object that can be used with `ThemeContext.Provider`.

### Example

```tsx
const darkTheme = createTheme({
  colors: {
    background: "#000000",
    text: "#ffffff",
  },
});

<ThemeContext.Provider value={{ theme: darkTheme }}>
  {/* Components will use dark theme */}
</ThemeContext.Provider>
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

## `getCssText()`

Gets all generated CSS text for server-side rendering.

### Returns

A string containing all CSS that has been generated.

### Example

```tsx
// Server-side
const cssText = getCssText();

// Inject into HTML
<style dangerouslySetInnerHTML={{ __html: cssText }} />
```

---

## Theme Tokens

Stoop uses `$` prefix for theme tokens, which are converted to CSS variables (CSS custom properties) for optimal performance.

### Syntax

- **Full path**: `$category.token` (e.g., `$colors.primary`)
- **Shorthand**: `$token` (e.g., `$primary` - searches all categories)

### Examples

```tsx
{
  // Shorthand (searches all categories - preferred)
  color: "$text",
  padding: "$medium",
  backgroundColor: "$primary",

  // Full path (use when token name exists in multiple categories)
  border: "1px solid $border",
  margin: "$small $large",

  // Example: if both spacing.small and fontSizes.small exist, use full path
  fontSize: "$fontSizes.small", // Explicit when ambiguous
}
```

### Token Resolution

Theme tokens are converted to CSS variables:

1. `$primary` → `var(--colors-primary)` (shorthand finds `colors.primary`)
2. `$medium` → `var(--spacing-medium)` (shorthand finds `spacing.medium`)
3. `$colors.primary` → `var(--colors-primary)` (full path, explicit)
4. CSS variables are injected once in `:root` block
5. Theme switching updates CSS variables, not CSS classes

### Benefits

- **Instant theme switching** - No CSS recompilation needed
- **Better performance** - Browser handles theme updates natively
- **Smaller bundle** - Reduced runtime overhead

---

## Variants

Variants allow you to create component variations through props.

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
const Button = styled("button", {
  // base styles
}, {
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
});

<Button variant="primary" size="large" disabled>Click</Button>
```

### Boolean Variants

Use `true` and `false` keys for boolean variants:

```tsx
{
  disabled: {
    true: { opacity: 0.5 },
    false: { opacity: 1 },
  },
}
```

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

