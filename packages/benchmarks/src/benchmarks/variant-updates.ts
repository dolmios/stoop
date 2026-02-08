import { createStitches } from "@stitches/react";
import { createElement } from "react";
import { createStoop } from "stoop";

import type { BenchmarkResult } from "../utils";

import { sharedTheme } from "../shared-theme";
import { measureTime } from "../utils";

export function benchmarkVariantUpdates(): { stoop: BenchmarkResult; stitches: BenchmarkResult } {
  // Create fresh instances for isolation
  const stoop = createStoop({ theme: sharedTheme });
  const stitches = createStitches({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme: sharedTheme as any,
  });

  // Create styled components with multiple variants to test variant resolution
  const ButtonStoop = stoop.styled(
    "button",
    {
      backgroundColor: "$primary",
      padding: "$medium",
    },
    {
      size: {
        large: { fontSize: "18px", padding: "$large" },
        medium: { fontSize: "14px", padding: "$medium" },
        small: { fontSize: "12px", padding: "$small" },
      },
      variant: {
        primary: { backgroundColor: "$primary" },
        secondary: { backgroundColor: "$secondary" },
      },
    },
  );

  const ButtonStitches = stitches.styled(
    "button",
    {
      backgroundColor: "$primary",
      padding: "$medium",
    },
    {
      size: {
        large: { fontSize: "18px", padding: "$large" },
        medium: { fontSize: "14px", padding: "$medium" },
        small: { fontSize: "12px", padding: "$small" },
      },
      variant: {
        primary: { backgroundColor: "$primary" },
        secondary: { backgroundColor: "$secondary" },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  );

  // Test variant combinations and caching behavior
  const stoopResult = measureTime(
    "Variant Updates",
    "stoop",
    () => {
      // Test various variant combinations
      createElement(ButtonStoop, { size: "small", variant: "primary" });
      createElement(ButtonStoop, { size: "large", variant: "secondary" });
      createElement(ButtonStoop, { size: "medium", variant: "primary" });
      createElement(ButtonStoop, { size: "small", variant: "primary" }); // Test caching
      createElement(ButtonStoop, { size: "large", variant: "primary" }); // New combination
    },
    500,
    {
      maxIterations: 3000,
      minIterations: 300,
      targetPrecision: 0.05,
    },
  );

  const stitchesResult = measureTime(
    "Variant Updates",
    "stitches",
    () => {
      createElement(ButtonStitches, { size: "small", variant: "primary" });
      createElement(ButtonStitches, { size: "large", variant: "secondary" });
      createElement(ButtonStitches, { size: "medium", variant: "primary" });
      createElement(ButtonStitches, { size: "small", variant: "primary" }); // Test caching
      createElement(ButtonStitches, { size: "large", variant: "primary" }); // New combination
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
