/**
 * Theme token resolution utilities.
 * Converts theme tokens to CSS variables for runtime theme switching.
 * Uses cached token index for efficient lookups and theme comparison.
 */

import type { CSS, Theme } from "../types";

import {
  escapeCSSVariableValue,
  escapePrefixForSelector,
  sanitizeCSSVariableName,
} from "./string";
import { isCSSObject, isThemeObject } from "./type-guards";

const tokenIndexCache = new WeakMap<Theme, Map<string, string[]>>();

function buildTokenIndex(theme: Theme): Map<string, string[]> {
  const cached = tokenIndexCache.get(theme);

  if (cached) {
    return cached;
  }

  const index = new Map<string, string[]>();

  function processThemeObject(obj: Theme, path: string[] = []): void {
    for (const key in obj) {
      const value = obj[key];
      const currentPath = [...path, key];

      if (isThemeObject(value)) {
        processThemeObject(value, currentPath);
      } else {
        index.set(key, currentPath);
      }
    }
  }

  processThemeObject(theme);
  tokenIndexCache.set(theme, index);

  return index;
}

function themesHaveSameKeys(theme1: Theme, theme2: Theme): boolean {
  const keys1 = Object.keys(theme1);
  const keys2 = Object.keys(theme2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!(key in theme2)) {
      return false;
    }
  }

  return true;
}

export function themesAreEqual(theme1: Theme | null, theme2: Theme | null): boolean {
  if (theme1 === theme2) {
    return true;
  }

  if (!theme1 || !theme2) {
    return false;
  }

  if (!themesHaveSameKeys(theme1, theme2)) {
    return false;
  }

  return JSON.stringify(theme1) === JSON.stringify(theme2);
}

function findTokenInTheme(theme: Theme, tokenName: string): string[] | null {
  const index = buildTokenIndex(theme);

  return index.get(tokenName) || null;
}

export function tokenToCSSVar(token: string, theme?: Theme): string {
  if (!token.startsWith("$")) {
    return token;
  }

  const tokenName = token.slice(1);

  if (tokenName.includes(".")) {
    const sanitizedParts = tokenName.split(".").map((part) => sanitizeCSSVariableName(part));
    const cssVarName = `--${sanitizedParts.join("-")}`;

    return `var(${cssVarName})`;
  }

  if (theme) {
    const foundPath = findTokenInTheme(theme, tokenName);

    if (foundPath) {
      const sanitizedParts = foundPath.map((part) => sanitizeCSSVariableName(part));
      const cssVarName = `--${sanitizedParts.join("-")}`;

      return `var(${cssVarName})`;
    }
  }

  const sanitizedTokenName = sanitizeCSSVariableName(tokenName);
  const cssVarName = `--${sanitizedTokenName}`;

  return `var(${cssVarName})`;
}

export function generateCSSVariables(theme: Theme, prefix = ""): string {
  const escapedPrefix = escapePrefixForSelector(prefix);
  const rootSelector = escapedPrefix ? `:root[data-stoop="${escapedPrefix}"]` : ":root";
  const variables: string[] = [];

  function processThemeObject(obj: Theme, path: string[] = []): void {
    for (const key in obj) {
      const value = obj[key];
      const currentPath = [...path, key];

      if (isThemeObject(value)) {
        processThemeObject(value, currentPath);
      } else {
        // Sanitize path parts when generating CSS variable name
        const sanitizedParts = currentPath.map((part) => sanitizeCSSVariableName(part));
        const varName = `--${sanitizedParts.join("-")}`;
        const escapedValue =
          typeof value === "string" || typeof value === "number"
            ? escapeCSSVariableValue(value)
            : String(value);

        variables.push(`  ${varName}: ${escapedValue};`);
      }
    }
  }

  processThemeObject(theme);

  if (variables.length === 0) {
    return "";
  }

  return `${rootSelector} {\n${variables.join("\n")}\n}`;
}

export function replaceThemeTokensWithVars(obj: CSS, theme?: Theme): CSS {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  const result: CSS = {};

  for (const key in obj) {
    const value = obj[key];

    if (isCSSObject(value)) {
      result[key] = replaceThemeTokensWithVars(value, theme);
    } else if (typeof value === "string" && value.includes("$")) {
      result[key] = value.replace(
        /(\$[a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z][a-zA-Z0-9]*)?)/g,
        (match) => {
          return tokenToCSSVar(match, theme);
        },
      );
    } else {
      result[key] = value;
    }
  }

  return result;
}
