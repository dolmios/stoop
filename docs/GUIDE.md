# Getting Started Guide

This guide will walk you through setting up Stoop in your React application.

## Installation

```sh
npm install stoop
# or
bun add stoop
# or
yarn add stoop
```

## Step 1: Create Your Theme

Create a file `theme.ts` (or `theme.js`) to define your Stoop instance:

```tsx
// theme.ts
import { createStoop } from "stoop";

const { styled, css, createTheme, globalCss, keyframes, ThemeContext } = createStoop({
  theme: {
    colors: {
      primary: "#0070f3",
      secondary: "#7928ca",
      background: "#ffffff",
      text: "#000000",
      border: "#eaeaea",
    },
    spacing: {
      small: "8px",
      medium: "16px",
      large: "24px",
      xlarge: "32px",
    },
    fonts: {
      body: "system-ui, sans-serif",
      heading: "Georgia, serif",
    },
    fontSizes: {
      small: "14px",
      medium: "16px",
      large: "20px",
      xlarge: "24px",
    },
  },
  media: {
    mobile: "@media (max-width: 768px)",
    tablet: "@media (min-width: 769px) and (max-width: 1024px)",
    desktop: "@media (min-width: 1025px)",
  },
});

// Create dark theme
const darkTheme = createTheme({
  colors: {
    primary: "#3291ff",
    background: "#000000",
    text: "#ffffff",
    border: "#333333",
  },
});

export { styled, css, createTheme, globalCss, keyframes, ThemeContext, darkTheme };
```

## Step 2: Create a Theme Provider

Create a `Provider.tsx` file to manage theme switching:

```tsx
// Provider.tsx
"use client"; // If using Next.js App Router

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeContext as StoopThemeContext, darkTheme } from "./theme";

type ThemeName = "light" | "dark";

interface ThemeContextValue {
  theme: any;
  themeName: ThemeName;
  toggleTheme: () => void;
  setTheme: (theme: ThemeName) => void;
}

const ThemeManagementContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState<ThemeName>("light");
  const currentTheme = themeName === "dark" ? darkTheme : {};

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      setThemeName(stored);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = themeName === "light" ? "dark" : "light";
    setThemeName(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const setTheme = (theme: ThemeName) => {
    setThemeName(theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <StoopThemeContext.Provider value={{ theme: currentTheme }}>
      <ThemeManagementContext.Provider
        value={{ theme: currentTheme, themeName, toggleTheme, setTheme }}
      >
        {children}
      </ThemeManagementContext.Provider>
    </StoopThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeManagementContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

## Step 3: Set Up Global Styles

Create global styles in your app entry point:

```tsx
// app.tsx or _app.tsx
import { globalCss } from "./theme";

