import { createStitches } from "@stitches/react";
import { createElement } from "react";
import { createStoop } from "stoop";

import { sharedTheme } from "../shared-theme";
import { measureTime, type BenchmarkResult } from "../utils";

export function benchmarkVariantUpdates(): { stoop: BenchmarkResult; stitches: BenchmarkResult } {
  const stoop = createStoop({ theme: sharedTheme });

  const stitches = createStitches({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme: sharedTheme as any,
  });

  const ButtonStoop = stoop.styled(
    "button",
    {
      padding: "$space.medium",
    },
    {
      size: {
        large: { padding: "$space.large" },
        small: { padding: "$space.small" },
      },
    },
  );

  const ButtonStitches = stitches.styled(
    "button",
    {
      padding: "$medium",
    },
    {
      size: {
        large: { padding: "$large" },
        small: { padding: "$small" },
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  );

  // Test actual variant prop changes by creating elements with different variants
  // This triggers CSS generation for each variant combination
  const stoopResult = measureTime(
    "Variant Updates",
    "stoop",
    () => {
      // Create elements with different variant props to test CSS generation
      createElement(ButtonStoop, { size: "small" });
      createElement(ButtonStoop, { size: "large" });
      createElement(ButtonStoop, { size: "small" }); // Test caching
    },
    500,
  );

  const stitchesResult = measureTime(
    "Variant Updates",
    "stitches",
    () => {
      createElement(ButtonStitches, { size: "small" });
      createElement(ButtonStitches, { size: "large" });
      createElement(ButtonStitches, { size: "small" }); // Test caching
    },
    500,
  );

  return { stitches: stitchesResult, stoop: stoopResult };
}
