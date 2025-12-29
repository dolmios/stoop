/**
 * Browser-specific CSS injection.
 * Manages a single stylesheet element that gets updated with new CSS rules.
 * Handles theme variable injection, deduplication, and stylesheet lifecycle.
 */

import type { Theme } from "../types";

import { isBrowser } from "../utils/environment";
import { getRootRegex, sanitizePrefix } from "../utils/string";
import { generateCSSVariables } from "../utils/theme";
import * as dedup from "./dedup";
import * as ssr from "./ssr";

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

  if (lastCSSVars === cssVars) {
    const lastTheme = lastInjectedThemes.get(key) ?? null;

    if (lastTheme !== theme) {
      lastInjectedThemes.set(key, theme);
    }

    return;
  }

  lastInjectedThemes.set(key, theme);
  lastInjectedCSSVars.set(key, cssVars);

  if (!isBrowser()) {
    ssr.addToSSRCache(cssVars);

    return;
  }

  const sheet = getStylesheet(sanitizedPrefix);
  const currentCSS = sheet.textContent || "";

  if (dedup.isInjectedRule(key)) {
    const rootRegex = getRootRegex(sanitizedPrefix);
    const withoutVars = currentCSS.replace(rootRegex, "").trim();

    sheet.textContent = cssVars + (withoutVars ? "\n" + withoutVars : "");
    dedup.markRuleAsInjected(key, cssVars);
  } else {
    sheet.textContent = cssVars + (currentCSS ? "\n" + currentCSS : "");
    dedup.markRuleAsInjected(key, cssVars);
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

  if (dedup.isInjectedRule(ruleKey)) {
    return;
  }

  const sheet = getStylesheet(sanitizedPrefix);
  const currentCSS = sheet.textContent || "";

  sheet.textContent = currentCSS + (currentCSS ? "\n" : "") + css;
  dedup.markRuleAsInjected(ruleKey, css);
}

/**
 * Injects CSS into the browser stylesheet with deduplication.
 *
 * @param css - CSS string to inject
 * @param ruleKey - Unique key for deduplication
 * @param prefix - Optional prefix for CSS rules
 */
export function injectBrowserCSS(css: string, ruleKey: string, prefix = "stoop"): void {
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
}
