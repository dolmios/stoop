/**
 * Storage and theme detection utilities.
 * Provides simplified localStorage and cookie management with SSR compatibility and error handling.
 */

import type { StorageOptions, StorageResult } from "../types";

import { DEFAULT_COOKIE_MAX_AGE, DEFAULT_COOKIE_PATH } from "../constants";
import { isBrowser } from "./helpers";

// ============================================================================
// Storage Utilities
// ============================================================================

/**
 * Safely gets a value from localStorage.
 *
 * @param key - Storage key
 * @returns Storage result
 */
export function getFromStorage(key: string): StorageResult<string | null> {
  if (!isBrowser()) {
    return { error: "Not in browser environment", success: false, value: null };
  }

  try {
    const value = localStorage.getItem(key);

    return { source: "localStorage", success: true, value };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "localStorage access failed",
      success: false,
      value: null,
    };
  }
}

/**
 * Safely sets a value in localStorage.
 *
 * @param key - Storage key
 * @param value - Value to store
 * @returns Storage result
 */
export function setInStorage(key: string, value: string): StorageResult<void> {
  if (!isBrowser()) {
    return { error: "Not in browser environment", success: false, value: undefined };
  }

  try {
    localStorage.setItem(key, value);

    return { success: true, value: undefined };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "localStorage write failed",
      success: false,
      value: undefined,
    };
  }
}

/**
 * Safely removes a value from localStorage.
 *
 * @param key - Storage key
 * @returns Storage result
 */
export function removeFromStorage(key: string): StorageResult<void> {
  if (!isBrowser()) {
    return { error: "Not in browser environment", success: false, value: undefined };
  }

  try {
    localStorage.removeItem(key);

    return { success: true, value: undefined };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "localStorage remove failed",
      success: false,
      value: undefined,
    };
  }
}

/**
 * Gets a cookie value.
 *
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  if (!isBrowser()) return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
}

/**
 * Sets a cookie value.
 *
 * @param name - Cookie name
 * @param value - Cookie value
 * @param options - Cookie options
 * @returns Success status
 */
export function setCookie(
  name: string,
  value: string,
  options: Omit<StorageOptions, "type"> & { maxAge?: number; path?: string; secure?: boolean } = {},
): boolean {
  if (!isBrowser()) return false;

  const { maxAge = DEFAULT_COOKIE_MAX_AGE, path = DEFAULT_COOKIE_PATH, secure = false } = options;

  try {
    document.cookie = `${name}=${value}; path=${path}; max-age=${maxAge}${secure ? "; secure" : ""}`;

    return true;
  } catch {
    return false;
  }
}

/**
 * Removes a cookie by setting it to expire.
 *
 * @param name - Cookie name
 * @param path - Cookie path
 * @returns Success status
 */
export function removeCookie(name: string, path = "/"): boolean {
  if (!isBrowser()) return false;

  try {
    document.cookie = `${name}=; path=${path}; max-age=0`;

    return true;
  } catch {
    return false;
  }
}
