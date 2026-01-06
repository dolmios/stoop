# Build Process Analysis: stoop & stoop-ui

## Current State

### stoop Package
- **Build Tool**: `bun build` (native Bun bundler)
- **JSX Transform**: `--jsx=automatic` ✅ (modern)
- **Type Generation**: `bunx tsc` (TypeScript compiler)
- **Build Steps**: Sequential (clean → js → js:ssr → types)
- **Output**: Single bundle files for main and SSR

### stoop-ui Package
- **Build Tool**: `bun build` (native Bun bundler)
- **JSX Transform**: `--jsx=react` ❌ (legacy, uses React.createElement)
- **Type Generation**: `bunx tsc` (TypeScript compiler)
- **Build Steps**: Sequential (clean → js → types)
- **Post-processing**: Node.js script to add "use client" directive
- **Unused File**: `build.ts` exists but not referenced

## Issues Identified

### 1. **Inconsistent JSX Transform**
- `stoop` uses modern `--jsx=automatic` (React 17+)
- `stoop-ui` uses legacy `--jsx=react` with manual factory/fragment
- **Impact**: Larger bundle size, less optimal code generation

### 2. **Node.js Script for "use client"**
- Uses `node -e` with CommonJS `require()` in an ESM package
- Could use Bun's native file APIs instead
- **Impact**: Extra dependency on Node.js, slower execution

### 3. **Sequential Build Steps**
- Build steps run sequentially with `&&`
- Bun can handle parallelization better
- **Impact**: Slower builds, underutilized CPU

### 4. **Shell Commands Instead of Bun APIs**
- Uses `rm -rf` and `mkdir -p` shell commands
- Could use Bun's native file system APIs
- **Impact**: Less portable, slower, platform-dependent

### 5. **Unused build.ts File**
- `stoop-ui/build.ts` exists but isn't used
- Suggests a different build approach was considered
- **Impact**: Confusion, dead code

### 6. **No Source Maps**
- Neither package generates source maps
- **Impact**: Harder debugging in production

### 7. **Using bunx tsc**
- While functional, doesn't leverage Bun's native TypeScript capabilities
- **Impact**: Potentially slower type generation

## Recommendations

### High Priority

1. **Standardize JSX Transform**
   - Update `stoop-ui` to use `--jsx=automatic` (like `stoop`)
   - Remove manual `--jsx-factory` and `--jsx-fragment` flags
   - **Benefit**: Smaller bundles, better tree-shaking, modern React

2. **Replace Node.js Script with Bun**
   - Use `Bun.write()` and `Bun.file()` for file operations
   - Native Bun script instead of `node -e`
   - **Benefit**: Faster, no Node.js dependency, better integration

3. **Use Bun's File APIs**
   - Replace `rm -rf` with `Bun.$` or file system APIs
   - Use Bun's native directory operations
   - **Benefit**: Faster, more portable, better error handling

### Medium Priority

4. **Parallelize Build Steps**
   - Use Bun's parallel execution capabilities
   - Run independent steps concurrently
   - **Benefit**: Faster builds

5. **Remove or Update build.ts**
   - Either integrate `build.ts` into the build process or remove it
   - If keeping, update to use modern Bun APIs
   - **Benefit**: Cleaner codebase, less confusion

6. **Consider Source Maps**
   - Add `--sourcemap` flag to `bun build` commands
   - **Benefit**: Better debugging experience

### Low Priority

7. **Optimize Type Generation**
   - Consider if Bun's native TypeScript can replace `bunx tsc`
   - **Benefit**: Potentially faster type generation

8. **Add Build Caching**
   - Consider incremental builds
   - **Benefit**: Faster rebuilds during development

## Proposed Improvements

### stoop-ui package.json improvements:

```json
{
  "scripts": {
    "build": "bun run build.ts",
    "build:clean": "bun run build:clean.ts",
    "build:js": "NODE_ENV=production bun build ./src/index.ts --outfile ./dist/index.js --target browser --format esm --minify --jsx=automatic --external react --external react-dom --external react/jsx-runtime --external stoop --define process.env.NODE_ENV='\"production\"' && bun run build:add-client-directive.ts",
    "build:add-client-directive": "bun run build:add-client-directive.ts",
    "build:types": "bunx tsc --project tsconfig.build.json --emitDeclarationOnly"
  }
}
```

### Key Changes:
1. Use `--jsx=automatic` instead of `--jsx=react`
2. Remove `--jsx-factory` and `--jsx-fragment` flags
3. Convert Node.js script to Bun script
4. Use Bun file APIs for cleanup
