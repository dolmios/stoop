import { createStitches } from "@stitches/react";
import { createStoop } from "stoop";

import type { BenchmarkResult } from "../utils";

import { sharedTheme } from "../shared-theme";
import { measureTime } from "../utils";

export function benchmarkDeepTree(): { stoop: BenchmarkResult; stitches: BenchmarkResult } {
  const stoop = createStoop({ theme: sharedTheme });

  const stitches = createStitches({
    theme: sharedTheme as any,
  });

  const stoopResult = measureTime(
    "Deep Tree (20 levels)",
    "stoop",
    () => {
      // Create multiple styled components to simulate deep tree CSS generation
      for (let i = 0; i < 20; i++) {
        stoop.styled("div", { marginTop: `${i}px`, padding: `$space.small` });
      }
    },
    100,
  );

  const stitchesResult = measureTime(
    "Deep Tree (20 levels)",
    "stitches",
    () => {
      for (let i = 0; i < 20; i++) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stitches.styled("div", { marginTop: `${i}px`, padding: "$small" } as any);
      }
    },
    100,
  );

  return { stitches: stitchesResult, stoop: stoopResult };
}
