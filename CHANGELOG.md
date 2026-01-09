# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.2] - 2026-01-09

### Fixed

- Eliminated code duplication by consolidating `createStoopBase` into shared `create-stoop-internal.ts`
- Fixed missing type exports (`CSSFunction`, `GlobalCSSFunction`, `KeyframesFunction`, `CreateThemeFunction`, `ProviderProps`, `ThemeManagementContextValue`, `ThemeContextValue`)
- Improved import/export architecture to prevent circular dependencies

### Added

- SSR entry point export (`stoop/ssr`) now properly declared in `package.json` exports field
- Inline documentation for client/server boundaries in source files

### Changed

- Refactored `create-stoop.ts` to import from `create-stoop-internal.ts` instead of duplicating logic
- Ensured `create-stoop-internal.ts` remains server-safe with no React imports

## [0.6.1] - 2026-01-09

### Added

- Created `src/index.ts` as main entry point for cleaner architecture
- Build now creates `dist/types/index.js` to support `/types` subpath export

### Fixed

- Fixed TypeScript module resolution errors when consuming packages reference `import("stoop/types")`
- `/types` subpath export now properly resolves with corresponding runtime `.js` file

### Changed

- Main entry changed from `dist/create-stoop.js` to `dist/index.js`
- Removed redundant `import` and `require` fields from package.json exports (simplified to `types` + `default`)

## [0.6.0] - 2026-01-09

### Changed

- **BREAKING**: Removed `react-polymorphic-types` dependency - implemented custom polymorphic types based on Stitches approach
- Improved variant type inference with strict literal type preservation - invalid variant values now caught at compile time
- `StyledComponent` now uses `ForwardRefExoticComponent` with call signature overloads instead of permissive `ComponentType`
- Variant props no longer accept arbitrary strings - only defined variant values are allowed

### Added

- `RemoveIndexSignature<T>` utility type for removing index signatures from types
- `Widen<T>` utility type for widening literal types (available but unused - strict mode preferred)
- `NarrowString` utility type for better string literal inference
- `ComponentProps<Component>` utility to extract component props (similar to Stitches)
- `VariantProps<Component>` utility to extract only variant props from components

### Fixed

- Variant type checking now properly restricts to defined variant values (e.g., `variant="red"` errors if "red" not defined)
- Removed conditional type in `StyledOwnProps` that was widening variant types
- React types now properly imported without namespace import

## [0.5.4] - 2026-01-09

### Added

- Global CSS from config is now included in `getCssText()` for proper Pages Router SSR support
- Support for comma-separated CSS selectors (e.g., `"a, a:visited"`, `"input, textarea"`)

### Fixed

- Fixed empty `content` property handling - CSS requires `content: "";` not `content: ;`
- Fixed array destructuring linter warnings in theme utilities
- Fixed FOUC (Flash of Unstyled Content) in Next.js Pages Router by ensuring global CSS is in SSR output
- Preserved commas in CSS selector sanitization for multi-selector rules

## [0.5.3] - 2026-01-08

### Changed

- Minor code cleanup and test improvements
- Removed unused import in compiler

## [0.5.2] - 2026-01-07

### Fixed

- Fixed unitless numeric values for dimensional CSS properties (e.g., `width: 32`, `height: 100`) now automatically get `px` units appended, matching behavior of other CSS-in-JS libraries like styled-components and emotion
- Prevents browser warnings for invalid CSS property values like `height: 32` (now correctly outputs `height: 32px`)

## [0.5.1] - 2026-01-06

### Performance

- Optimized token index caching using WeakMap to avoid rebuilding indices
- Added fast path for explicit tokens (e.g., `$colors.background`) with inline CSS variable conversion
- Optimized CSS compilation to avoid double stringification for simple CSS objects
- Improved token replacement performance with early returns and conditional sanitization
- Reduced key sorting overhead by only sorting when needed for deterministic hashing
- Optimized utility function application with early return when no utilities present

### Changed

- Token resolution now caches theme indices per theme instance for better performance
- Explicit token paths are converted directly to CSS variables without function call overhead
- CSS property extraction optimized for simple cases without nested rules

## [0.5.0] - 2026-01-06

### Added

- Comprehensive CSS duplication tests to ensure CSS is not duplicated in SSR or browser contexts
- Dedicated `core/stringify.ts` module for CSS property name conversion with vendor prefix support

### Changed

- **BREAKING**: `getCssText()` no longer accepts theme parameter - always returns all themes
- **BREAKING**: `preloadTheme()` no longer accepts theme parameter - always preloads all themes
- **BREAKING**: `styled()` API now matches Stitches - variants must be embedded in baseStyles object (no third parameter)
- Consolidated `variants.ts` into `styled.ts` for better code organization
- Consolidated `global-css.ts` into `core-api.ts` for better code organization
- All types now centralized in `types/index.ts` (no local type definitions allowed)
- Updated READMEs to link to website documentation

### Fixed

- Fixed vendor prefix handling in CSS property names (e.g., `MozAppearance` now correctly converts to `-moz-appearance`)
- Improved vendor prefix support for all case variations (camelCase, lowercase, all-caps)

### Removed

- Removed deprecated theme parameter from `getCssText()` and `preloadTheme()`
- Removed unused `auto-preload` module (`utils/auto-preload.ts`)
- Removed unused storage utilities (unified storage API, JSON storage, theme detection)
- Removed third parameter support from `styled()` function

