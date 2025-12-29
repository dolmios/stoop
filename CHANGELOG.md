# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-12-29

### Added

- add Next.js website with MDX documentation
- add SSR support with dedicated server entry point

### Changed

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
