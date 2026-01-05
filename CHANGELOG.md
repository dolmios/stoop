# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.1] - 2026-01-05

### Changed

- update CHANGELOG for v0.4.0 release
- update documentation paths and clean up publish script

### Other

- chore(stoop-ui): update stoop dependency to published version for release
- feat(stoop-ui): add top and bottom padding variants to Stack
- feat(stoop-swc): add build-time CSS-in-JS compiler (WIP)
- docs(website): update documentation for multi-theme system
- refactor(stoop-ui): simplify API and improve playground

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
- Package-specific lint script for `packages/stoop/`
- Comprehensive documentation in `packages/stoop/docs/` (API, Architecture, Guide, Testing)
- `stoop-swc` package (WIP - build-time CSS-in-JS compiler, not ready for use)

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
- `stoop-ui`: Removed `./client` export, consolidated API - `styled` and `keyframes` now exported from main index
- `stoop-ui`: Removed `react-polymorphic-types` dependency
- Documentation moved from root `docs/` to `packages/stoop/docs/`
- Updated all documentation to reflect multi-theme system changes

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
- Removed `stoop-ui/src/client.ts` file (consolidated into main index)
- Removed root `docs/` directory (moved to `packages/stoop/docs/`)
- Removed `CODE_REVIEW.md` file

### Other

- Code organization improvements: better separation of concerns, shared utilities
- Performance optimizations: removed unnecessary caching, early exits
- Improved error handling and type safety
- Updated playground to use Tabs component instead of react-router
- Simplified Modal demo component
- Added README files for `stoop-ui` and playground
- Cleaned up publish script console output (removed emojis)
- Added `stoop-swc` to eslint ignore patterns

## [0.3.0] - 2025-12-29

### Added

- add Next.js website with MDX documentation
- add SSR support with dedicated server entry point

### Changed

- update CHANGELOG for v0.3.0
- bump version to 0.3.0 for release
- add infrastructure for monorepo publishing and deployment
- restructure project into monorepo

### Fixed

- resolve critical CSS injection bugs and improve performance

### Other

- docs: update documentation for monorepo structure and SSR features
- docs: update documentation for API changes and add testing guide
- test: add comprehensive test coverage for core functionality

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
