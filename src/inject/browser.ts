/**
 * Browser-specific CSS injection.
 * Manages a single stylesheet element that gets updated with new CSS rules.
 * Handles theme variable injection, deduplication, and stylesheet lifecycle.
 */

import type { Theme } from "../types";

import { isCachedStyle, markStyleAsCached } from "../core/cache";
import { sanitizePrefix } from "../utils/string";
import { generateCSSVariables } from "../utils/theme";
import * as dedup from "./dedup";
import * as ssr from "./ssr";

let stylesheetElement: HTMLStyleElement | null = null;
const lastInjectedThemes = new Map<string, Theme>();
const lastInjectedCSSVars = new Map<string, string>();
const pendingThemes = new Map<string, Theme>();

// Batch DOM updates for better performance
const pendingCSSUpdates = new Map<string, string>();
let rafId: number | null = null;

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

function flushPendingCSSUpdates(): void {
  if (pendingCSSUpdates.size === 0 || !stylesheetElement || !stylesheetElement.parentNode) {
    rafId = null;

    return;
  }

  const batchedCSS = Array.from(pendingCSSUpdates.values()).join("\n");

  if (!batchedCSS) {
    pendingCSSUpdates.clear();
    rafId = null;

    return;
  }

  const {sheet} = stylesheetElement;

  // Use CSSOM insertRule for better performance with simple rules
  // Falls back to textContent for nested rules or @media queries
  if (sheet && sheet.insertRule && !batchedCSS.includes("@") && !batchedCSS.includes("&")) {
    try {
      const rules = batchedCSS.split(/(?<=})\s*(?=\S)/);

      let allInserted = true;

      for (const rule of rules) {
        const trimmedRule = rule.trim();

        if (trimmedRule) {
          try {
            sheet.insertRule(trimmedRule, sheet.cssRules.length);
          } catch {
            allInserted = false;
            break;
          }
        }
      }

      if (allInserted) {
        pendingCSSUpdates.clear();
        rafId = null;

        return;
      }
    } catch {
      // Fall through to textContent fallback
    }
  }

  // Fallback to textContent update (handles all cases)
  const currentCSS = stylesheetElement.textContent || "";

  stylesheetElement.textContent = currentCSS + (currentCSS ? "\n" : "") + batchedCSS;
  pendingCSSUpdates.clear();
  rafId = null;
}

function scheduleCSSUpdate(css: string, ruleKey: string): void {
  pendingCSSUpdates.set(ruleKey, css);

  if (!rafId && typeof requestAnimationFrame !== "undefined") {
    rafId = requestAnimationFrame(flushPendingCSSUpdates);
  } else if (!rafId) {
    flushPendingCSSUpdates();
  }
}

/**
 * Gets or creates the stylesheet element for CSS injection.
 *
 * @param prefix - Optional prefix for stylesheet identification
 * @returns HTMLStyleElement
 * @throws Error if called in SSR context
 */
export function getStylesheet(prefix = ""): HTMLStyleElement {
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
export function injectThemeVariables(cssVars: string, theme: Theme, prefix = ""): void {
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
    // Replace existing CSS variables block - use a more robust regex that handles whitespace
    const rootSelector = sanitizedPrefix ? `:root[data-stoop="${sanitizedPrefix}"]` : ":root";
    // Match :root selector with any whitespace, then {, then any content until matching }
    // Use [\s\S]*? for non-greedy match to handle nested braces correctly
    const rootRegex = new RegExp(
      `${rootSelector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{[\\s\\S]*?\\}`,
      "g",
    );
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
export function registerTheme(theme: Theme, prefix = ""): void {
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
 *
 * @param css - CSS string to inject
 * @param ruleKey - Unique key for deduplication
 * @param prefix - Optional prefix for CSS rules
 */
export function updateStylesheet(css: string, ruleKey: string, prefix = ""): void {
  if (typeof document === "undefined") {
    return;
  }

  const sanitizedPrefix = sanitizePrefix(prefix);

  if (stylesheetElement && stylesheetElement.parentNode) {
    const currentCSS = stylesheetElement.textContent || "";
    const normalizedNew = css.replace(/\s+/g, " ").trim();
    const normalizedCurrent = currentCSS.replace(/\s+/g, " ").trim();

    if (normalizedCurrent.includes(normalizedNew)) {
      if (!dedup.isInjectedRule(ruleKey)) {
        dedup.markRuleAsInjected(ruleKey, css);
      }

      return;
    }
  }

  try {
    const sheet = getStylesheet(sanitizedPrefix);
    const currentCSS = sheet.textContent || "";
    const normalizedNew = css.replace(/\s+/g, " ").trim();
    const normalizedCurrent = currentCSS.replace(/\s+/g, " ").trim();

    if (normalizedCurrent.includes(normalizedNew)) {
      if (!dedup.isInjectedRule(ruleKey)) {
        dedup.markRuleAsInjected(ruleKey, css);
      }

      return;
    }

    // Update immediately on initial render to avoid FOUC
    // Use batched updates for subsequent renders
    if (!currentCSS) {
      const allInjectedRules = dedup.getAllInjectedRules();

      if (allInjectedRules.size > 0) {
        const allCSS = Array.from(allInjectedRules.entries())
          .filter(([key]) => !key.startsWith("__theme_vars_") && key !== ruleKey)
          .map(([, cssValue]) => cssValue)
          .join("\n");

        sheet.textContent = allCSS + (allCSS ? "\n" : "") + css;
      } else {
        sheet.textContent = css;
      }
    } else {
      scheduleCSSUpdate(css, ruleKey);
    }

    if (!dedup.isInjectedRule(ruleKey)) {
      dedup.markRuleAsInjected(ruleKey, css);
    }
  } catch {
    if (!dedup.isInjectedRule(ruleKey)) {
      dedup.markRuleAsInjected(ruleKey, css);
    }
  }

  if (!ssr.isInSSRCache(css)) {
    ssr.addToSSRCache(css);
  }
}

/**
 * Injects CSS into the browser stylesheet with deduplication.
 *
 * @param css - CSS string to inject
 * @param ruleKey - Unique key for deduplication
 * @param prefix - Optional prefix for CSS rules
 */
export function injectBrowserCSS(css: string, ruleKey: string, prefix = ""): void {
  if (dedup.isInjectedRule(ruleKey)) {
    return;
  }

  dedup.markRuleAsInjected(ruleKey, css);

  if (isCachedStyle(css)) {
    return;
  }

  markStyleAsCached(css);

  const sanitizedPrefix = sanitizePrefix(prefix);

  if (stylesheetElement && stylesheetElement.parentNode) {
    try {
      const currentCSS = stylesheetElement.textContent || "";
      const normalizedNew = css.replace(/\s+/g, " ").trim();
      const normalizedCurrent = currentCSS.replace(/\s+/g, " ").trim();

      if (normalizedCurrent.includes(normalizedNew)) {
        return;
      }
    } catch {
      // Continue with normal injection
    }
  }

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
 * Clears the stylesheet and all pending updates.
 */
export function clearStylesheet(): void {
  if (rafId !== null && typeof cancelAnimationFrame !== "undefined") {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  pendingCSSUpdates.clear();

  if (stylesheetElement && stylesheetElement.parentNode) {
    stylesheetElement.parentNode.removeChild(stylesheetElement);
  }

  stylesheetElement = null;
  lastInjectedThemes.clear();
  lastInjectedCSSVars.clear();
  pendingThemes.clear();
}
