import { createStitches } from "@stitches/react";
import { createElement } from "react";
import { createStoop } from "stoop";

import type { BenchmarkResult } from "../utils";

import { sharedTheme } from "../shared-theme";
import { measureTime } from "../utils";

export function benchmarkWideTree(): { stoop: BenchmarkResult; stitches: BenchmarkResult } {
  // Create fresh instances for isolation
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
      const components: Array<ReturnType<typeof stoop.styled>> = [];

      for (let i = 0; i < 100; i++) {
        components.push(
          stoop.styled("div", {
            backgroundColor: "$background",
            margin: i % 2 === 0 ? "$small" : "$medium",
            padding: "$small",
            width: `${i}px`,
          }),
        );
      }
      // Actually use the components to trigger CSS generation
      for (const Component of components) {
        createElement(Component, {});
      }
    },
    100,
    {
      maxIterations: 500,
      minIterations: 50,
      targetPrecision: 0.1, // Lower precision for longer-running test
    },
  );

  const stitchesResult = measureTime(
    "Wide Tree (100 siblings)",
    "stitches",
    () => {
      const components: Array<ReturnType<typeof stitches.styled>> = [];

      for (let i = 0; i < 100; i++) {
        components.push(
          stitches.styled("div", {
            backgroundColor: "$background",
            margin: i % 2 === 0 ? "$small" : "$medium",
            padding: "$small",
            width: `${i}px`,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any),
        );
      }
      for (const Component of components) {
        createElement(Component, {});
      }
    },
    100,
    {
      maxIterations: 500,
      minIterations: 50,
      targetPrecision: 0.1,
    },
  );

  return { stitches: stitchesResult, stoop: stoopResult };
}
