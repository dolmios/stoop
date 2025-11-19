# Getting Started Guide

Step-by-step guide for setting up Stoop in your React application. For API details, see [API.md](./API.md).

## Installation

```sh
npm install stoop
# or
bun add stoop
# or
yarn add stoop
```

## Step 1: Create Your Theme

Create `theme.ts` to define your Stoop instance:

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
    space: {
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
    // Only these 12 scales are allowed:
    // colors, opacities, space, radii, sizes, fonts, fontWeights, fontSizes,
    // letterSpacings, shadows, zIndices, transitions
  },
  media: {
    mobile: "@media (max-width: 768px)",
    tablet: "@media (min-width: 769px) and (max-width: 1024px)",
    desktop: "@media (min-width: 1025px)",
  },
});

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

## Step 2: Create Theme Provider

Create `Provider.tsx` to manage theme switching:

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

## Step 5: Use Components

```tsx
// pages/index.tsx or app/page.tsx
import { ThemeProvider, useTheme } from "./Provider";
import { Button } from "./components/Button";

function HomePage() {
  const { themeName, toggleTheme } = useTheme();

  return (
    <div>
      <h1>My App</h1>
      <Button variant="primary" size="large">Click me</Button>
      <Button variant="secondary" size="small">Secondary</Button>
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

Enhanced SSR support with built-in Provider and FOUC prevention.

### Step 1: Create Stoop Instance with Themes

```tsx
// theme.ts
import { createStoop } from "stoop";

const lightTheme = {
  colors: {
    primary: "#0070f3",
    background: "#ffffff",
    text: "#000000",
  },
  space: {
    small: "8px",
    medium: "16px",
  },
};

const darkTheme = {
  colors: {
    primary: "#3291ff",
    background: "#000000",
    text: "#ffffff",
  },
  space: {
    small: "8px",
    medium: "16px",
  },
};

export const {
  styled,
  css,
  globalCss,
  getCssText,
  Provider,
  useTheme,
  preloadTheme,
} = createStoop({
  theme: lightTheme,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
});

export const globalStyles = globalCss({
  "*": { margin: 0, padding: 0, boxSizing: "border-box" },
  body: {
    fontFamily: "system-ui, sans-serif",
    backgroundColor: "$background",
    color: "$text",
  },
});
```

### App Router (Recommended)

**With SSR and FOUC Prevention:**

```tsx
// app/layout.tsx
import { cookies } from 'next/headers';
import { Provider, getServerStyles, globalStyles } from './theme';

// Call globalStyles() at module level
globalStyles();

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  // Detect theme from cookies on server
  const cookieStore = cookies();
  const themeCookie = cookieStore.get('theme');
  const initialTheme = themeCookie?.value || 'light';

  // Generate SSR styles with initial theme
  const cssText = getCssText(initialTheme);

  return (
    <html lang="en" data-theme={initialTheme}>
      <head>
        {/* Inject SSR styles with theme variables - prevents FOUC */}
        <style dangerouslySetInnerHTML={{ __html: cssText }} />
      </head>
      <body>
        <Provider defaultTheme={initialTheme} storageKey="theme">
          {children}
        </Provider>
      </body>
    </html>
  );
}
```

**Client Component for Theme Toggle:**

```tsx
// app/components/ThemeToggle.tsx
"use client";

import { useTheme } from '../theme';

