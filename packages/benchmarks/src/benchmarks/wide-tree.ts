import { createStitches } from "@stitches/react";
import { createStoop } from "stoop";

import { sharedTheme } from "../shared-theme";
import { measureTime, type BenchmarkResult } from "../utils";

export function benchmarkWideTree(): { stoop: BenchmarkResult; stitches: BenchmarkResult } {
  const stoop = createStoop({ theme: sharedTheme });

  const stitches = createStitches({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme: sharedTheme as any,
  });

  const stoopResult = measureTime(
    "Wide Tree (100 siblings)",
    "stoop",
    () => {
      // Create multiple styled components to simulate wide tree CSS generation
      for (let i = 0; i < 100; i++) {
        stoop.styled("div", { padding: `$space.small`, width: `${i}px` });
      }
    },
    100,
  );

  const stitchesResult = measureTime(
    "Wide Tree (100 siblings)",
    "stitches",
    () => {
      for (let i = 0; i < 100; i++) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stitches.styled("div", { padding: "$small", width: `${i}px` } as any);
      }
    },
    100,
  );

  return { stitches: stitchesResult, stoop: stoopResult };
}
