# Stoop Test Suite Review

## Phase 1: Initial Review

### Current Test Files Analysis

#### 1. Type Safety Tests (5 files - can be consolidated)
- `type-safety-types.test.ts` - Type-only compilation tests for variant inference
- `auto-inference-verification.test.ts` - Runtime tests for automatic type inference
- `test-auto-inference.ts` - Type-only tests for auto inference (redundant with above)
- `type-safety.test.ts` - Runtime tests for type safety
- `verify-boolean-variants.ts` - Type-only tests for boolean variants
- `verify-button-types.ts` - Type-only tests for button component

**Issues:**
- Too many separate files for type testing
- `test-auto-inference.ts` and `auto-inference-verification.test.ts` overlap significantly
- Inconsistent naming (.test.ts vs .ts)
- Type-only tests scattered across multiple files

#### 2. Core Functionality Tests
- `stoop.test.ts` (924 lines) - Main API tests covering:
  - createStoop
  - css function
  - styled components
  - globalCss
  - keyframes
  - createTheme
  - getCssText
  - preloadTheme
  - Provider/useTheme
  - warmCache

**Issues:**
- Very large file - could be split by feature
- Some overlap with other test files

#### 3. CSS Generation & Injection Tests (3 files - overlap)
- `stringification.test.ts` - CSS property name conversion
- `injection.test.ts` - CSS injection and deduplication
- `css-duplication.test.ts` - CSS duplication prevention

**Issues:**
- `injection.test.ts` and `css-duplication.test.ts` have significant overlap
- Both test deduplication but from different angles
- Could be consolidated

#### 4. React-Specific Tests
- `provider.test.tsx` - Provider and useTheme hook tests
- `stability.test.ts` - Class name consistency and rerender prevention

**Status:** Well organized, minimal overlap

#### 5. Edge Cases & Validation
- `edge-cases.test.ts` - Error handling and boundary conditions
- `theme-validation.test.ts` - Theme structure validation

**Status:** Well organized

#### 6. Animation Tests
- `keyframes-animation.test.ts` - Keyframes functionality

**Status:** Well organized but could be merged with core tests

#### 7. Utilities
- `helpers.ts` - Test utilities

**Status:** Good

### Coverage Analysis

#### ✅ Well Covered:
- Core API (css, styled, globalCss, keyframes)
- Type safety and inference
- Theme management (Provider, useTheme)
- CSS injection and deduplication
- Edge cases and error handling
- Stringification (CSS property conversion)
- Stability (class name consistency)

#### ⚠️ Potentially Missing or Light Coverage:
- **Media queries** - Only basic tests in stoop.test.ts
- **Utility functions** - Basic tests but could be more comprehensive
- **Nested selectors** - Some tests but could be more thorough
- **Theme token resolution** - Good coverage but could test more edge cases
- **SSR-specific behavior** - Some tests but could be more comprehensive
- **Performance** - No explicit performance tests
- **Memory leaks** - No explicit memory leak tests
- **Concurrent usage** - No tests for multiple instances running simultaneously
- **Theme switching** - Basic tests but could test more scenarios
- **CSS specificity** - Not explicitly tested
- **Vendor prefix handling** - Good coverage in stringification
- **Invalid CSS handling** - Some coverage but could be more comprehensive

### File Organization Issues

1. **Too many type-only test files** (5 files)
   - Should consolidate into 1-2 files
   - Separate runtime vs compile-time tests clearly

2. **Overlapping concerns**
   - `injection.test.ts` vs `css-duplication.test.ts`
   - `auto-inference-verification.test.ts` vs `test-auto-inference.ts`

3. **Inconsistent naming**
   - Some files use `.test.ts`, others use `.ts`
   - Type-only tests should have clear naming convention

4. **Large files**
   - `stoop.test.ts` is 924 lines - should be split by feature

### Proposed Reorganization

#### Group 1: Type Safety (consolidate to 2 files)
- `type-safety.test.ts` - Runtime type safety tests
- `type-safety-compile.test.ts` - Compile-time type-only tests (all variants, boolean, button, auto-inference)

#### Group 2: Core API (split stoop.test.ts)
- `core-api.test.ts` - createStoop, css, getCssText, warmCache
- `styled-components.test.ts` - styled function, variants, polymorphism
- `global-css.test.ts` - globalCss function
- `keyframes.test.ts` - keyframes function (merge with keyframes-animation.test.ts)

#### Group 3: CSS Generation (consolidate)
- `css-generation.test.ts` - Stringification, injection, deduplication (merge 3 files)

#### Group 4: Theme Management
- `theme.test.ts` - Theme validation, createTheme (merge theme-validation.test.ts)
- `theme-provider.test.tsx` - Provider and useTheme (rename from provider.test.tsx)

#### Group 5: Edge Cases & Stability
- `edge-cases.test.ts` - Keep as is
- `stability.test.ts` - Keep as is

#### Group 6: Utilities
- `helpers.ts` - Keep as is

### Recommendations

1. **Consolidate type tests** - Reduce from 5 files to 2
2. **Split large files** - Break stoop.test.ts into feature-specific files
3. **Merge overlapping tests** - Combine injection and css-duplication tests
4. **Standardize naming** - All test files should use `.test.ts` or `.test.tsx`
5. **Add missing coverage** - Media queries, utility functions, SSR edge cases
6. **Consistent comments** - Add file-level JSDoc comments to all test files
7. **Group related tests** - Use describe blocks more consistently
