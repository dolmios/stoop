/**
 * Checks if code is running in a browser environment.
 *
 * @returns True if running in browser, false if in SSR/Node environment
 */
export function isBrowser(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof document !== "undefined" &&
    typeof window.document === "object" &&
    // Ensure we're not in React Server Component or SSR context
    typeof window.requestAnimationFrame === "function"
  );
}
