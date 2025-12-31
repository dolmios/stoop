/**
 * CSS injection implementation.
 * Consolidates browser-specific and SSR-specific CSS injection logic.
 * Handles stylesheet management, theme variable injection, deduplication, and SSR caching.
 */

import type { CSS, Theme } from "./types";

import { MAX_CSS_CACHE_SIZE } from "./constants";
import { clearStyleCache } from "./core/cache";
import { isBrowser } from "./utils/helpers";
import { generateCSSVariables } from "./utils/theme";
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

const cssTextCache = new Map<string, boolean>();

// Registry for global styles that should always be included in getCssText()
// Maps prefix -> Set of CSS objects
const registeredGlobalStyles = new Map<string, Set<CSS>>();

/**
 * Adds CSS to the SSR cache with FIFO eviction.
 *
 * @param css - CSS string to cache
 */
export function addToSSRCache(css: string): void {
  if (cssTextCache.has(css)) {
    return;
  }

  if (cssTextCache.size >= MAX_CSS_CACHE_SIZE) {
    const firstKey = cssTextCache.keys().next().value;

    if (firstKey !== undefined) {
      cssTextCache.delete(firstKey);
    }
  }

  cssTextCache.set(css, true);
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

/**
 * Registers global styles that should always be included in getCssText().
 * This allows global styles to be included in SSR output even if they haven't been injected yet.
 *
 * @param styles - CSS object to register
 * @param prefix - Optional prefix for scoping
 */
export function registerGlobalStylesForSSR(styles: CSS, prefix = "stoop"): void {
  let stylesSet = registeredGlobalStyles.get(prefix);

  if (!stylesSet) {
    stylesSet = new Set();
    registeredGlobalStyles.set(prefix, stylesSet);
  }

  stylesSet.add(styles);
}

/**
 * Gets all registered global styles for a given prefix.
 *
 * @param prefix - Optional prefix for scoping
 * @returns Set of registered CSS objects
 */
export function getRegisteredGlobalStyles(prefix = "stoop"): Set<CSS> {
  return registeredGlobalStyles.get(prefix) || new Set();
}

// ============================================================================
// Browser-Specific Injection
// ============================================================================

let stylesheetElement: HTMLStyleElement | null = null;
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

  if (!stylesheetElement || !stylesheetElement.parentNode) {
    const ssrStylesheet = document.getElementById("stoop-ssr") as HTMLStyleElement | null;

    if (ssrStylesheet) {
      stylesheetElement = ssrStylesheet;
      stylesheetElement.setAttribute("data-stoop", sanitizedPrefix || "stoop");
    } else {
      stylesheetElement = document.createElement("style");
      stylesheetElement.setAttribute("data-stoop", sanitizedPrefix || "stoop");
      document.head.appendChild(stylesheetElement);
    }
  }

  return stylesheetElement;
}

/**
 * Injects theme CSS variables into the stylesheet.
 * Automatically ensures stylesheet exists before injection.
 *
 * @param cssVars - CSS variables string
 * @param theme - Theme object
 * @param prefix - Optional prefix for CSS variables
 */
