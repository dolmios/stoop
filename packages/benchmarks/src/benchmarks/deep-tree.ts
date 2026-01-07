import { createStitches } from "@stitches/react";
import { createElement } from "react";
import { createStoop } from "stoop";

import { sharedTheme } from "../shared-theme";
import { measureTime, type BenchmarkResult } from "../utils";

export function benchmarkDeepTree(): { stoop: BenchmarkResult; stitches: BenchmarkResult } {
  // Create fresh instances for isolation
  const stoop = createStoop({ theme: sharedTheme });
  const stitches = createStitches({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme: sharedTheme as any,
  });

  const stoopResult = measureTime(
    "Deep Tree (20 levels)",
    "stoop",
    () => {
      // Create nested styled components to simulate deep tree CSS generation
      // Each level uses different styles to ensure CSS is generated
      const components: Array<ReturnType<typeof stoop.styled>> = [];

      for (let i = 0; i < 20; i++) {
        components.push(
          stoop.styled("div", {
            backgroundColor: i % 2 === 0 ? "$colors.background" : "$colors.hover",
            color: "$colors.text",
            marginTop: `${i}px`,
            padding: "$space.small",
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
      maxIterations: 1000,
      minIterations: 50,
      targetPrecision: 0.1, // Lower precision for longer-running test
    },
  );

  const stitchesResult = measureTime(
    "Deep Tree (20 levels)",
    "stitches",
    () => {
      const components: Array<ReturnType<typeof stitches.styled>> = [];

      for (let i = 0; i < 20; i++) {
        components.push(
          stitches.styled("div", {
            backgroundColor: i % 2 === 0 ? "$background" : "$hover",
            color: "$text",
            marginTop: `${i}px`,
            padding: "$small",
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
      maxIterations: 1000,
      minIterations: 50,
      targetPrecision: 0.1,
    },
  );

  return { stitches: stitchesResult, stoop: stoopResult };
}
