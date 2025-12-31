# Code Review: packages/stoop

## Summary

Overall, the codebase is well-structured and follows good practices. However, there are several areas that need attention:

1. **Poor Typing**: Multiple uses of `any` type, especially in dev-tools.ts
2. **Dead Code**: Several unused or incomplete functions
3. **Code Quality Issues**: Memory leaks, incomplete implementations, misleading function names
4. **Redundancy**: Duplicate logic in storage utilities
5. **File Organization**: dev-tools.ts is too large (895 lines) and mixes concerns

---

## 1. Poor Typing

### dev-tools.ts

**Line 148-151**: Uses `(window as any)` instead of proper typing

```typescript
(window as any).__STOOP_METRICS__ = globalMetrics;
(window as any).__STOOP_DEV_TOOLS__ = { ... };
```

**Fix**: Create a proper interface:

```typescript
interface WindowWithStoop extends Window {
  __STOOP_METRICS__?: StoopMetrics;
  __STOOP_DEV_TOOLS__?: { ... };
}
```

**Line 255-261**: Overly complex return type union

```typescript
export function createPerformanceMonitor(operationName: string): {
  start: () =>
    | {
        end: () => number;
      }
    | {
        end: () => void;
      };
};
```

**Fix**: Simplify with a single return type that handles both cases internally.

**Line 847**: Uses `any` for stoopInstance parameter

```typescript
export function createNextConfig(stoopInstance: any, options: { ... })
```

**Fix**: Use proper `StoopInstance` type from types.

**Line 849, 854, 865**: Multiple `any` types in webpack config
**Fix**: Use proper webpack types or create a minimal interface.

### core-api.ts

**Line 44-48**: Uses `(result as any)` for theme merging

```typescript
(result as any)[key] = { ...targetValue, ...sourceValue };
```

**Fix**: Use proper type assertion or generic helper function.

### theme-manager.ts

**Line 94-98**: Uses `(merged as any)` for theme merging
**Fix**: Same as above - use proper typing.

### create-stoop.ts

**Line 211-212**: Uses inline `import("./types")` types instead of importing

```typescript
let Provider: ComponentType<import("./types").ProviderProps> | undefined;
let useTheme: (() => import("./types").ThemeManagementContextValue) | undefined;
```

**Fix**: Import types at the top of the file.

---

## 2. Dead Code / Incomplete Implementations

### dev-tools.ts

**Line 547-555**: `useAutoPreload` - Misleadingly named (not a React hook)

- Returns a Promise, not a hook
- Comment says "In a React component, you would typically use this with useEffect"
- This is confusing - either make it a real hook or rename it

**Line 631-668**: `extractStylesFromFile` - Incomplete regex-based parsing

- Uses fragile regex instead of AST parsing
- Comment admits "This is a simplified implementation - real implementation would use proper AST"
- Should either be removed or properly implemented

**Line 691-712**: Mock data hardcoded in production code

- `analyzeStyles` function uses hardcoded mock files
- Comment says "Simulate file analysis (real implementation would read actual files)"
- This is dead code that will never work correctly

**Line 784-803**: `generateWarmCacheCode` - Incomplete implementation

- Returns generated code string but doesn't write to file
- Comment says "In real implementation, this would write to file"
- Called but result is never used (line 827)

**Line 811-836**: `createStoopBuildPlugin` - Incomplete Vite plugin

- Returns incomplete plugin interface (only has `buildStart` and `name`)
- Missing many required Vite plugin properties
- Will not work as a real Vite plugin

**Line 846-877**: `createNextConfig` - Incomplete Next.js config

- Uses `any` types throughout
- Webpack plugin integration is incomplete
- Returns incomplete config object

**Line 886-894**: `createStyleChunks` - Appears unused

- No references found in codebase
- Simple utility that may be dead code

### storage.ts

**Line 22-28**: `safeJsonParse` - Used internally only

- Not exported, only used in same file
- This is fine, but could be marked as private with underscore prefix

---

## 3. Code Quality Issues

### dev-tools.ts

