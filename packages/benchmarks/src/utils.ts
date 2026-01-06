export interface BenchmarkResult {
  name: string;
  library: "stoop" | "stitches";
  time: number;
  iterations: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
}

export function measureTime(
  name: string,
  library: "stoop" | "stitches",
  fn: () => void,
  iterations = 1000,
): BenchmarkResult {
  const times: number[] = [];

  for (let i = 0; i < 10; i++) fn();
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();

    fn();
    times.push(performance.now() - start);
  }
  const totalTime = times.reduce((a, b) => a + b, 0);

  return {
    averageTime: totalTime / iterations,
    iterations,
    library,
    maxTime: Math.max(...times),
    minTime: Math.min(...times),
    name,
    time: totalTime,
  };
}
