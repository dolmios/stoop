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

- **Initial Injection** - Time to generate CSS classes for initial styles with multiple token types
- **Variant Updates** - Performance when variant props change on styled components (tests multiple variant combinations and caching)
- **CSS Prop Updates** - Performance when applying styles via the `css` prop (tests merging and override scenarios)
- **Deep Tree** - CSS generation for deeply nested component trees (20 levels)
- **Wide Tree** - CSS generation for wide component trees (100 siblings)

### React Rendering Benchmarks

- **Simple Components** - Component creation and CSS generation
- **Components with Variants** - Variant-heavy component rendering with multiple variant combinations
- **Nested Component Trees** - Complex nested component structures

### SSR Benchmarks

- **CSS Text Generation** - Performance of `getCssText()` calls used in SSR
- **Multiple Requests** - Performance when creating new instances for each SSR request
- **Theme Switching** - Performance when switching themes in SSR scenarios

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

- **Adaptive Iterations**: Each test automatically determines optimal iteration count based on variance (50-10,000 iterations)
- **Smart Warmup**: Warmup iterations are determined dynamically based on variance stabilization (up to 50 warmup runs)
- **Statistical Rigor**:
  - Reports average, median, minimum, maximum times
  - Calculates standard deviation and percentiles (P95, P99)
  - Provides 95% confidence intervals
  - Detects and reports outliers using IQR method
- **High-Resolution Timing**: Uses `performance.now()` for microsecond precision
- **Memory Tracking**: Optional memory profiling to track heap usage
- **Validation**: Automatic validation of results to detect measurement errors and ensure fair comparisons

### Fairness Considerations

- **Isolated Instances**: Each benchmark creates fresh library instances to prevent state pollution
- **Identical Themes**: Both libraries use identical theme configurations
- **Equivalent Operations**: Both test equivalent operations with similar complexity
- **Same Methodology**: Identical measurement approach, iteration counts, and statistical analysis
- **API Differences**: Accounted for (Stitches `$primary` vs Stoop `$colors.primary`)
- **Validation**: Automatic checks ensure:
  - Similar iteration counts between libraries
  - Statistical significance of differences
  - Reasonable variance and outlier ratios
  - Confidence interval validity

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
│   │   ├── react-rendering.ts
│   │   └── ssr.ts           # SSR-specific benchmarks
│   ├── bundle-analyzer.ts    # Bundle size analysis
│   ├── benchmark.ts          # Main benchmark runner
│   ├── shared-theme.ts       # Shared theme config
│   ├── utils.ts              # Benchmark utilities with statistical analysis
│   └── validation.ts         # Validation utilities for fair comparisons
└── README.md
```

## Improvements & Robustness

This benchmark suite has been significantly enhanced to ensure accuracy and prevent misleading results:

### Statistical Rigor

- **Confidence Intervals**: All results include 95% confidence intervals to indicate measurement precision
- **Outlier Detection**: Automatic detection and reporting of outliers using IQR method
- **Variance Analysis**: Coefficient of variation tracking to identify unstable measurements
- **Percentile Reporting**: P95 and P99 percentiles provide insight into tail performance

### Adaptive Measurement

- **Dynamic Iterations**: Iteration counts are determined automatically based on variance to achieve target precision
- **Smart Warmup**: Warmup runs continue until variance stabilizes, ensuring JIT compilation effects are minimized
- **Precision Targets**: Each benchmark targets a specific precision level (3-10% relative error)

### Validation & Fairness

- **Result Validation**: Automatic checks for measurement errors, invalid data, and unrealistic values
- **Comparison Validation**: Ensures benchmarks are comparable (similar iteration counts, statistical significance checks)
- **Isolation**: Each benchmark creates fresh library instances to prevent state pollution
- **Warning System**: Comprehensive warnings for potential issues (high variance, overlapping confidence intervals, etc.)

### Enhanced Scenarios

- **Realistic Workloads**: Benchmarks test actual usage patterns (variant combinations, CSS prop merging, etc.)
- **SSR Support**: Dedicated benchmarks for server-side rendering scenarios
- **Memory Tracking**: Optional memory profiling to track heap usage patterns

## Notes

- **Important**: Run `bun run build` in the root directory before analyzing bundles to ensure dist files exist
- Benchmarks are designed to be transparent and reproducible
- All benchmark code is open source and can be inspected for accuracy
- Methodology is documented and can be verified independently
- Results include validation warnings - pay attention to these to ensure reliable comparisons

## License

MIT