**Line 162-170**: Memory leak - `setInterval` without cleanup

```typescript
setInterval(() => {
  if (globalMetrics) {
    // ...
  }
}, 30000);
```

**Fix**: Return cleanup function from `initDevTools`:

```typescript
export function initDevTools(config: DevConfig = {}): () => void {
  // ...
  const intervalId = setInterval(...);
  return () => clearInterval(intervalId);
}
```

**Line 631-668**: Fragile regex-based CSS extraction

- Will break on complex CSS objects
- Should use proper AST parser or be removed

**Line 691-712**: Mock data in production code

- Should be removed or moved to tests

### inject.ts

**Line 256**: Hacky reflow trigger

```typescript
void sheet.offsetHeight;
```

**Fix**: Use proper method like `requestAnimationFrame` or document reflow API

### compiler.ts

**Line 30-44**: `isStyledComponentKey` - Redundant checks

- Checks for symbol, then object property, then string prefix
- Could be simplified

---

## 4. Redundancy

### storage.ts

**Line 320-328**: `getLocalStorage` duplicates `getFromStorage` logic

- `getLocalStorage` is a simplified version of `getFromStorage`
- Only difference is error handling
- Should consolidate into one function

**Pattern**: Multiple storage functions (`getFromStorage`, `getStorage`, `getCookie`) have similar patterns

- Could use a unified abstraction

### theme-utils.ts

Multiple similar sanitization functions:

- `sanitizeCSSSelector`
- `sanitizeCSSVariableName`
- `sanitizeClassName`
- `sanitizeCSSPropertyName`
- `sanitizeMediaQuery`
- `sanitizePrefix`

All follow similar patterns - could potentially use a generic sanitizer with different rules.

---

## 5. File Organization

### dev-tools.ts (895 lines)

This file is too large and mixes multiple concerns:

1. **Development Tools** (lines 1-335)
   - Metrics tracking
   - Performance monitoring
   - Style analysis

2. **Auto-Preloading Utilities** (lines 336-556)
   - Cache warming
   - Theme preloading
   - Auto-preload orchestration

3. **Build-Time Utilities** (lines 557-895)
   - Style analysis
   - Code generation
   - Build plugin creation
   - Next.js config helpers

**Recommendation**: Split into:

- `dev-tools.ts` - Development metrics and monitoring
- `auto-preload.ts` - Auto-preloading utilities
- `build-tools.ts` - Build-time analysis and plugins

### storage.ts

Mixes storage utilities with theme detection:

- Lines 1-309: Storage utilities
- Lines 310-480: Theme detection

**Recommendation**: Split into:

- `storage.ts` - Storage utilities only
- `theme-detection.ts` - Theme detection logic

---

## 6. Minor Issues

### Naming

- `useAutoPreload` (dev-tools.ts:547) - Not a hook, misleading name
- `safeJsonParse` (storage.ts:22) - Should be `_safeJsonParse` if private

### Comments

- Several "TODO" comments indicating incomplete implementations
- Mock data comments should be removed if code is production-ready

### Type Safety

- Multiple places use `as any` or `as unknown` casts
- Some type guards could be improved (e.g., `isCSSObject` is very loose)

---

## Recommendations Priority

### High Priority

1. Fix memory leak in `initDevTools` (setInterval cleanup)
2. Remove or complete incomplete implementations (extractStylesFromFile, mock data, etc.)
3. Fix `any` types in `createNextConfig` and `createStoopBuildPlugin`
4. Split `dev-tools.ts` into multiple files

### Medium Priority

5. Consolidate duplicate storage logic
6. Fix hacky reflow trigger in `inject.ts`
7. Rename `useAutoPreload` or make it a real hook
8. Improve type safety (remove `as any` casts)

### Low Priority

9. Consolidate sanitization functions
10. Add proper window type extensions
11. Improve type guards

---

## Positive Notes

- Good use of TypeScript types overall
- Well-documented functions
- Good separation of concerns in most files
- Proper error handling in many places
- Good use of caching for performance
- Clean API design
