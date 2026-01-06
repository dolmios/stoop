import { createStitches } from "@stitches/react";
import { createElement } from "react";
import { createStoop } from "stoop";

import type { BenchmarkResult } from "../utils";

import { sharedTheme } from "../shared-theme";
import { measureTime } from "../utils";

export function benchmarkCssProp(): { stoop: BenchmarkResult; stitches: BenchmarkResult } {
  const stoop = createStoop({ theme: sharedTheme });

  const stitches = createStitches({
    theme: sharedTheme as any,
  });

  const ButtonStoop = stoop.styled("button", {
    padding: "$space.medium",
  });

  const ButtonStitches = stitches.styled("button", {
    padding: "$medium",
  } as any);

  // Test actual css prop usage by creating elements with css prop
  const stoopResult = measureTime(
    "CSS Prop Updates",
    "stoop",
    () => {
      // Create elements with css prop to test CSS generation and merging
      createElement(ButtonStoop, {
        css: { color: "$colors.primary" },
      });
      createElement(ButtonStoop, {
        css: { backgroundColor: "$colors.secondary" },
      });
      createElement(ButtonStoop, {
        css: { color: "$colors.primary", padding: "$space.large" },
      });
    },
    500,
  );

  const stitchesResult = measureTime(
    "CSS Prop Updates",
    "stitches",
    () => {
      createElement(ButtonStitches, {
        css: { color: "$primary" },
      } as any);

      createElement(ButtonStitches, {
        css: { backgroundColor: "$secondary" },
      } as any);

      createElement(ButtonStitches, {
        css: { color: "$primary", padding: "$large" },
      } as any);
    },
    500,
  );

  return { stitches: stitchesResult, stoop: stoopResult };
}
