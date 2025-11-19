/**
 * CSS injection public API.
 * Composes browser, SSR, and deduplication modules into a unified interface.
 * Provides single stylesheet injection with automatic SSR support.
 */

import type { Theme } from "../types";

import { clearStyleCache } from "../core/cache";
import * as browser from "./browser";
import * as dedup from "./dedup";
import * as ssr from "./ssr";

export { isInjectedRule } from "./dedup";

/**
 * Injects CSS into the document with automatic SSR support.
 *
 * @param css - CSS string to inject
 * @param prefix - Optional prefix for CSS rules
 * @param ruleKey - Optional unique key for deduplication
 */
export function injectCSS(css: string, prefix = "", ruleKey?: string): void {
  const key = ruleKey || css;

  if (typeof document === "undefined") {
    if (!dedup.isInjectedRule(key)) {
      dedup.markRuleAsInjected(key, css);
    }

    ssr.addToSSRCache(css);

    return;
  }

  browser.injectBrowserCSS(css, key, prefix);
}

/**
 * Injects theme CSS variables into the document.
 *
 * @param cssVars - CSS variables string
 * @param theme - Theme object
 * @param prefix - Optional prefix for CSS variables
 */
export function injectThemeVariables(cssVars: string, theme: Theme, prefix = ""): void {
  browser.injectThemeVariables(cssVars, theme, prefix);
}

/**
 * Registers a theme for injection.
 * Automatically ensures stylesheet exists and injects theme variables.
 *
 * @param theme - Theme object to register
 * @param prefix - Optional prefix for CSS variables
 */
export function registerTheme(theme: Theme, prefix = ""): void {
  browser.registerTheme(theme, prefix);
}

/**
 * Gets all injected CSS text (browser or SSR).
 *
 * @returns CSS text string
 */
export function getCssText(): string {
  if (typeof document !== "undefined") {
    const sheetElement = browser.getStylesheetElement();

    if (sheetElement && sheetElement.parentNode) {
      const sheetCSS = sheetElement.textContent || "";

      if (!sheetCSS && dedup.getAllInjectedRules().size > 0) {
        return ssr.getSSRCacheText();
      }

      return sheetCSS;
    }
  }

  return ssr.getSSRCacheText();
}

/**
 * Clears all injected CSS and caches.
 */
export function clearStylesheet(): void {
  browser.clearStylesheet();
  dedup.clearInjectedRules();
  ssr.clearSSRCache();
  clearStyleCache();
}
