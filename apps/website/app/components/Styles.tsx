"use client";

// stoop is a build-time SWC plugin: all CSS is extracted at compile time
// and emitted as static .css files that Next.js bundles automatically.
// There is no runtime getCssText() call needed — styles are already present
// in the HTML before React hydrates. This component is intentionally a no-op.
//
// If you are using the legacy runtime stoop-ui package alongside stoop-ui
// during a gradual migration, you can temporarily restore getCssText() here:
//
//   import { getCssText } from "stoop-ui";
//   useServerInsertedHTML(() => {
//     const cssText = getCssText();
//     if (!cssText) return null;
//     return <style dangerouslySetInnerHTML={{ __html: cssText }} id="stoop-ssr" suppressHydrationWarning />;
//   });

export function Styles({ initialTheme: _initialTheme }: { initialTheme: string }): null {
  return null;
}
