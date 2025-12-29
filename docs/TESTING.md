# Testing Guide

Comprehensive guide to the Stoop test suite, including how to run tests, test structure, coverage areas, and best practices for writing new tests.

## Overview

The Stoop test suite provides comprehensive coverage of all public APIs, edge cases, error handling, and internal behaviors. All tests use [Bun's built-in test runner](https://bun.sh/docs/cli/test) and React's `renderToString` for SSR testing.

**Test Statistics:**
- **Total Tests:** 138
- **Test Files:** 7
- **Coverage:** All public APIs, edge cases, and internal behaviors

## Running Tests

### Run All Tests

```sh
bun test
```

### Run Specific Test File

```sh
bun test tests/stoop.test.ts
```

### Run Tests in Watch Mode

```sh
bun test --watch
```

### Run Tests with Coverage

```sh
bun test --coverage
```

### Run Tests Matching a Pattern

```sh
bun test --test-name-pattern "should handle theme tokens"
```

## Test File Structure

The test suite is organized into focused test files, each covering specific areas of functionality:

### `stoop.test.ts` - Main API Tests

Tests for the core public APIs and high-level functionality:

- `createStoop` factory function
- `css` function with theme tokens
- `styled` components and variants
- `globalCss` injection
- `keyframes` animations
- `createTheme` theme extension
- `getCssText` SSR support
- `preloadTheme` theme preloading
- `warmCache` cache warming
- Provider and useTheme availability

**Example:**

```ts
it("should generate CSS class names", () => {
  const stoop = createStoop({ theme: createMockTheme() });

  const className = stoop.css({
    color: "red",
    padding: "16px",
  });

  expect(typeof className).toBe("string");
  expect(className.length).toBeGreaterThan(0);
});
```

### `edge-cases.test.ts` - Edge Cases and Error Handling

Tests for error scenarios, invalid inputs, and boundary conditions:

- Invalid inputs (empty objects, null/undefined values)
- Sanitization (CSS injection attempts, dangerous characters)
- Cache behavior (eviction, hits, misses)
- Theme edge cases (missing scales, non-existent tokens)
- Multiple instances (isolation, different prefixes)
- Utility function errors
- SSR edge cases
- Global CSS edge cases
- Keyframes edge cases

**Example:**

```ts
it("should handle null/undefined CSS values gracefully", () => {
  const stoop = createStoop({ theme: createMockTheme() });

  const className = stoop.css({
    color: "red",
    padding: undefined,
    margin: null as any,
  });

  expect(typeof className).toBe("string");
  const cssText = stoop.getCssText();
  expect(cssText).toContain("color");
});
```

### `keyframes-animation.test.ts` - Keyframes Animation Tests

Focused tests for animation functionality:

- Keyframes generation
- Complex transforms and properties
- Theme tokens in keyframes
- Deterministic animation names
- Animation name usage in styled components

**Example:**

```ts
test("should generate valid @keyframes CSS", () => {
  const { keyframes } = createStoop({
    theme: {
      colors: {
        primary: "blue",
      },
    },
  });

  const fadeIn = keyframes({
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    },
  });

  const css = getCssText();
  expect(css).toContain(fadeIn);
  expect(css).toContain("@keyframes");
});
```

### `stability.test.ts` - Stability and Consistency Tests

Tests ensuring stable class names and deterministic behavior:

- Stable class names across multiple renders
- Deterministic class names for identical styles
- Theme changes without class name changes
- Pseudo-selectors consistency
- Nested selectors determinism
- Media queries determinism

**Example:**

```ts
test("should generate stable class names across multiple renders", () => {
  const { styled } = createStoop({
    theme: {
      colors: {
        primary: "blue",
        secondary: "red",
      },
    },
  });

  const Button = styled("button", {
    color: "$primary",
    "&:hover": {
      color: "$secondary",
    },
  });

  const render1 = renderToString(createElement(Button, null, "Click me"));
  const render2 = renderToString(createElement(Button, null, "Click me"));
  const render3 = renderToString(createElement(Button, null, "Click me"));

  const classMatch1 = render1.match(/class="([^"]+)"/);
  const classMatch2 = render2.match(/class="([^"]+)"/);
  const classMatch3 = render3.match(/class="([^"]+)"/);

  expect(classMatch1![1]).toBe(classMatch2![1]);
  expect(classMatch2![1]).toBe(classMatch3![1]);
});
```

### `provider.test.tsx` - Provider and useTheme Tests

Tests for theme management and React context:

- Provider rendering and children
- localStorage persistence
- Theme switching and updates
- Custom attributes
- useTheme hook availability
- Theme context access
- Error handling

**Example:**

```ts
it("should persist theme to localStorage", () => {
  const lightTheme = createMockTheme();
  const darkTheme = {
    colors: { primary: "#ffffff", background: "#000000" },
  };
  const stoop = createStoop({
    theme: lightTheme,
    themes: { light: lightTheme, dark: darkTheme },
  });

  if (!stoop.Provider || !stoop.useTheme) {
    throw new Error("Provider and useTheme should be available");
  }

  const TestComponent = () => {
    const { setTheme } = stoop.useTheme!();
    setTheme("dark");
    return createElement("div", null, "Test");
  };

  renderToString(
    createElement(stoop.Provider, {
      storageKey: "test-theme",
      children: createElement(TestComponent),
    }),
  );

  expect(localStorage.getItem("test-theme")).toBe("dark");
});
```

### `theme-validation.test.ts` - Theme Validation and Utilities

Tests for theme structure, validation, and utility functions:

- Theme structure validation
- Theme merging with `createTheme`
- Utility function application
- Config property exposure

**Example:**

```ts
it("should apply utility functions to CSS", () => {
  const stoop = createStoop({
    theme: createMockTheme(),
    utils: {
      px: (value: string | number | undefined) => {
        const val = typeof value === "string" || typeof value === "number" ? String(value) : "";
        return {
          paddingLeft: val,
          paddingRight: val,
        };
      },
    } as Record<string, UtilityFunction>,
  });

  const className = stoop.css({
    px: "16px",
  });

  expect(typeof className).toBe("string");
  const cssText = stoop.getCssText();
  expect(cssText).toContain("padding-left");
  expect(cssText).toContain("padding-right");
});
```

### `injection.test.ts` - CSS Injection and Deduplication

Tests for CSS injection, deduplication, and SSR behavior:

- CSS deduplication
- Browser injection
- SSR behavior
- `getCssText` functionality
- Rule tracking

**Example:**

```ts
it("should deduplicate identical CSS rules", () => {
  const stoop = createStoop({ theme: createMockTheme() });

  const css1 = { color: "red", padding: "16px" };
  const css2 = { color: "red", padding: "16px" };

  const className1 = stoop.css(css1);
  const className2 = stoop.css(css2);

  expect(className1).toBe(className2);
});
```

### `helpers.ts` - Test Utilities

Shared utilities for test setup:

- `createMockTheme()` - Creates a mock theme for testing

**Example:**

```ts
import { createMockTheme } from "./helpers";

const stoop = createStoop({ theme: createMockTheme() });
```

## Test Coverage Areas

### Core APIs

✅ **Fully Covered:**
- `createStoop` factory function
- `css` function with all token types
- `styled` components with variants
- `globalCss` injection
- `keyframes` animations
- `createTheme` theme extension
- `getCssText` SSR support
- `preloadTheme` theme preloading
- `warmCache` cache warming
- `Provider` component (when themes config provided)
- `useTheme` hook (when themes config provided)
- `config` property
- `theme` property

### Theme System

✅ **Fully Covered:**
- Theme structure validation
- All 13 approved theme scales
- Theme token resolution (shorthand and explicit)
- Theme merging and extension
- Multiple themes support
- Theme switching
- CSS variable generation

### Edge Cases

✅ **Fully Covered:**
- Invalid inputs
- Null/undefined values
- Empty objects
- Missing theme scales
- Non-existent tokens
- Invalid keyframe keys
- Deeply nested CSS
- Invalid selectors
- CSS injection attempts
- Invalid prefix values

### Performance

✅ **Fully Covered:**
- Cache behavior (hits, misses, eviction)
- CSS deduplication
- Class name stability
- Deterministic outputs

### SSR Support

✅ **Fully Covered:**
- `getCssText` in SSR context
- Theme variable inclusion
- CSS text generation
- Theme name/object parameters

### Browser Behavior

✅ **Fully Covered:**
- Stylesheet injection
- Theme variable updates
- localStorage persistence
- Document attribute updates

## Writing New Tests

### Test Structure

Follow this structure for new tests:

```ts
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { createStoop } from "../src/create-stoop";
import { clearStylesheet } from "../src/inject";
import { createMockTheme } from "./helpers";

describe("Feature Name", () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    clearStylesheet();
  });

  describe("Sub-feature", () => {
    it("should do something", () => {
      const stoop = createStoop({ theme: createMockTheme() });
      // Test implementation
    });
  });
});
```

### Best Practices

1. **Always clean up:** Use `clearStylesheet()` in `afterEach` to prevent test pollution
2. **Use helpers:** Use `createMockTheme()` for consistent test themes
3. **Test both success and failure:** Include tests for error cases and edge cases
4. **Test determinism:** Verify that identical inputs produce identical outputs
5. **Test SSR:** Use `renderToString` for React component tests
6. **Test isolation:** Each test should be independent and not rely on other tests
7. **Clear test names:** Use descriptive test names that explain what is being tested

### Example: Adding a New Test

```ts
// In the appropriate test file (e.g., stoop.test.ts)

describe("css", () => {
  it("should handle new feature", () => {
    const stoop = createStoop({ theme: createMockTheme() });

    const className = stoop.css({
      // Your CSS object
    });

    expect(typeof className).toBe("string");
    // Additional assertions
  });
});
```

## Test Utilities

### `createMockTheme()`

Creates a mock theme with common scales for testing:

```ts
import { createMockTheme } from "./helpers";

const theme = createMockTheme();
// Returns:
// {
//   colors: { primary: "#0070f3", secondary: "#666666", ... },
//   space: { small: "8px", medium: "16px", large: "24px" },
//   shadows: { subtle: "...", medium: "..." }
// }
```

### `clearStylesheet()`

Clears the stylesheet and resets internal state:

```ts
import { clearStylesheet } from "../src/inject";

afterEach(() => {
  clearStylesheet();
});
```

## Debugging Tests

### Run Single Test

```sh
bun test --test-name-pattern "should handle theme tokens"
```

### Verbose Output

Bun's test runner provides detailed output by default. For more debugging, add `console.log` statements:

```ts
it("should debug test", () => {
  const stoop = createStoop({ theme: createMockTheme() });
  const className = stoop.css({ color: "red" });
  console.log("Generated class name:", className);
  console.log("CSS text:", stoop.getCssText());
  // ...
});
```

### Check CSS Output

To inspect generated CSS:

```ts
it("should inspect CSS", () => {
  const stoop = createStoop({ theme: createMockTheme() });
  stoop.css({ color: "$colors.primary" });
  const cssText = stoop.getCssText();
  console.log(cssText);
  // Verify CSS content
});
```

## Continuous Integration

Tests run automatically in CI/CD pipelines. Ensure all tests pass before submitting PRs:

```sh
bun test
```

## Coverage Goals

The test suite aims for:

- ✅ **100% coverage** of public APIs
- ✅ **Comprehensive edge case coverage**
- ✅ **Error handling coverage**
- ✅ **SSR behavior coverage**
- ✅ **Browser behavior coverage**
- ✅ **Performance characteristics**

## Contributing Tests

When adding new features:

1. Add tests in the appropriate test file
2. Follow existing test patterns
3. Include edge cases and error handling
4. Ensure all tests pass
5. Update this documentation if adding new test files or utilities

## Related Documentation

- **[API.md](./API.md)** - Complete API reference
- **[GUIDE.md](./GUIDE.md)** - Usage guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Implementation details

