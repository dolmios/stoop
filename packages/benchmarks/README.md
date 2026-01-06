# stoop-benchmarks

Performance benchmarks comparing Stoop vs Stitches CSS-in-JS libraries.

## Overview

This package provides a comprehensive benchmark suite for comparing Stoop's performance against Stitches. The benchmarks test core CSS-in-JS operations including CSS generation, variant handling, and React component rendering.

## Installation

This is a private package within the Stoop monorepo. To run benchmarks:

```sh
# From repository root
bun run benchmark

# Or from this package
cd packages/benchmarks
bun run benchmark
```

## Benchmarks

The benchmark suite includes:

### CSS Generation Benchmarks

- **Initial Injection** - Time to generate CSS classes for initial styles
- **Variant Updates** - Performance when variant props change on styled components
- **CSS Prop Updates** - Performance when applying styles via the `css` prop
- **Deep Tree** - CSS generation for deeply nested component trees (20 levels)
- **Wide Tree** - CSS generation for wide component trees (100 siblings)

### React Rendering Benchmarks

- **Simple Components** - Component creation and CSS generation
- **Components with Variants** - Variant-heavy component rendering
- **Nested Component Trees** - Complex nested component structures

### Bundle Size Analysis

Comprehensive bundle size analysis including:

- Direct dist file analysis (most accurate)
- Tree-shaking validation across different import scenarios
- Gzip compression metrics
- Side-by-side comparison with Stitches

## Usage

### Running Performance Benchmarks

```sh
bun run benchmark
```

This runs all performance benchmarks and outputs detailed timing statistics.

### Running Bundle Analysis

```sh
bun run analyze:bundle
```

Analyzes bundle sizes for both Stoop and Stitches across multiple scenarios.

### Exporting Bundle Data

```sh
bun run export:bundle-data
```

Exports bundle analysis data in formats suitable for website consumption.

## Methodology

### Test Environment

- Runtime: Bun
- React: v19.2.3
- Stitches: v1.2.8
- Stoop: Latest from workspace

### Measurement Approach

- Each test runs multiple iterations (100-1000 depending on test)
- Includes warmup runs to avoid JIT compilation effects
- Reports average, minimum, and maximum times
- Uses `performance.now()` for high-resolution timing

### Fairness Considerations

- Both libraries use identical theme configurations
- Both test equivalent operations
- Same measurement methodology
- API differences are accounted for (Stitches `$primary` vs Stoop `$colors.primary`)

## Results

Benchmark results are not included in this README. To see current performance metrics, run the benchmarks yourself:

```sh
bun run benchmark
```

Results may vary based on:

- System performance
- Runtime version (Bun/Node.js)
- CPU architecture
- Background processes

## Development

```sh
# Run benchmarks
bun run benchmark

# Run bundle analysis
bun run analyze:bundle

# Watch mode (if supported)
bun run benchmark:watch
```

## Structure

```
packages/benchmarks/
├── src/
│   ├── benchmarks/          # Individual benchmark tests
│   │   ├── initial-injection.ts
│   │   ├── variant-updates.ts
│   │   ├── css-prop.ts
│   │   ├── deep-tree.ts
│   │   ├── wide-tree.ts
│   │   └── react-rendering.ts
│   ├── bundle-analyzer.ts    # Bundle size analysis
│   ├── benchmark.ts          # Main benchmark runner
│   ├── shared-theme.ts       # Shared theme config
│   └── utils.ts              # Benchmark utilities
└── README.md
```

## Notes

- **Important**: Run `bun run build` in the root directory before analyzing bundles to ensure dist files exist
- Benchmarks are designed to be transparent and reproducible
- All benchmark code is open source and can be inspected for accuracy
- Methodology is documented and can be verified independently

## License

MIT