export function injectThemeVariables(cssVars: string, theme: Theme, prefix = "stoop"): void {
  if (!cssVars) {
    return;
  }

  const sanitizedPrefix = sanitizePrefix(prefix);
  const key = `__theme_vars_${sanitizedPrefix}`;
  const lastCSSVars = lastInjectedCSSVars.get(key) ?? null;

  // Only skip if CSS vars string is exactly the same
  // CSS vars string comparison is used instead of theme object comparison
  // because theme objects may be cached/merged, making object comparison unreliable
  if (lastCSSVars === cssVars) {
    return;
  }

  lastInjectedThemes.set(key, theme);
  lastInjectedCSSVars.set(key, cssVars);

  if (!isBrowser()) {
    addToSSRCache(cssVars);

    return;
  }

  const sheet = getStylesheet(sanitizedPrefix);
  const currentCSS = sheet.textContent || "";
  const rootRegex = getRootRegex(sanitizedPrefix);
  // Check if :root block exists (handles SSR case where CSS vars were injected but not marked in dedup)
  const hasRootBlock = currentCSS.includes(":root");

  // Always replace if :root block exists (either from previous injection or SSR)
  // This prevents duplicates and ensures theme vars are always at the top
  if (isInjectedRule(key) || hasRootBlock) {
    // Find and replace the :root block by properly matching braces
    // This handles nested braces in CSS values (e.g., calc(), var())
    let withoutVars = currentCSS;
    const rootStart = withoutVars.indexOf(":root");

    if (rootStart !== -1) {
      // Find the opening brace after :root
      const openBrace = withoutVars.indexOf("{", rootStart);

      if (openBrace !== -1) {
        // Count braces to find the matching closing brace
        let braceCount = 1;
        let closeBrace = openBrace + 1;

        while (closeBrace < withoutVars.length && braceCount > 0) {
          if (withoutVars[closeBrace] === "{") {
            braceCount++;
          } else if (withoutVars[closeBrace] === "}") {
            braceCount--;
          }
          closeBrace++;
        }

        if (braceCount === 0) {
          // Remove the :root block (including any whitespace before it)
          const beforeRoot = withoutVars.substring(0, rootStart).trim();
          const afterRoot = withoutVars.substring(closeBrace).trim();

          withoutVars = (beforeRoot + "\n" + afterRoot).trim();
        } else {
          // Fallback to regex if brace counting fails
          withoutVars = currentCSS.replace(rootRegex, "").trim();
        }
      } else {
        // Fallback to regex if no opening brace found
        withoutVars = currentCSS.replace(rootRegex, "").trim();
      }
    } else {
      // No :root block found, use original CSS
      withoutVars = currentCSS.trim();
    }

    // Update stylesheet synchronously - prepend new theme vars, then append rest
    sheet.textContent = cssVars + (withoutVars ? "\n" + withoutVars : "");

    // Force browser to recalculate styles immediately
    // This ensures CSS variables are applied before React re-renders
    if (sheet.parentNode && typeof requestAnimationFrame === "function") {
      // Use requestAnimationFrame for proper reflow timing
      requestAnimationFrame(() => {
        // Access offsetHeight to trigger reflow
        void sheet.offsetHeight;
      });
    }

    markRuleAsInjected(key, cssVars);
  } else {
    // First injection - no existing :root block
    sheet.textContent = cssVars + (currentCSS ? "\n" + currentCSS : "");
    markRuleAsInjected(key, cssVars);
  }
}

/**
 * Registers a theme for injection (browser-specific).
 * Automatically ensures stylesheet exists and injects theme variables.
 *
 * @param theme - Theme object to register
 * @param prefix - Optional prefix for CSS variables
 */
export function registerTheme(theme: Theme, prefix = "stoop"): void {
  const sanitizedPrefix = sanitizePrefix(prefix);

  if (isBrowser()) {
    getStylesheet(sanitizedPrefix);
    const cssVars = generateCSSVariables(theme, sanitizedPrefix);

    injectThemeVariables(cssVars, theme, sanitizedPrefix);
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
 * Gets the current stylesheet element.
 *
 * @returns HTMLStyleElement or null if not created
 */
export function getStylesheetElement(): HTMLStyleElement | null {
  return stylesheetElement;
}

/**
 * Clears the stylesheet and all caches (internal).
 */
function clearStylesheetInternal(): void {
  if (stylesheetElement && stylesheetElement.parentNode) {
    stylesheetElement.parentNode.removeChild(stylesheetElement);
  }

  stylesheetElement = null;
  lastInjectedThemes.clear();
  lastInjectedCSSVars.clear();
  injectedRules.clear();
}

/**
 * Gets all injected rules (for internal use).
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
export function getCssText(): string {
  if (isBrowser()) {
    const sheetElement = getStylesheetElement();

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
