export interface MemorySnapshot {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
  timestamp: number;
}

export interface BenchmarkResult {
  name: string;
  library: "stoop" | "stitches";
  time: number;
  iterations: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  medianTime: number;
  stdDev: number;
  p95: number;
  p99: number;
  outliers: number;
  confidenceInterval: {
    lower: number;
    upper: number;
    level: number;
  };
  memory?: {
    before: MemorySnapshot;
    after: MemorySnapshot;
    delta: {
      heapUsed: number;
      heapTotal: number;
      external: number;
      rss: number;
    };
  };
}

/**
 * Calculates standard deviation
 */
function calculateStdDev(values: number[], mean: number): number {
  const variance =
    values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;

  return Math.sqrt(variance);
}

/**
 * Calculates percentile
 */
function calculatePercentile(sortedValues: number[], percentile: number): number {
  const index = Math.ceil((percentile / 100) * sortedValues.length) - 1;

  return sortedValues[Math.max(0, Math.min(index, sortedValues.length - 1))];
}

/**
 * Detects outliers using IQR (Interquartile Range) method
 */
function detectOutliers(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = calculatePercentile(sorted, 25);
  const q3 = calculatePercentile(sorted, 75);
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return values.filter((value) => value < lowerBound || value > upperBound).length;
}

/**
 * Calculates confidence interval using t-distribution approximation
 * For large samples (n > 30), uses normal approximation
 */
function calculateConfidenceInterval(
  values: number[],
  mean: number,
  stdDev: number,
  confidenceLevel = 0.95,
): { lower: number; upper: number; level: number } {
  const n = values.length;
  // For large samples, use z-score (1.96 for 95% confidence)
  // For smaller samples, would use t-distribution, but approximation is fine for benchmarks
  const zScore = confidenceLevel === 0.95 ? 1.96 : confidenceLevel === 0.99 ? 2.576 : 1.96;
  const marginOfError = (zScore * stdDev) / Math.sqrt(n);

  return {
    level: confidenceLevel,
    lower: Math.max(0, mean - marginOfError),
    upper: mean + marginOfError,
  };
}

/**
 * Gets current memory snapshot
 */
function getMemorySnapshot(): MemorySnapshot {
  if (typeof process !== "undefined" && process.memoryUsage) {
    const usage = process.memoryUsage();

    return {
      external: usage.external,
      heapTotal: usage.heapTotal,
      heapUsed: usage.heapUsed,
      rss: usage.rss,
      timestamp: performance.now(),
    };
  }

  // Fallback for environments without process.memoryUsage
  return {
    external: 0,
    heapTotal: 0,
    heapUsed: 0,
    rss: 0,
    timestamp: performance.now(),
  };
}

/**
 * Determines optimal warmup iterations based on variance stabilization
 */
function determineWarmupIterations(fn: () => void, maxWarmup = 50): number {
  const samples: number[] = [];
  let lastVariance = Infinity;
  let stableCount = 0;

  for (let i = 0; i < maxWarmup; i++) {
    const start = performance.now();

    fn();
    const time = performance.now() - start;

    samples.push(time);

    if (samples.length >= 10) {
      const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
      const variance =
        samples.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / samples.length;

      // Check if variance is stabilizing (not decreasing significantly)
      if (Math.abs(variance - lastVariance) / lastVariance < 0.1) {
        stableCount++;
        if (stableCount >= 3) {
          return i + 1; // Variance stabilized
        }
      } else {
        stableCount = 0;
      }

      lastVariance = variance;
    }
  }

  return maxWarmup; // Default to max if not stabilized
}

/**
 * Determines optimal iteration count based on desired precision
 */
