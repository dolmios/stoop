/**
 * Browser-specific CSS injection.
 * Manages a single stylesheet element that gets updated with new CSS rules.
 * Handles theme variable injection, deduplication, and stylesheet lifecycle.
 */
import type { Theme } from "../types";
export declare function getStylesheet(prefix?: string): HTMLStyleElement;
export declare function injectThemeVariables(cssVars: string, theme: Theme, prefix?: string): void;
export declare function registerTheme(theme: Theme, prefix?: string): void;
export declare function updateStylesheet(css: string, ruleKey: string, prefix?: string): void;
export declare function injectBrowserCSS(css: string, ruleKey: string, prefix?: string): void;
export declare function getStylesheetElement(): HTMLStyleElement | null;
export declare function clearStylesheet(): void;
