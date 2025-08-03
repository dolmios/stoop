import { createContext, useContext, useEffect, useState, type JSX, type ReactNode } from "react";

import type { ThemeName, Theme } from "../../styles/types";

import { themes, lightTheme } from "../../styles/theme";
import { injectGlobalStyles } from "./GlobalStyles";

// Provider configuration
export interface StoopProviderConfig {
  /** Whether to inject global styles and CSS reset */
  injectGlobalStyles?: boolean;
  /** Custom CSS to inject */
  customCSS?: string;
  /** Initial theme (defaults to 'light') */
  theme?: ThemeName;
}

// Context for Stoop UI configuration and theming
interface StoopContextValue extends StoopProviderConfig {
  currentTheme: Theme;
  themeName: ThemeName;
  toggleTheme: () => void;
  setTheme: (theme: ThemeName) => void;
}

const StoopContext = createContext<StoopContextValue>({
  currentTheme: lightTheme,
  injectGlobalStyles: true,
  setTheme: () => {},
  theme: "light",
  themeName: "light",
  toggleTheme: () => {},
});

// Provider props
export interface StoopProviderProps {
  children: ReactNode;
  config?: StoopProviderConfig;
}

// Helper functions for theme persistence
function getStoredTheme(): ThemeName | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("stoop-theme") as ThemeName;
  } catch {
    return null;
  }
}

function storeTheme(theme: ThemeName): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("stoop-theme", theme);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Stoop UI Provider - Sets up global styles, configuration, and theming
 * Wrap your app with this component to enable Stoop UI components
 * Theme choice persists across browser sessions
 */
export function StoopProvider({
  children,
  config = { injectGlobalStyles: true, theme: "light" },
}: StoopProviderProps): JSX.Element {
  // Initialize theme from localStorage or config
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    const stored = getStoredTheme();

    return stored || config.theme || "light";
  });
  const currentTheme = themes[themeName];

  const toggleTheme = (): void => {
    setThemeName((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";

      storeTheme(newTheme);

      return newTheme;
    });
  };

  const setTheme = (theme: ThemeName): void => {
    setThemeName(theme);
    storeTheme(theme);
  };

  const contextValue: StoopContextValue = {
    ...config,
    currentTheme,
    setTheme,
    themeName,
    toggleTheme,
  };

  useEffect(() => {
    // Inject global styles if enabled
    if (config.injectGlobalStyles !== false) {
      injectGlobalStyles(currentTheme);
    }

    // Inject custom CSS if provided
    if (config.customCSS) {
      const style = document.createElement("style");

      style.id = "stoop-custom-styles";
      style.textContent = config.customCSS;
      document.head.appendChild(style);

      // Cleanup function
      return (): void => {
        const existingStyle = document.getElementById("stoop-custom-styles");

        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [config.injectGlobalStyles, config.customCSS, currentTheme]);

  // Add theme class to document body for CSS targeting
  useEffect(() => {
    document.body.setAttribute("data-theme", themeName);

    return (): void => {
      document.body.removeAttribute("data-theme");
    };
  }, [themeName]);

  return <StoopContext.Provider value={contextValue}>{children}</StoopContext.Provider>;
}

/**
 * Hook to access Stoop UI configuration
 */
export function useStoopConfig(): StoopContextValue {
  const context = useContext(StoopContext);

  if (!context) {
    throw new Error("useStoopConfig must be used within a StoopProvider");
  }

  return context;
}

/**
 * Hook to access current theme and theme controls
 */
export function useTheme(): {
  theme: Theme;
  themeName: ThemeName;
  toggleTheme: () => void;
  setTheme: (theme: ThemeName) => void;
} {
  const context = useContext(StoopContext);

  if (!context) {
    throw new Error("useTheme must be used within a StoopProvider");
  }

  return {
    setTheme: context.setTheme,
    theme: context.currentTheme,
    themeName: context.themeName,
    toggleTheme: context.toggleTheme,
  };
}

// Export the context for advanced use cases
export { StoopContext };
