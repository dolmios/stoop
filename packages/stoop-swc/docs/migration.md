# Migration Guide: stoop to stoop-swc

This guide helps you migrate from runtime `stoop` to build-time `stoop-swc`.

## Key Differences

- **Build-time compilation**: CSS is generated at build time, not runtime
- **Static CSS files**: Styles are written to `.stoop/styles.css`
- **No runtime CSS injection**: No need for `getCssText()` or SSR CSS injection
- **Smaller runtime**: <2KB runtime bundle

## Migration Steps

### 1. Install stoop-swc

```bash
npm install stoop-swc
```

### 2. Create Theme Configuration

Extract your theme from `createStoop()` call to `styled.config.ts`:

**Before:**

```typescript
const { styled } = createStoop({
  theme: { ... },
  themes: { ... },
});
```

**After:**

```typescript
// styled.config.ts
export default {
  theme: { ... },
  themes: { ... },
};
```

### 3. Configure Build Tool

**Next.js:**

Update `next.config.mjs`:

```javascript
experimental: {
  swcPlugins: [["stoop-swc/compiler", {}]];
}
```

**Vite:**

Update `vite.config.ts`:

```typescript
plugins: [
  react({
    plugins: [["stoop-swc/compiler", {}]],
  }),
];
```

### 4. Update Imports

**Before:**

```typescript
import { styled } from "./theme";
import { ThemeProvider } from "./theme";
```

**After:**

```typescript
import { styled } from "stoop-swc/runtime";
import { ThemeProvider } from "stoop-swc/runtime";
```

### 5. Import Generated CSS

**Before:**

```typescript
// SSR CSS injection
import { getCssText } from './theme';
useServerInsertedHTML(() => {
  return <style dangerouslySetInnerHTML={{ __html: getCssText() }} />;
});
```

**After:**

```typescript
// Static CSS import
import "../.stoop/styles.css";
```

### 6. Update ThemeProvider

**Before:**

```typescript
<ThemeProvider cookieKey="..." defaultTheme="light">
```

**After:**

```typescript
<ThemeProvider defaultTheme="light" storageKey="stoop-theme">
```

## Component API

The `styled()` API remains the same:

```typescript
const Button = styled(
  "button",
  {
    padding: "$md",
  },
  {
    size: {
      sm: { padding: "$sm" },
    },
  },
);
```

## Breaking Changes

1. **No runtime CSS compilation**: `css()` function must be used at build time
2. **No `getCssText()`**: CSS is generated as static file
3. **No `globalCss()`**: Global styles must be added manually to CSS file (future feature)
4. **No utilities at runtime**: Utilities are resolved at build time

## Troubleshooting

### CSS not appearing

- Ensure `.stoop/styles.css` is imported in your root layout
- Check that SWC plugin is configured correctly
- Verify `styled.config.ts` exists in project root

### Theme not switching

- Ensure ThemeProvider wraps your app
- Check that `data-theme` attribute is set on `<html>` element
- Verify theme names match in config

### Build errors

- Ensure Rust toolchain is installed (for SWC plugin compilation)
- Check that all `styled()` calls are in files processed by SWC
- Verify theme tokens are defined in config
