"use client";

/**
 * Theme management hook.
 * Provides access to theme state and theme switching functions.
 */

import { useContext, type Context } from "react";

import type { ThemeManagementContextValue } from "../types";

/**
 * Creates a useTheme hook for a specific theme management context.
 *
 * @param ThemeManagementContext - React context for theme management
 * @returns Hook function that returns theme management context value
 */
export function createUseThemeHook(
  ThemeManagementContext: Context<ThemeManagementContextValue | null>,
): () => ThemeManagementContextValue {
  return function useTheme(): ThemeManagementContextValue {
    const context = useContext(ThemeManagementContext);

    if (!context) {
      throw new Error("useTheme must be used within a Provider");
    }

    return context;
  };
}
