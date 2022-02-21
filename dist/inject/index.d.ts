/**
 * CSS injection public API.
 * Composes browser, SSR, and deduplication modules into a unified interface.
 * Provides single stylesheet injection with automatic SSR support.
 */
import type { Theme } from "../types";
export { hasInjectedRule } from "./dedup";
export declare function injectCSS(css: string, prefix?: string, ruleKey?: string): void;
export declare function injectThemeVariables(cssVars: string, theme: Theme, prefix?: string): void;
export declare function registerTheme(theme: Theme, prefix?: string): void;
export declare function getCssText(): string;
export declare function clearStylesheet(): void;