function determineIterations(
  fn: () => void,
  targetPrecision = 0.05, // 5% relative error
  minIterations = 100,
  maxIterations = 10000,
): number {
  // Run a small sample to estimate variance
  const sampleSize = Math.min(50, maxIterations);
  const samples: number[] = [];

  for (let i = 0; i < sampleSize; i++) {
    const start = performance.now();

    fn();
    samples.push(performance.now() - start);
  }

  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  const stdDev = calculateStdDev(samples, mean);
  const cv = stdDev / mean; // Coefficient of variation

  // Estimate required iterations: n = (z * cv / precision)^2
  const zScore = 1.96; // 95% confidence
  const estimatedIterations = Math.ceil(Math.pow((zScore * cv) / targetPrecision, 2));

  return Math.max(minIterations, Math.min(estimatedIterations, maxIterations));
}

export interface MeasureTimeOptions {
  /**
   * Number of iterations to run. If not provided, will be auto-determined.
   */
  iterations?: number;
  /**
   * Number of warmup iterations. If not provided, will be auto-determined.
   */
  warmupIterations?: number;
  /**
   * Target precision for relative error (default: 0.05 = 5%)
   */
  targetPrecision?: number;
  /**
   * Minimum iterations (default: 100)
   */
  minIterations?: number;
  /**
   * Maximum iterations (default: 10000)
   */
  maxIterations?: number;
  /**
   * Confidence level for confidence interval (default: 0.95)
   */
  confidenceLevel?: number;
  /**
   * Whether to track memory usage (default: false)
   */
  trackMemory?: boolean;
}

export function measureTime(
  name: string,
  library: "stoop" | "stitches",
  fn: () => void,
  iterations?: number,
  options: MeasureTimeOptions = {},
): BenchmarkResult {
  const {
    confidenceLevel = 0.95,
    maxIterations = 10000,
    minIterations = 100,
    targetPrecision = 0.05,
    trackMemory = false,
    warmupIterations,
  } = options;

  // Get initial memory snapshot if tracking
  const memoryBefore = trackMemory ? getMemorySnapshot() : null;

  // Determine optimal warmup iterations
  const actualWarmup = warmupIterations ?? determineWarmupIterations(fn);

  // Warmup phase
  for (let i = 0; i < actualWarmup; i++) {
    fn();
  }

  // Determine optimal iteration count if not provided
  const actualIterations =
    iterations ?? determineIterations(fn, targetPrecision, minIterations, maxIterations);

  // Measurement phase
  const times: number[] = [];

  for (let i = 0; i < actualIterations; i++) {
    const start = performance.now();

    fn();
    times.push(performance.now() - start);
  }

  // Get final memory snapshot if tracking
  const memoryAfter = trackMemory ? getMemorySnapshot() : null;

  // Calculate statistics
  const sortedTimes = [...times].sort((a, b) => a - b);
  const totalTime = times.reduce((a, b) => a + b, 0);
  const averageTime = totalTime / actualIterations;
  const medianTime = calculatePercentile(sortedTimes, 50);
  const stdDev = calculateStdDev(times, averageTime);
  const p95 = calculatePercentile(sortedTimes, 95);
  const p99 = calculatePercentile(sortedTimes, 99);
  const outliers = detectOutliers(times);
  const confidenceInterval = calculateConfidenceInterval(
    times,
    averageTime,
    stdDev,
    confidenceLevel,
  );

  // Calculate memory delta if tracking
  const memory =
    memoryBefore && memoryAfter
      ? {
          after: memoryAfter,
          before: memoryBefore,
          delta: {
            external: memoryAfter.external - memoryBefore.external,
            heapTotal: memoryAfter.heapTotal - memoryBefore.heapTotal,
            heapUsed: memoryAfter.heapUsed - memoryBefore.heapUsed,
            rss: memoryAfter.rss - memoryBefore.rss,
          },
        }
      : undefined;

  return {
    averageTime,
    confidenceInterval,
    iterations: actualIterations,
    library,
    maxTime: Math.max(...times),
    medianTime,
    memory,
    minTime: Math.min(...times),
    name,
    outliers,
    p95,
    p99,
    stdDev,
    time: totalTime,
  };
}