const globalStyles = globalCss({
  "*": {
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  body: {
    fontFamily: "$body",
    backgroundColor: "$background",
    color: "$text",
    lineHeight: 1.5,
  },
});

globalStyles();
```

## Step 4: Create Styled Components

Now you can create styled components:

```tsx
// components/Button.tsx
import { styled } from "../theme";

export const Button = styled("button", {
  padding: "$medium $large",
  borderRadius: "8px",
  border: "1px solid $border",
  backgroundColor: "$background",
  color: "$text",
  cursor: "pointer",
  fontFamily: "$body",
  fontSize: "$medium",
  transition: "all 0.2s",
  "&:hover": {
    backgroundColor: "$border",
  },
  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
}, {
  variant: {
    primary: {
      backgroundColor: "$primary",
      color: "#ffffff",
      borderColor: "$primary",
      "&:hover": {
        backgroundColor: "#0051cc",
      },
    },
    secondary: {
      backgroundColor: "$secondary",
      color: "#ffffff",
      borderColor: "$secondary",
    },
  },
  size: {
    small: {
      padding: "$small $medium",
      fontSize: "$small",
    },
    large: {
      padding: "$large $xlarge",
      fontSize: "$large",
    },
  },
});
```

## Step 5: Use Your Components

```tsx
// pages/index.tsx or app/page.tsx
import { ThemeProvider, useTheme } from "./Provider";
import { Button } from "./components/Button";

function HomePage() {
  const { themeName, toggleTheme } = useTheme();

  return (
    <div>
      <h1>My App</h1>
      <Button variant="primary" size="large">
        Click me
      </Button>
      <Button variant="secondary" size="small">
        Secondary
      </Button>
      <button onClick={toggleTheme}>
        Switch to {themeName === "light" ? "dark" : "light"} mode
      </button>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <HomePage />
    </ThemeProvider>
  );
}
```

## Next.js Integration

### Pages Router

```tsx
// pages/_app.tsx
import { ThemeProvider } from "../components/Provider";
import { globalCss } from "../theme";

const globalStyles = globalCss({
  "*": { margin: 0, padding: 0, boxSizing: "border-box" },
  body: { fontFamily: "system-ui, sans-serif" },
});

globalStyles();

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

### App Router

```tsx
// app/layout.tsx
"use client";

import { ThemeProvider } from "../components/Provider";
import { globalCss } from "../theme";

const globalStyles = globalCss({
  "*": { margin: 0, padding: 0, boxSizing: "border-box" },
  body: { fontFamily: "system-ui, sans-serif" },
});

globalStyles();

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

## Best Practices

### 1. Organize Your Theme

Keep your theme organized by category:

```tsx
theme: {
  colors: { /* ... */ },
  spacing: { /* ... */ },
  typography: { /* ... */ },
  // etc.
}
```

### 2. Use Theme Tokens

Always use theme tokens instead of hardcoded values:

```tsx
// Good
padding: "$medium",
color: "$text",

// Bad
padding: "16px",
color: "#000000",
```

### 3. Create Reusable Components

Create base components with variants:

```tsx
const Button = styled("button", baseStyles, variants);
const Card = styled("div", baseStyles, variants);
```

### 4. Use CSS Prop Sparingly

The `css` prop is useful for one-off styles, but prefer variants for reusable patterns:

```tsx
// Good - use variant
<Button variant="primary" />

// OK - one-off style
<Button css={{ marginTop: "20px" }} />
```

### 5. Theme Switching

Stoop uses CSS variables for theme tokens, enabling instant theme switching without recompiling CSS. Simply update the theme in your Provider:

```tsx
// Theme switching is instant - CSS variables update automatically
const currentTheme = themeName === "dark" ? darkTheme : lightTheme;

return (
  <StoopThemeContext.Provider value={{ theme: currentTheme }}>
    {children}
  </StoopThemeContext.Provider>
);
```

Store theme preference in localStorage and restore on mount:

```tsx
useEffect(() => {
  const stored = localStorage.getItem("theme");
  if (stored) setThemeName(stored);
}, []);
```

## Utility Functions

Utility functions allow you to create shorthand properties for common CSS patterns. They're applied before theme token resolution, so you can use theme tokens in utility values.

### Setting Up Utilities

```tsx
const { styled, css } = createStoop({
  theme: {
    spacing: {
      small: "8px",
      medium: "16px",
      large: "24px",
    },
  },
  utils: {
    // Padding utilities
    px: (value) => ({ paddingLeft: value, paddingRight: value }),
    py: (value) => ({ paddingTop: value, paddingBottom: value }),
    p: (value) => ({ padding: value }),

    // Margin utilities
    mx: (value) => ({ marginLeft: value, marginRight: value }),
    my: (value) => ({ marginTop: value, marginBottom: value }),
    m: (value) => ({ margin: value }),

    // Size utilities
    w: (value) => ({ width: value }),
    h: (value) => ({ height: value }),
  },
});
```

### Using Utilities

```tsx
const Button = styled("button", {
  px: "$medium", // paddingLeft and paddingRight
  py: "$small",  // paddingTop and paddingBottom
  mx: "auto",    // marginLeft and marginRight
});

// Utilities work in variants too
const Card = styled("div", {
  p: "$medium",
}, {
  size: {
    large: {
      px: "$large",
      py: "$medium",
    },
  },
});
```

## Common Patterns

### Responsive Design

```tsx
const Container = styled("div", {
  padding: "$medium",
  mobile: {
    padding: "$small",
  },
  desktop: {
    padding: "$large",
  },
});
```

### Polymorphic Components

```tsx
const Text = styled("p", {
  fontSize: "$medium",
});

// Use as different elements
<Text as="h1">Heading</Text>
<Text as="span">Inline text</Text>
```

### Conditional Styles

```tsx
const Button = styled("button", {
  // base styles
}, {
  disabled: {
    true: { opacity: 0.5, cursor: "not-allowed" },
  },
});

<Button disabled={isLoading}>Submit</Button>
```

## Troubleshooting

### Styles not applying

- Make sure `ThemeProvider` wraps your app
- Check that theme tokens are correctly referenced with `$` prefix
- Verify theme structure matches token references

### Type errors

- Ensure TypeScript is configured correctly
- Check that theme types match your usage
- Use `as` prop for polymorphic components

### Theme not switching

- Verify `ThemeContext.Provider` receives the correct theme
- Check localStorage for stored theme preference
- Ensure theme object structure matches base theme
- CSS variables update automatically when theme changes - no manual recompilation needed

