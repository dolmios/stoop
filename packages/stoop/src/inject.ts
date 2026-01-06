/**
 * CSS injection implementation.
 * Consolidates browser-specific and SSR-specific CSS injection logic.
 * Handles stylesheet management, theme variable injection, deduplication, and SSR caching.
 */

import type { Theme } from "./types";

import { MAX_CSS_CACHE_SIZE } from "./constants";
import { LRUCache, clearStyleCache } from "./core/cache";
import { isBrowser } from "./utils/helpers";
import { getRootRegex, sanitizePrefix } from "./utils/theme-utils";

// ============================================================================
// Internal Deduplication
// ============================================================================

const injectedRules = new Map<string, string>();

/**
 * Checks if a CSS rule has already been injected.
 *
 * @param key - Rule key to check
 * @returns True if rule is already injected
 */
export function isInjectedRule(key: string): boolean {
  return injectedRules.has(key);
}

/**
 * Marks a CSS rule as injected.
 *
 * @param key - Rule key
 * @param css - CSS string
 */
export function markRuleAsInjected(key: string, css: string): void {
  injectedRules.set(key, css);
}

// ============================================================================
// SSR Cache Management
// ============================================================================

const cssTextCache = new LRUCache<string, boolean>(MAX_CSS_CACHE_SIZE);

/**
 * Adds CSS to the SSR cache with LRU eviction.
 *
 * @param css - CSS string to cache
 */
export function addToSSRCache(css: string): void {
  if (!cssTextCache.has(css)) {
    cssTextCache.set(css, true);
  }
}

/**
 * Gets all cached CSS text for SSR.
 *
 * @returns Joined CSS text string
 */
export function getSSRCacheText(): string {
  return Array.from(cssTextCache.keys()).join("\n");
}

/**
 * Clears the SSR cache.
 */
export function clearSSRCache(): void {
  cssTextCache.clear();
}

/**
 * Checks if CSS is already in the SSR cache.
 *
 * @param css - CSS string to check
 * @returns True if CSS is cached
 */
export function isInSSRCache(css: string): boolean {
  return cssTextCache.has(css);
}

// ============================================================================
// Browser-Specific Injection
// ============================================================================

const stylesheetElements = new Map<string, HTMLStyleElement>();
const lastInjectedThemes = new Map<string, Theme>();
const lastInjectedCSSVars = new Map<string, string>();

/**
 * Gets or creates the stylesheet element for CSS injection.
 * Reuses the SSR stylesheet if it exists to prevent FOUC.
 *
 * @param prefix - Optional prefix for stylesheet identification
 * @returns HTMLStyleElement
 * @throws Error if called in SSR context
 */
export function getStylesheet(prefix = "stoop"): HTMLStyleElement {
  if (!isBrowser()) {
    throw new Error("Cannot access document in SSR context");
  }

  const sanitizedPrefix = sanitizePrefix(prefix);
  let stylesheetElement = stylesheetElements.get(sanitizedPrefix);

  if (!stylesheetElement || !stylesheetElement.parentNode) {
    const ssrStylesheet = document.getElementById("stoop-ssr") as HTMLStyleElement | null;

    if (ssrStylesheet) {
      const existingPrefix = ssrStylesheet.getAttribute("data-stoop");

      if (!existingPrefix || existingPrefix === sanitizedPrefix) {
        stylesheetElement = ssrStylesheet;
        stylesheetElement.setAttribute("data-stoop", sanitizedPrefix);
        stylesheetElements.set(sanitizedPrefix, stylesheetElement);

        return stylesheetElement;
      }
    }

    stylesheetElement = document.createElement("style");
    stylesheetElement.setAttribute("data-stoop", sanitizedPrefix);
    stylesheetElement.setAttribute("id", `stoop-${sanitizedPrefix}`);
    document.head.appendChild(stylesheetElement);
    stylesheetElements.set(sanitizedPrefix, stylesheetElement);
  }

  return stylesheetElement;
}

/**
 * Removes all theme variable blocks (both :root and attribute selectors) from CSS.
 *
 * @param css - CSS string to clean
 * @returns CSS string without theme variable blocks
 */
export function removeThemeVariableBlocks(css: string): string {
  let result = css;
  const rootRegex = getRootRegex("");

  result = result.replace(rootRegex, "").trim();

  let startIndex = result.indexOf("[data-theme=");

  while (startIndex !== -1) {
    const openBrace = result.indexOf("{", startIndex);

    if (openBrace === -1) {
      break;
    }

    let braceCount = 1;
    let closeBrace = openBrace + 1;

    while (closeBrace < result.length && braceCount > 0) {
      if (result[closeBrace] === "{") {
        braceCount++;
      } else if (result[closeBrace] === "}") {
        braceCount--;
      }
      closeBrace++;
    }

    if (braceCount === 0) {
      const before = result.substring(0, startIndex).trim();
      const after = result.substring(closeBrace).trim();

      result = (before + "\n" + after).trim();
    } else {
      break;
    }

    startIndex = result.indexOf("[data-theme=");
  }

  return result.trim();
}

