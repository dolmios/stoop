# API Reference

## `styled(element, baseStyles?, variants?)`

Creates a styled component. Must be compiled by the SWC plugin.

### Parameters

- `element` - HTML element name (e.g., `'button'`, `'div'`)
- `baseStyles` - Base CSS styles object (optional)
- `variants` - Variant definitions object (optional)

### Returns

A React component with variant props.

### Example

```typescript
const Button = styled(
  "button",
  {
    padding: "$md",
    backgroundColor: "$primary",
  },
  {
    size: {
      sm: { padding: "$sm" },
      lg: { padding: "$lg" },
    },
  },
);
```

## `ThemeProvider`

Provides theme context for theme switching.

### Props

- `children` - React children
- `defaultTheme` - Default theme name (default: `'light'`)
- `storageKey` - localStorage key for theme persistence (default: `'stoop-theme'`)

### Example

```typescript
<ThemeProvider defaultTheme="light" storageKey="my-theme">
  <App />
</ThemeProvider>
```

## `useTheme()`

Hook to access and change theme.

### Returns

```typescript
{
  theme: string;
  setTheme: (theme: string) => void;
}
```

### Example

```typescript
const { theme, setTheme } = useTheme();
```

## `clsx(...classes)`

Utility function for joining class names.

### Parameters

- `...classes` - Class name values (strings, numbers, booleans, null, undefined)

### Returns

Joined class name string.

### Example

```typescript
clsx("a", "b", "c"); // 'a b c'
clsx("a", false, "b"); // 'a b'
```

## Configuration

### Theme Structure

```typescript
{
  theme: {
    colors?: Record<string, string>;
    space?: Record<string, string>;
    fontSizes?: Record<string, string>;
    fontWeights?: Record<string, string>;
    // ... other scales
  },
  themes?: Record<string, Partial<Theme>>;
  media?: Record<string, string>;
  output?: {
    dir?: string;
    filename?: string;
  };
  prefix?: string;
}
```

### Token Syntax

- `$token` - Shorthand token (resolved by property context)
- `$scale.token` - Explicit token (e.g., `$colors.primary`)

### Variants

Variants are defined as nested objects:

```typescript
{
  variantName: {
    valueName: {
      // styles
    }
  }
}
```