## [0.4.0] - 2026-01-05

### Added

- Multi-theme injection system using attribute selectors (`[data-theme="..."]`) for instant theme switching
- SSR entry point (`stoop/ssr`) for server-safe usage without React type imports
- `generateAllThemeVariables()` function to generate CSS for all themes simultaneously
- `injectAllThemes()` function to inject all themes at once
- `mergeThemes()` shared utility function for consistent theme merging
- `isStyledComponentRef()` shared helper for styled component detection
- `cssObjectToString()` exported from compiler for reuse
- `isProduction()` helper function for consistent production checks
- `getFromStorage()` and `setInStorage()` safe storage utilities
- Comprehensive documentation in `packages/stoop/docs/` (API, Architecture, Guide, Testing)

### Changed

- **BREAKING**: `getCssText(theme?)` now always includes all configured themes - theme parameter is deprecated but kept for backward compatibility
- **BREAKING**: `preloadTheme(theme?)` now injects all themes - theme parameter is deprecated but kept for backward compatibility
- Theme switching now uses attribute selectors instead of replacing CSS variables, eliminating layout shifts
- All themes are injected simultaneously, allowing instant switching by changing `data-theme` attribute
- `Provider` now injects all themes on mount instead of updating CSS variables on theme change
- Improved SSR hydration: always start with default theme to prevent hydration mismatch
- Consolidated theme merging logic into shared `mergeThemes()` function
- Extracted storage utilities (cookie/localStorage) to separate `utils/storage.ts` module
- Moved constants (`KEYFRAME_CACHE_LIMIT`, `SANITIZE_CACHE_SIZE_LIMIT`, cookie defaults) to `constants.ts`
- Improved browser detection using `document.createElement` instead of `requestAnimationFrame` for better test compatibility
- Updated variant merging logic for better performance

### Fixed

- Prevented FOUC (Flash of Unstyled Content) by injecting all themes upfront
- Fixed hydration mismatch issues by starting with default theme in SSR
- Improved theme switching performance by eliminating CSS variable replacement
- Better cache management with LRUCache consistently used throughout
- Early exit optimization in `replaceThemeTokensWithVars()` when no tokens found

### Removed

- Removed WeakMap cache for token index (memory concerns)
- Removed `registerGlobalStylesForSSR()` function (no longer needed)
- Removed `registerTheme()` function (replaced by `injectAllThemes()`)
- Removed `updateThemeVariables()` function (replaced by attribute selector system)

## [0.3.0] - 2025-12-29

### Added

- SSR support with dedicated server entry point (`stoop/ssr`)

### Fixed

- Resolved critical CSS injection bugs and improved performance

## [0.2.1] - 2025-11-19

### Fixed

- Corrected peer dependency requirement from `react >=19.0.0` to `react >=16.8.0`
- Stoop only uses standard React hooks available since React 16.8, making it compatible with a much wider range of React applications

## [0.2.0] - 2025-11-19

Initial usable release of Stoop as a CSS-in-JS library with comprehensive theme management.

### Added

#### Core APIs

- `createStoop()` - Factory function for creating Stoop instances
- `styled()` - Create polymorphic styled components with variants
- `css()` - Generate CSS classes with theme token support
- `createTheme()` - Extend and merge themes
- `globalCss()` - Inject global styles
- `keyframes()` - Create CSS animations with theme tokens

#### Theme Management

- Multi-theme support with automatic merging
- Built-in `Provider` component for theme state management
- `useTheme()` hook with `setTheme()` and `toggleTheme()` functions
- Theme token system with `$` prefix syntax (e.g., `$colors.primary`)
- CSS variables for dynamic theme switching
- Automatic theme merging - partial themes inherit from default theme
- Property-aware token resolution via themeMap

#### SSR & Performance

- `getCssText(theme?)` - Get CSS for server-side rendering with optional theme
- `preloadTheme(theme)` - Inject theme variables before React renders (FOUC prevention)
- `warmCache(styles)` - Pre-compile CSS objects for faster initial render
- CSS rule deduplication
- Token index cache for O(1) lookups

#### Developer Experience

- Full TypeScript type inference for theme tokens and variants
- Polymorphic components with `as` prop
- Component targeting with symbols
- Variant system (string and boolean variants)
- Utility functions support
- Prefix support for multiple Stoop instances
- React 16.8+ support (hooks required)

### Architecture

- Modular structure: `api/`, `core/`, `inject/`, `utils/`, `types/`
- CSS compilation engine with caching
- Single stylesheet injection (browser and SSR)
- CSS rule deduplication
- Token index cache for O(1) lookups
- Symbol-based component targeting
- Centralized theme variable updates via Provider

### Documentation

- Comprehensive API reference (`docs/API.md`)
- Getting started guide (`docs/GUIDE.md`)
- Architecture documentation (`docs/ARCHITECTURE.md`)
- Interactive preview application with live examples
- Next.js integration examples (App Router and Pages Router)

### Known Limitations

- No compound variants (planned for future release)
- Runtime-only CSS generation (no build-time extraction)
- Basic utility function support (custom utilities via config)

## [0.1.0] - Pre-release

Testing phase. Component library with in-house CSS-in-JS implementation. Not ready for use.