/**
 * Injects CSS variables for all themes using attribute selectors.
 * All themes are available simultaneously, with theme switching handled by changing the data-theme attribute.
 *
 * @param allThemeVars - CSS string containing all theme CSS variables
 * @param prefix - Optional prefix for CSS variables
 */
export function injectAllThemeVariables(allThemeVars: string, prefix = "stoop"): void {
  if (!allThemeVars) {
    return;
  }

  const sanitizedPrefix = sanitizePrefix(prefix);
  const key = `__all_theme_vars_${sanitizedPrefix}`;
  const lastCSSVars = lastInjectedCSSVars.get(key) ?? null;

  if (lastCSSVars === allThemeVars) {
    return;
  }

  lastInjectedCSSVars.set(key, allThemeVars);

  if (!isBrowser()) {
    addToSSRCache(allThemeVars);

    return;
  }

  const sheet = getStylesheet(sanitizedPrefix);
  const currentCSS = sheet.textContent || "";
  const hasThemeBlocks = currentCSS.includes(":root") || currentCSS.includes("[data-theme=");

  if (isInjectedRule(key) || hasThemeBlocks) {
    const withoutVars = removeThemeVariableBlocks(currentCSS);

    sheet.textContent = allThemeVars + (withoutVars ? "\n\n" + withoutVars : "");

    markRuleAsInjected(key, allThemeVars);
  } else {
    sheet.textContent = allThemeVars + (currentCSS ? "\n\n" + currentCSS : "");
    markRuleAsInjected(key, allThemeVars);
  }
}

/**
 * Updates the stylesheet with new CSS rules.
 *
 * @param css - CSS string to inject
 * @param ruleKey - Unique key for deduplication
 * @param prefix - Optional prefix for CSS rules
 */
export function updateStylesheet(css: string, ruleKey: string, prefix = "stoop"): void {
  if (!isBrowser()) {
    return;
  }

  const sanitizedPrefix = sanitizePrefix(prefix);

  if (isInjectedRule(ruleKey)) {
    return;
  }

  const sheet = getStylesheet(sanitizedPrefix);
  const currentCSS = sheet.textContent || "";

  sheet.textContent = currentCSS + (currentCSS ? "\n" : "") + css;
  markRuleAsInjected(ruleKey, css);
}

/**
 * Injects CSS into the browser stylesheet with deduplication.
 *
 * @param css - CSS string to inject
 * @param ruleKey - Unique key for deduplication
 * @param prefix - Optional prefix for CSS rules
 */
export function injectBrowserCSS(css: string, ruleKey: string, prefix = "stoop"): void {
  if (isInjectedRule(ruleKey)) {
    return;
  }

  const sanitizedPrefix = sanitizePrefix(prefix);

  updateStylesheet(css, ruleKey, sanitizedPrefix);
}

/**
 * Gets the current stylesheet element for a given prefix.
 *
 * @param prefix - Optional prefix for stylesheet identification
 * @returns HTMLStyleElement or null if not created
 */
export function getStylesheetElement(prefix = "stoop"): HTMLStyleElement | null {
  const sanitizedPrefix = sanitizePrefix(prefix);

  return stylesheetElements.get(sanitizedPrefix) || null;
}

/**
 * Clears the stylesheet and all caches.
 */
function clearStylesheetInternal(): void {
  for (const [, element] of stylesheetElements.entries()) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  stylesheetElements.clear();
  lastInjectedThemes.clear();
  lastInjectedCSSVars.clear();
  injectedRules.clear();
}

/**
 * Gets all injected rules.
 */
export function getAllInjectedRules(): Map<string, string> {
  return new Map(injectedRules);
}

// ============================================================================
// Public API Functions
// ============================================================================

/**
 * Injects CSS into the document with automatic SSR support.
 *
 * @param css - CSS string to inject
 * @param prefix - Optional prefix for CSS rules
 * @param ruleKey - Optional unique key for deduplication
 */
export function injectCSS(css: string, prefix = "stoop", ruleKey?: string): void {
  const key = ruleKey || css;

  if (!isBrowser()) {
    if (!isInjectedRule(key)) {
      markRuleAsInjected(key, css);
    }

    addToSSRCache(css);

    return;
  }

  injectBrowserCSS(css, key, prefix);
}

/**
 * Gets all injected CSS text (browser or SSR).
 *
 * @returns CSS text string
 */
export function getCssText(prefix = "stoop"): string {
  if (isBrowser()) {
    const sanitizedPrefix = sanitizePrefix(prefix);
    const sheetElement = getStylesheetElement(sanitizedPrefix);

    if (sheetElement && sheetElement.parentNode) {
      const sheetCSS = sheetElement.textContent || "";

      if (!sheetCSS && getAllInjectedRules().size > 0) {
        return getSSRCacheText();
      }

      return sheetCSS;
    }
  }

  return getSSRCacheText();
}

/**
 * Clears all injected CSS and caches.
 */
export function clearStylesheet(): void {
  clearStylesheetInternal();
  clearSSRCache();
  clearStyleCache();
}
