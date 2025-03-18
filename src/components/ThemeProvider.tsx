"use client";
import React, { type JSX, createContext, useContext, useEffect, useState } from "react";

import "../styles/globals.css";

type ThemeMode = "light" | "dark";

type ThemeContextType = {
  mode: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<ThemeMode>("light");

  // Initialize theme on client-side only
  useEffect(() => {
    const stored = localStorage.getItem("theme") as ThemeMode;

    if (stored) {
      setMode(stored);
      setMounted(true);

      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    setMode(prefersDark ? "dark" : "light");
    setMounted(true);
  }, []);

  // Update theme
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem("theme", mode);
  }, [mode, mounted]);

  const toggleTheme = (): void => setMode((prev) => (prev === "light" ? "dark" : "light"));

  if (!mounted) {
    return <> </>;
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
