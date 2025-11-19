# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - Initial Release

Initial usable release of Stoop as a CSS-in-JS library.

### Added

- `createStoop()` factory function
- `styled()` function for creating styled components
- `css()` function for generating CSS classes
- `createTheme()` function for theme extension
- `globalCss()` function for global styles
- `keyframes()` function for CSS animations
- `getCssText()` function for SSR support
- `warmCache()` function for cache pre-warming
- `ThemeContext` React context for theme access
- Theme token system with `$` prefix syntax
- Variant system for component variations
- Utility functions support
- CSS variables for theme tokens
- Property-aware token resolution via themeMap
- Prefix support for multiple Stoop instances
- TypeScript type inference for theme tokens and variants
- SSR support
- React 19+ support

### Architecture

- Modular structure: `api/`, `core/`, `inject/`, `utils/`
- CSS compilation engine with caching
- Single stylesheet injection
- CSS rule deduplication
- Token index cache for O(1) lookups
- Symbol-based component targeting

### Limitations

- No compound variants
- Runtime-only CSS generation (no build-time extraction)
- Basic utility function support

## [0.1.0] - Pre-release

Testing phase. Component library with in-house CSS-in-JS implementation. Not ready for use.

