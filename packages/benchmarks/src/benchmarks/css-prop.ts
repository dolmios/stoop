import { createStitches } from "@stitches/react";
import { createElement } from "react";
import { createStoop } from "stoop";

import type { BenchmarkResult } from "../utils";

import { sharedTheme } from "../shared-theme";
import { measureTime } from "../utils";

export function benchmarkCssProp(): { stoop: BenchmarkResult; stitches: BenchmarkResult } {
  // Create fresh instances for isolation
  const stoop = createStoop({ theme: sharedTheme });
  const stitches = createStitches({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme: sharedTheme as any,
  });

  const ButtonStoop = stoop.styled("button", {
    backgroundColor: "$background",
    color: "$text",
    padding: "$medium",
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
        css: { color: "$primary" },
      });
      // Test multiple property override
      createElement(ButtonStoop, {
        css: { backgroundColor: "$secondary", padding: "$large" },
      });
      // Test complex merge with nested properties
      createElement(ButtonStoop, {
        css: {
          boxShadow: "$medium",
          color: "$primary",
          margin: "$small",
          padding: "$large",
        },
      });
      // Test caching (same CSS object)
      createElement(ButtonStoop, {
        css: { color: "$primary" },
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
