/**
 * Preview application entry point.
 *
 * Demonstrates Stoop features with built-in theme management:
 * - Preloads saved theme to prevent FOUC
 * - Injects global styles
 * - Renders demo wrapped in built-in Provider
 */

import { createRoot } from "react-dom/client";

import { Demo } from "./components/Demo";
import { globalStyles } from "./lib/global";
import { Provider, preloadTheme, useTheme } from "./stoop.theme";

if (!Provider || !useTheme) {
  throw new Error("Provider and useTheme must be available. Ensure themes config is provided to createStoop.");
}

// Preload saved theme BEFORE React renders - prevents FOUC
try {
  const savedTheme = localStorage.getItem("stoop-theme");

  if (savedTheme) {
    preloadTheme(savedTheme);
  }
} catch {
  // Ignore localStorage errors
}

// Inject global styles
globalStyles();

// Render the demo application
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element '#root' not found in DOM");
}

const root = createRoot(rootElement);

root.render(
  <Provider defaultTheme="light" storageKey="stoop-theme">
    <Demo />
  </Provider>,
);