export function ThemeToggle() {
  const { themeName, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = themeName === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // Update cookie for SSR
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
  };

  return (
    <button onClick={toggleTheme}>
      Switch to {themeName === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}
```

### Pages Router

**With SSR and FOUC Prevention:**

```tsx
// pages/_document.tsx
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { getServerStyles } from '../theme';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    // Detect theme from cookies
    const themeCookie = ctx.req?.headers.cookie
      ?.split('; ')
      .find(c => c.startsWith('theme='))
      ?.split('=')[1];

    const initialTheme = themeCookie || 'light';
    const cssText = getCssText(initialTheme);

    return {
      ...initialProps,
      cssText,
      initialTheme,
    };
  }

  render() {
    const { cssText, initialTheme } = this.props as any;

    return (
      <Html data-theme={initialTheme}>
        <Head>
          {/* Inject SSR styles - prevents FOUC */}
          <style dangerouslySetInnerHTML={{ __html: cssText }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { Provider, globalStyles } from '../theme';

// Call globalStyles() at module level
globalStyles();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider defaultTheme="light" storageKey="theme">
      <Component {...pageProps} />
    </Provider>
  );
}
```

**Theme Toggle Component:**

```tsx
// components/ThemeToggle.tsx
import { useTheme } from '../theme';

export function ThemeToggle() {
  const { themeName, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = themeName === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // Update cookie for SSR
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
  };

  return (
    <button onClick={toggleTheme}>
      Switch to {themeName === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}
```

### Client-Side Only (No SSR)

If you don't need SSR, you can use the simpler client-side approach:

```tsx
// app/layout.tsx (App Router)
"use client";

import { Provider, globalStyles } from './theme';

globalStyles();

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider defaultTheme="light" storageKey="theme">
          {children}
        </Provider>
      </body>
    </html>
  );
}
```

### Advanced: Prevent FOUC on Client-Side Navigation

For client-side apps (SPA) or when not using SSR, prevent FOUC by preloading the theme before React renders:

```tsx
// main.tsx or index.tsx (Vite/CRA)
import { createRoot } from 'react-dom/client';
import { preloadTheme } from './theme';
import App from './App';

// Preload saved theme BEFORE React renders - prevents FOUC
try {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    preloadTheme(savedTheme);
  }
} catch {}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
```

### Middleware for Theme Detection (Advanced)

For more sophisticated theme detection (e.g., respecting system preferences), use Next.js middleware:

```tsx
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Check if theme cookie exists
  const themeCookie = request.cookies.get('theme');

  if (!themeCookie) {
    // Detect system preference from headers (if available)
    const colorScheme = request.headers.get('sec-ch-prefers-color-scheme');
    const defaultTheme = colorScheme === 'dark' ? 'dark' : 'light';

    // Set cookie
    response.cookies.set('theme', defaultTheme, {
      path: '/',
      maxAge: 31536000, // 1 year
    });
  }

  return response;
}
```

## Best Practices

### Use Theme Tokens

Always use theme tokens instead of hardcoded values:

```tsx
// Good
padding: "$medium",
color: "$text",

// Bad
padding: "16px",
color: "#000000",
```

### Organize Theme by Scales

Only these 12 scales are allowed: `colors`, `opacities`, `space`, `radii`, `sizes`, `fonts`, `fontWeights`, `fontSizes`, `letterSpacings`, `shadows`, `zIndices`, `transitions`.

### Prefer Variants Over CSS Prop

Use variants for reusable patterns, `css` prop for one-off styles:

```tsx
// Good - use variant
<Button variant="primary" />

// OK - one-off style
<Button css={{ marginTop: "20px" }} />
```

### Theme Switching

CSS variables enable instant theme switching. Update theme in Provider:

```tsx
const currentTheme = themeName === "dark" ? darkTheme : {};
<StoopThemeContext.Provider value={{ theme: currentTheme }}>
```

## Utility Functions

Utilities create shorthand properties. Applied before theme token resolution:

```tsx
const { styled } = createStoop({
  theme: { space: { medium: "16px" } },
  utils: {
    px: (value) => ({ paddingLeft: value, paddingRight: value }),
    py: (value) => ({ paddingTop: value, paddingBottom: value }),
  },
});

const Button = styled("button", {
  px: "$medium", // paddingLeft and paddingRight
  py: "$small",  // paddingTop and paddingBottom
});
```

## Common Patterns

### Responsive Design

```tsx
const Container = styled("div", {
  padding: "$medium",
  mobile: { padding: "$small" },
  desktop: { padding: "$large" },
});
```

### Polymorphic Components

```tsx
const Text = styled("p", { fontSize: "$medium" });

<Text as="h1">Heading</Text>
<Text as="span">Inline text</Text>
```

### Boolean Variants

```tsx
const Button = styled("button", {}, {
  disabled: {
    true: { opacity: 0.5, cursor: "not-allowed" },
  },
});

<Button disabled={isLoading}>Submit</Button>
```

## Troubleshooting

**Styles not applying:**
- Ensure `ThemeProvider` wraps your app
- Verify theme tokens use `$` prefix
- Check theme structure matches token references

**Type errors:**
- Verify TypeScript configuration
- Check theme types match usage
- Use `as` prop for polymorphic components

**Theme not switching:**
- Verify `ThemeContext.Provider` receives correct theme
- Check localStorage for stored preference
- Ensure theme structure matches base theme
