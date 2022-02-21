/**
 * Browser-specific CSS injection.
 * Manages a single stylesheet element that gets updated with new CSS rules.
 * Handles theme variable injection, deduplication, and stylesheet lifecycle.
 */

import type { Theme } from "../types";

import { hasCachedStyle, markStyleAsCached } from "../core/cache";
import { sanitizePrefix } from "../utils/string";
import { generateCSSVariables, themesAreEqual } from "../utils/theme";
import * as dedup from "./dedup";
import * as ssr from "./ssr";

let stylesheetElement: HTMLStyleElement | null = null;
const lastInjectedThemes = new Map<string, Theme>();
const pendingThemes = new Map<string, Theme>();

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
        // fall through
      }
    }
    stylesheetElement = null;
  }

  stylesheetElement = document.createElement("style");
  stylesheetElement.setAttribute("data-stoop", sanitizedPrefix || "stoop");

  document.head.appendChild(stylesheetElement);

  const pendingTheme = pendingThemes.get(sanitizedPrefix);

  if (pendingTheme) {
    const cssVars = generateCSSVariables(pendingTheme, sanitizedPrefix);

    // eslint-disable-next-line no-use-before-define -- Function declarations are hoisted
    injectThemeVariables(cssVars, pendingTheme, sanitizedPrefix);
  }

  return stylesheetElement;
}

export function injectThemeVariables(cssVars: string, theme: Theme, prefix = ""): void {
  if (!cssVars) {
    return;
  }

  const sanitizedPrefix = sanitizePrefix(prefix);
  const key = `__theme_vars_${sanitizedPrefix}`;
  const lastTheme = lastInjectedThemes.get(key) ?? null;

  if (themesAreEqual(lastTheme, theme)) {
    if (lastTheme !== theme) {
      lastInjectedThemes.set(key, theme);
    }

    return;
  }

  lastInjectedThemes.set(key, theme);

  if (typeof document === "undefined") {
    ssr.addToSSRCache(cssVars);

    return;
  }

  const sheet = getStylesheet(sanitizedPrefix);
  const currentCSS = sheet.textContent || "";

  if (dedup.isRuleInjected(key)) {
    const rootSelector = sanitizedPrefix ? `:root[data-stoop="${sanitizedPrefix}"]` : ":root";
    const rootRegex = new RegExp(
      `${rootSelector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{[^}]*\\}`,
      "g",
    );
    const withoutVars = currentCSS.replace(rootRegex, "").trim();

    sheet.textContent = cssVars + (withoutVars ? "\n" + withoutVars : "");
    dedup.markRuleAsInjected(key, cssVars);
  } else {
    sheet.textContent = cssVars + (currentCSS ? "\n" + currentCSS : "");
    dedup.markRuleAsInjected(key, cssVars);
  }
}

export function registerTheme(theme: Theme, prefix = ""): void {
  const sanitizedPrefix = sanitizePrefix(prefix);

  pendingThemes.set(sanitizedPrefix, theme);

  if (typeof document !== "undefined" && stylesheetElement?.parentNode) {
    const cssVars = generateCSSVariables(theme, sanitizedPrefix);

    injectThemeVariables(cssVars, theme, sanitizedPrefix);
  }
}

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
      if (!dedup.isRuleInjected(ruleKey)) {
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
      if (!dedup.isRuleInjected(ruleKey)) {
        dedup.markRuleAsInjected(ruleKey, css);
      }

      return;
    }

    const allInjectedRules = dedup.getAllInjectedRules();

    if (!currentCSS && allInjectedRules.size > 0) {
      const allCSS = Array.from(allInjectedRules.entries())
        .filter(([key]) => !key.startsWith("__theme_vars_") && key !== ruleKey)
        .map(([, cssValue]) => cssValue)
        .join("\n");

      sheet.textContent = allCSS + (allCSS ? "\n" : "") + css;
    } else if (currentCSS) {
      sheet.textContent = currentCSS + "\n" + css;
    } else {
      sheet.textContent = css;
    }

    if (!dedup.isRuleInjected(ruleKey)) {
      dedup.markRuleAsInjected(ruleKey, css);
    }
  } catch {
    if (!dedup.isRuleInjected(ruleKey)) {
      dedup.markRuleAsInjected(ruleKey, css);
    }
  }

  if (!ssr.isInSSRCache(css)) {
    ssr.addToSSRCache(css);
  }
}

export function injectBrowserCSS(css: string, ruleKey: string, prefix = ""): void {
  if (dedup.isRuleInjected(ruleKey)) {
    return;
  }

  dedup.markRuleAsInjected(ruleKey, css);

  if (hasCachedStyle(css)) {
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
      // continue with normal injection
    }
  }

  updateStylesheet(css, ruleKey, sanitizedPrefix);
}

export function getStylesheetElement(): HTMLStyleElement | null {
  return stylesheetElement;
}

export function clearStylesheet(): void {
  if (stylesheetElement && stylesheetElement.parentNode) {
    stylesheetElement.parentNode.removeChild(stylesheetElement);
  }

  stylesheetElement = null;
  lastInjectedThemes.clear();
  pendingThemes.clear();
}
