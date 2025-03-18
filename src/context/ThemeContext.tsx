"use client";
import React, { createContext, JSX, useContext, useEffect, useState } from "react";

import "../styles/global.scss";

type ThemeMode = "light" | "dark";

type ThemeContextType = {
  mode: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    // Check theme preference
    const stored = localStorage.getItem("theme") as ThemeMode;

    if (stored) {
      setMode(stored);

      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    setMode(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem("theme", mode);
  }, [mode]);

  const toggleTheme = (): void => setMode((prev) => (prev === "light" ? "dark" : "light"));

  return <ThemeContext.Provider value={{ mode, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (!context) throw new Error("useTheme must be used within ThemeProvider");

  return context;
}
