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

export { hasInjectedRule } from "./dedup";

export function injectCSS(css: string, prefix = "", ruleKey?: string): void {
  const key = ruleKey || css;

  if (typeof document === "undefined") {
    if (!dedup.isRuleInjected(key)) {
      dedup.markRuleAsInjected(key, css);
    }

    ssr.addToSSRCache(css);

    return;
  }

  browser.injectBrowserCSS(css, key, prefix);
}

export function injectThemeVariables(cssVars: string, theme: Theme, prefix = ""): void {
  browser.injectThemeVariables(cssVars, theme, prefix);
}

export function registerTheme(theme: Theme, prefix = ""): void {
  browser.registerTheme(theme, prefix);
}

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

export function clearStylesheet(): void {
  browser.clearStylesheet();
  dedup.clearInjectedRules();
  ssr.clearSSRCache();
  clearStyleCache();
}
