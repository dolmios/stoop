/**
 * Browser-specific CSS injection.
 * Manages a single stylesheet element that gets updated with new CSS rules.
 * Handles theme variable injection, deduplication, and stylesheet lifecycle.
 */

import type { Theme } from "../types";

import { getRootRegex, sanitizePrefix } from "../utils/string";
import { generateCSSVariables } from "../utils/theme";
import * as dedup from "./dedup";
import * as ssr from "./ssr";

let stylesheetElement: HTMLStyleElement | null = null;
const lastInjectedThemes = new Map<string, Theme>();
const lastInjectedCSSVars = new Map<string, string>();
const pendingThemes = new Map<string, Theme>();

// Auto-initialize stylesheet synchronously when module loads (browser only)
// This prevents FOUC by ensuring stylesheet exists before any code runs
if (typeof document !== "undefined") {
  // Use IIFE to initialize immediately
  (function initializeStylesheetOnLoad(): void {
    if (!stylesheetElement) {
      stylesheetElement = document.createElement("style");
      stylesheetElement.setAttribute("data-stoop", "stoop");
      document.head.appendChild(stylesheetElement);
    }
  })();
}

// REMOVED: RAF batching code - it was causing race conditions and dropped styles
// Now using synchronous injection for maximum stability

/**
 * Gets or creates the stylesheet element for CSS injection.
 *
 * @param prefix - Optional prefix for stylesheet identification
 * @returns HTMLStyleElement
 * @throws Error if called in SSR context
 */
export function getStylesheet(prefix = "stoop"): HTMLStyleElement {
  if (typeof document === "undefined") {
    throw new Error("Cannot access document in SSR context");
  }

  const sanitizedPrefix = sanitizePrefix(prefix);

  if (stylesheetElement) {
    if (stylesheetElement.parentNode) {
      return stylesheetElement;
    }
    if (stylesheetElement.textContent) {
      try {
        document.head.appendChild(stylesheetElement);

        return stylesheetElement;
      } catch {
        // Fall through
      }
    }
    stylesheetElement = null;
  }

  stylesheetElement = document.createElement("style");
  stylesheetElement.setAttribute("data-stoop", sanitizedPrefix || "stoop");

  document.head.appendChild(stylesheetElement);

  // Note: Pending themes are injected by registerTheme, not here
  // This avoids circular dependency with injectThemeVariables

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

  // Compare CSS variables string directly - this is the source of truth
  // Merged theme objects are recreated each time, so comparing theme objects is unreliable
  // If CSS variables haven't changed, there's no need to update the DOM
  if (lastCSSVars === cssVars) {
    // Update stored theme reference even if CSS vars are the same (for reference tracking)
    const lastTheme = lastInjectedThemes.get(key) ?? null;

    if (lastTheme !== theme) {
      lastInjectedThemes.set(key, theme);
    }

    return;
  }

  // CSS variables have changed - update both the CSS vars and theme reference
  lastInjectedThemes.set(key, theme);
  lastInjectedCSSVars.set(key, cssVars);

  if (typeof document === "undefined") {
    ssr.addToSSRCache(cssVars);

    return;
  }

  // Ensure stylesheet exists - this is safe to call multiple times
  const sheet = getStylesheet(sanitizedPrefix);
  const currentCSS = sheet.textContent || "";

  if (dedup.isInjectedRule(key)) {
    // Replace existing CSS variables block - use pre-compiled regex
    const rootRegex = getRootRegex(sanitizedPrefix);
    const withoutVars = currentCSS.replace(rootRegex, "").trim();

    // Always put CSS variables first, then other CSS
    sheet.textContent = cssVars + (withoutVars ? "\n" + withoutVars : "");
    dedup.markRuleAsInjected(key, cssVars);
  } else {
    // First time injecting - prepend CSS variables to existing CSS
    sheet.textContent = cssVars + (currentCSS ? "\n" + currentCSS : "");
    dedup.markRuleAsInjected(key, cssVars);
  }
}

/**
 * Registers a theme for injection (browser-specific).
 * Automatically ensures stylesheet exists and injects theme variables.
 * Note: This is typically called with the default theme from createStoop.
 * Additional themes should use updateThemeVariables which handles merging.
 *
 * @param theme - Theme object to register
 * @param prefix - Optional prefix for CSS variables
 */
export function registerTheme(theme: Theme, prefix = "stoop"): void {
  const sanitizedPrefix = sanitizePrefix(prefix);

  pendingThemes.set(sanitizedPrefix, theme);

  if (typeof document !== "undefined") {
    // Ensure stylesheet exists
    getStylesheet(sanitizedPrefix);

    // Inject theme variables immediately
    // Note: registerTheme is called with the default theme, so no merging needed
    const cssVars = generateCSSVariables(theme, sanitizedPrefix);

    injectThemeVariables(cssVars, theme, sanitizedPrefix);
  }
}

/**
 * Updates the stylesheet with new CSS rules.
 * FIXED: Always inject synchronously to prevent race conditions.
 *
 * @param css - CSS string to inject
 * @param ruleKey - Unique key for deduplication
 * @param prefix - Optional prefix for CSS rules
 */
export function updateStylesheet(css: string, ruleKey: string, prefix = "stoop"): void {
  if (typeof document === "undefined") {
    return;
  }

  const sanitizedPrefix = sanitizePrefix(prefix);

  // Check dedup first - most efficient check
  if (dedup.isInjectedRule(ruleKey)) {
    return;
  }

  try {
    const sheet = getStylesheet(sanitizedPrefix);
    const currentCSS = sheet.textContent || "";

    // FIXED: Always inject synchronously to prevent styles from dropping
    sheet.textContent = currentCSS + (currentCSS ? "\n" : "") + css;

    dedup.markRuleAsInjected(ruleKey, css);
  } catch {
    dedup.markRuleAsInjected(ruleKey, css);
  }

  if (!ssr.isInSSRCache(css)) {
    ssr.addToSSRCache(css);
  }
}

/**
 * Injects CSS into the browser stylesheet with deduplication.
 * FIXED: Proper deduplication order to prevent race conditions.
 *
 * @param css - CSS string to inject
 * @param ruleKey - Unique key for deduplication
 * @param prefix - Optional prefix for CSS rules
 */
export function injectBrowserCSS(css: string, ruleKey: string, prefix = "stoop"): void {
  // FIXED: Check dedup first, then delegate to updateStylesheet which also checks
  // This prevents double-checking and ensures consistent behavior
  if (dedup.isInjectedRule(ruleKey)) {
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
 * Clears the stylesheet and all caches.
 */
export function clearStylesheet(): void {
  if (stylesheetElement && stylesheetElement.parentNode) {
    stylesheetElement.parentNode.removeChild(stylesheetElement);
  }

  stylesheetElement = null;
  lastInjectedThemes.clear();
  lastInjectedCSSVars.clear();
  pendingThemes.clear();
}
