import { createStitches } from "@stitches/react";
import { createElement } from "react";
import { createStoop } from "stoop";

import { sharedTheme } from "../shared-theme";
import { measureTime, type BenchmarkResult } from "../utils";

export function benchmarkCssProp(): { stoop: BenchmarkResult; stitches: BenchmarkResult } {
  // Create fresh instances for isolation
  const stoop = createStoop({ theme: sharedTheme });
  const stitches = createStitches({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme: sharedTheme as any,
  });

  const ButtonStoop = stoop.styled("button", {
    backgroundColor: "$colors.background",
    color: "$colors.text",
    padding: "$space.medium",
  });

  const ButtonStitches = stitches.styled("button", {
    backgroundColor: "$background",
    color: "$text",
    padding: "$medium",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  // Test CSS prop merging with various scenarios
  const stoopResult = measureTime(
    "CSS Prop Updates",
    "stoop",
    () => {
      // Test simple override
      createElement(ButtonStoop, {
        css: { color: "$colors.primary" },
      });
      // Test multiple property override
      createElement(ButtonStoop, {
        css: { backgroundColor: "$colors.secondary", padding: "$space.large" },
      });
      // Test complex merge with nested properties
      createElement(ButtonStoop, {
        css: {
          boxShadow: "$shadows.medium",
          color: "$colors.primary",
          margin: "$space.small",
          padding: "$space.large",
        },
      });
      // Test caching (same CSS object)
      createElement(ButtonStoop, {
        css: { color: "$colors.primary" },
      });
    },
    500,
    {
      maxIterations: 3000,
      minIterations: 300,
      targetPrecision: 0.05,
    },
  );

  const stitchesResult = measureTime(
    "CSS Prop Updates",
    "stitches",
    () => {
      createElement(ButtonStitches, {
        css: { color: "$primary" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      createElement(ButtonStitches, {
        css: { backgroundColor: "$secondary", padding: "$large" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      createElement(ButtonStitches, {
        css: { boxShadow: "$medium", color: "$primary", margin: "$small", padding: "$large" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      createElement(ButtonStitches, {
        css: { color: "$primary" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    },
    500,
    {
      maxIterations: 3000,
      minIterations: 300,
      targetPrecision: 0.05,
    },
  );

  return { stitches: stitchesResult, stoop: stoopResult };
}
