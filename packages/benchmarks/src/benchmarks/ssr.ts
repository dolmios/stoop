import { createStitches } from "@stitches/react";
import { createElement } from "react";
import { createStoop } from "stoop";

import { sharedTheme } from "../shared-theme";
import { measureTime, type BenchmarkResult } from "../utils";

/**
 * SSR-specific benchmarks that test server-side rendering scenarios.
 * These benchmarks simulate Next.js SSR patterns where CSS is generated
 * on the server and serialized.
 */
export function benchmarkSSR(): {
  cssTextGeneration: { stoop: BenchmarkResult; stitches: BenchmarkResult };
  multipleRequests: { stoop: BenchmarkResult; stitches: BenchmarkResult };
  themeSwitching: { stoop: BenchmarkResult; stitches: BenchmarkResult };
} {
  // Test CSS text generation (used in SSR for extracting CSS)
  const cssTextGeneration = (() => {
    const stoop = createStoop({ theme: sharedTheme });
    const stitches = createStitches({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      theme: sharedTheme as any,
    });

    const BoxStoop = stoop.styled("div", {
      backgroundColor: "$colors.background",
      color: "$colors.text",
      padding: "$space.medium",
    });

    const BoxStitches = stitches.styled("div", {
      backgroundColor: "$background",
      color: "$text",
      padding: "$medium",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const stoopResult = measureTime(
      "SSR CSS Text Generation",
      "stoop",
      () => {
        // Simulate SSR: create components and extract CSS
        createElement(BoxStoop, {});
        createElement(BoxStoop, { css: { margin: "$space.small" } });
        // Extract CSS text (simulating getCssText() call)
        stoop.getCssText();
      },
      200,
      {
        maxIterations: 2000,
        minIterations: 100,
        targetPrecision: 0.05,
      },
    );

    const stitchesResult = measureTime(
      "SSR CSS Text Generation",
      "stitches",
      () => {
        createElement(BoxStitches, {});
        createElement(BoxStitches, {
          css: { margin: "$small" },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
        stitches.getCssText();
      },
      200,
      {
        maxIterations: 2000,
        minIterations: 100,
        targetPrecision: 0.05,
      },
    );

    return { stitches: stitchesResult, stoop: stoopResult };
  })();

  // Test multiple request handling (simulating multiple SSR requests)
  const multipleRequests = (() => {
    const stoopResult = measureTime(
      "SSR Multiple Requests",
      "stoop",
      () => {
        // Simulate a new request: create fresh instance
        const stoop = createStoop({ theme: sharedTheme });
        const Box = stoop.styled("div", {
          backgroundColor: "$colors.background",
          padding: "$space.medium",
        });

        createElement(Box, {});
        stoop.getCssText();
      },
      100,
      {
        maxIterations: 1000,
        minIterations: 50,
        targetPrecision: 0.1,
      },
    );

    const stitchesResult = measureTime(
      "SSR Multiple Requests",
      "stitches",
      () => {
        const stitches = createStitches({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          theme: sharedTheme as any,
        });
        const Box = stitches.styled("div", {
          backgroundColor: "$background",
          padding: "$medium",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        createElement(Box, {});
        stitches.getCssText();
      },
      100,
      {
        maxIterations: 1000,
        minIterations: 50,
        targetPrecision: 0.1,
      },
    );

    return { stitches: stitchesResult, stoop: stoopResult };
  })();

  // Test theme switching performance (important for multi-theme SSR)
  const themeSwitching = (() => {
    const stoop = createStoop({ theme: sharedTheme });
    const stitches = createStitches({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      theme: sharedTheme as any,
    });

    const BoxStoop = stoop.styled("div", {
      backgroundColor: "$colors.background",
      color: "$colors.text",
    });

    const BoxStitches = stitches.styled("div", {
      backgroundColor: "$background",
      color: "$text",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // Create alternate theme
    const alternateTheme = {
      colors: {
        background: "#000000",
        border: "#333333",
        hover: "#1a1a1a",
        primary: "#00ff00",
        secondary: "#888888",
        text: "#ffffff",
      },
      shadows: sharedTheme.shadows,
      space: sharedTheme.space,
    };

    const stoopResult = measureTime(
      "SSR Theme Switching",
      "stoop",
      () => {
        // Simulate theme switching by creating new instance with different theme
        const stoopWithTheme = createStoop({ theme: alternateTheme });
        const Box = stoopWithTheme.styled("div", {
          backgroundColor: "$colors.background",
          color: "$colors.text",
        });

        createElement(Box, {});
        stoopWithTheme.getCssText();
      },
      100,
      {
        maxIterations: 1000,
        minIterations: 50,
        targetPrecision: 0.1,
      },
    );

    const stitchesResult = measureTime(
      "SSR Theme Switching",
      "stitches",
      () => {
        const stitchesWithTheme = createStitches({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          theme: alternateTheme as any,
        });
        const Box = stitchesWithTheme.styled("div", {
          backgroundColor: "$background",
          color: "$text",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        createElement(Box, {});
        stitchesWithTheme.getCssText();
      },
      100,
      {
        maxIterations: 1000,
        minIterations: 50,
        targetPrecision: 0.1,
      },
    );

    return { stitches: stitchesResult, stoop: stoopResult };
  })();

  return {
    cssTextGeneration,
    multipleRequests,
    themeSwitching,
  };
}
