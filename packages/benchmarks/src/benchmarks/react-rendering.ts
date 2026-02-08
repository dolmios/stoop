/* eslint-disable react/no-children-prop */
import { createStitches } from "@stitches/react";
import { createElement } from "react";
import { createStoop } from "stoop";

import type { BenchmarkResult } from "../utils";

import { sharedTheme } from "../shared-theme";
import { measureTime } from "../utils";

/**
 * React rendering benchmarks that test component creation and CSS generation together.
 * Note: These benchmarks use createElement which creates React elements but doesn't
 * actually render to the DOM. For true DOM rendering benchmarks, see browser-based tests.
 */
export function benchmarkReactRendering(): {
  simple: { stoop: BenchmarkResult; stitches: BenchmarkResult };
  variants: { stoop: BenchmarkResult; stitches: BenchmarkResult };
  nested: { stoop: BenchmarkResult; stitches: BenchmarkResult };
} {
  // Create fresh instances for isolation
  const stoop = createStoop({ theme: sharedTheme });
  const stitches = createStitches({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme: sharedTheme as any,
  });

  // Create styled components
  const BoxStoop = stoop.styled("div", {
    backgroundColor: "$background",
    color: "$text",
    margin: "$small",
    padding: "$medium",
  });

  const BoxStitches = stitches.styled("div", {
    backgroundColor: "$background",
    color: "$text",
    margin: "$small",
    padding: "$medium",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  const ButtonStoop = stoop.styled(
    "button",
    {
      backgroundColor: "$primary",
      borderRadius: "4px",
      color: "white",
      padding: "$small",
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
      borderRadius: "4px",
      color: "white",
      padding: "$small",
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

  // Test simple component creation and CSS generation
  const stoopSimple = measureTime(
    "React Rendering (Simple)",
    "stoop",
    () => {
      // Creating elements triggers CSS generation
      createElement(BoxStoop, { children: "Hello" });
      createElement(BoxStoop, { children: "World" });
      createElement(BoxStoop, { children: "Test" });
    },
    200,
    {
      maxIterations: 2000,
      minIterations: 100,
      targetPrecision: 0.05,
    },
  );

  const stitchesSimple = measureTime(
    "React Rendering (Simple)",
    "stitches",
    () => {
      createElement(BoxStitches, { children: "Hello" });
      createElement(BoxStitches, { children: "World" });
      createElement(BoxStitches, { children: "Test" });
    },
    200,
    {
      maxIterations: 2000,
      minIterations: 100,
      targetPrecision: 0.05,
    },
  );

  // Test component with variants - this triggers variant CSS generation
  const stoopVariants = measureTime(
    "React Rendering (With Variants)",
    "stoop",
    () => {
      createElement(ButtonStoop, { children: "Small", size: "small", variant: "primary" });
      createElement(ButtonStoop, { children: "Large", size: "large", variant: "secondary" });
      createElement(ButtonStoop, { children: "Medium", size: "medium", variant: "primary" });
      createElement(ButtonStoop, { children: "Small Again", size: "small", variant: "primary" }); // Test caching
    },
    200,
    {
      maxIterations: 2000,
      minIterations: 100,
      targetPrecision: 0.05,
    },
  );

  const stitchesVariants = measureTime(
    "React Rendering (With Variants)",
    "stitches",
    () => {
      createElement(ButtonStitches, { children: "Small", size: "small", variant: "primary" });
      createElement(ButtonStitches, { children: "Large", size: "large", variant: "secondary" });
      createElement(ButtonStitches, { children: "Medium", size: "medium", variant: "primary" });
      createElement(ButtonStitches, { children: "Small Again", size: "small", variant: "primary" }); // Test caching
    },
    200,
    {
      maxIterations: 2000,
      minIterations: 100,
      targetPrecision: 0.05,
    },
  );

  // Test nested component tree - measures CSS generation for many components
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function createNestedTreeStoop(depth: number): any {
    if (depth === 0) {
      return createElement(BoxStoop, { children: "Leaf" });
    }

    return createElement(BoxStoop, {}, createNestedTreeStoop(depth - 1));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function createNestedTreeStitches(depth: number): any {
    if (depth === 0) {
      return createElement(BoxStitches, { children: "Leaf" });
    }

    return createElement(BoxStitches, {}, createNestedTreeStitches(depth - 1));
  }

  const stoopNested = measureTime(
    "React Rendering (Nested Tree)",
    "stoop",
    () => {
      // Creating nested tree triggers CSS generation for all components
      createNestedTreeStoop(10);
    },
    100,
    {
      maxIterations: 1000,
      minIterations: 50,
      targetPrecision: 0.1,
    },
  );

  const stitchesNested = measureTime(
    "React Rendering (Nested Tree)",
    "stitches",
    () => {
      createNestedTreeStitches(10);
    },
    100,
    {
      maxIterations: 1000,
      minIterations: 50,
      targetPrecision: 0.1,
    },
  );

  return {
    nested: {
      stitches: stitchesNested,
      stoop: stoopNested,
    },
    simple: {
      stitches: stitchesSimple,
      stoop: stoopSimple,
    },
    variants: {
      stitches: stitchesVariants,
      stoop: stoopVariants,
    },
  };
}
