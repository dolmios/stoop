/**
 * Theme variable management.
 * Updates CSS custom properties when theme changes.
 * Ensures CSS variables are injected and kept in sync with theme updates.
 */
import type { Theme } from "../types";
export declare function updateThemeVariables(theme: Theme, prefix?: string): void;
