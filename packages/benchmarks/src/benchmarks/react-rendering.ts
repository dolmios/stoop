import { createStitches } from "@stitches/react";
import { createElement } from "react";
import { createStoop } from "stoop";

import type { BenchmarkResult } from "../utils";

import { sharedTheme } from "../shared-theme";
import { measureTime } from "../utils";

/**
 * React rendering benchmarks that test actual component rendering,
 * not just CSS generation. These test component creation and CSS generation together.
 */
export function benchmarkReactRendering(): {
  simple: { stoop: BenchmarkResult; stitches: BenchmarkResult };
  variants: { stoop: BenchmarkResult; stitches: BenchmarkResult };
  nested: { stoop: BenchmarkResult; stitches: BenchmarkResult };
} {
  const stoop = createStoop({ theme: sharedTheme });

  const stitches = createStitches({
    theme: sharedTheme as any,
  });

  // Create styled components
  const BoxStoop = stoop.styled("div", {
    backgroundColor: "$colors.background",
    color: "$colors.text",
    padding: "$space.medium",
  });

  const BoxStitches = stitches.styled("div", {
    backgroundColor: "$background",
    color: "$text",
    padding: "$medium",
  } as any);

  const ButtonStoop = stoop.styled(
    "button",
    {
      backgroundColor: "$colors.primary",
      color: "white",
      padding: "$space.small",
    },
    {
      size: {
        large: { fontSize: "18px", padding: "$space.large" },
        small: { fontSize: "12px", padding: "$space.small" },
      },
    },
  );

  const ButtonStitches = stitches.styled(
    "button",
    {
      backgroundColor: "$primary",
      color: "white",
      padding: "$small",
    },
    {
      size: {
        large: { fontSize: "18px", padding: "$large" },
        small: { fontSize: "12px", padding: "$small" },
      },
    } as any,
  );

  // Test simple component creation and CSS generation
  // This measures the CSS compilation that happens when components are created
  const stoopSimple = measureTime(
    "React Rendering (Simple)",
    "stoop",
    () => {
      // Creating elements triggers CSS generation
      createElement(BoxStoop, { children: "Hello" });
      createElement(BoxStoop, { children: "World" });
    },
    200,
  );

  const stitchesSimple = measureTime(
    "React Rendering (Simple)",
    "stitches",
    () => {
      createElement(BoxStitches, { children: "Hello" });
      createElement(BoxStitches, { children: "World" });
    },
    200,
  );

  // Test component with variants - this triggers variant CSS generation
  const stoopVariants = measureTime(
    "React Rendering (With Variants)",
    "stoop",
    () => {
      createElement(ButtonStoop, { children: "Small", size: "small" });
      createElement(ButtonStoop, { children: "Large", size: "large" });
      createElement(ButtonStoop, { children: "Small Again", size: "small" }); // Test caching
    },
    200,
  );

  const stitchesVariants = measureTime(
    "React Rendering (With Variants)",
    "stitches",
    () => {
      createElement(ButtonStitches, { children: "Small", size: "small" });
      createElement(ButtonStitches, { children: "Large", size: "large" });
      createElement(ButtonStitches, { children: "Small Again", size: "small" }); // Test caching
    },
    200,
  );

  // Test nested component tree - measures CSS generation for many components
  function createNestedTreeStoop(depth: number): any {
    if (depth === 0) {
      return createElement(BoxStoop, { children: "Leaf" });
    }

    return createElement(BoxStoop, {}, createNestedTreeStoop(depth - 1));
  }

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
  );

  const stitchesNested = measureTime(
    "React Rendering (Nested Tree)",
    "stitches",
    () => {
      createNestedTreeStitches(10);
    },
    100,
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
