#!/usr/bin/env bun
/* eslint-disable no-console */
import { $ } from "bun";
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "fs";
import { join } from "path";

export interface BundleAnalysis {
  library: "stoop" | "stitches";
  scenario: string;
  size: {
    raw: number;
    rawKB: number;
    minified: number;
    minifiedKB: number;
    gzipped: number;
    gzippedKB: number;
  };
  treeShaking: {
    effective: boolean;
    unusedCode?: number;
    unusedCodeKB?: number;
  };
}

export interface BundleComparison {
  stoop: BundleAnalysis[];
  stitches: BundleAnalysis[];
  summary: {
    stoop: {
      minifiedKB: number;
      gzippedKB: number;
      treeShakingEffective: boolean;
    };
    stitches: {
      minifiedKB: number;
      gzippedKB: number;
      treeShakingEffective: boolean;
    };
    comparison: {
      stoopVsStitches: {
        minified: number; // percentage difference
        gzipped: number; // percentage difference
      };
      winner: "stoop" | "stitches" | "tie";
    };
  };
}

const TEMP_DIR = join(process.cwd(), ".bundle-analysis");
const OUTPUT_DIR = join(process.cwd(), "dist");
const ROOT_PATH = process.cwd().replace(/\/packages\/benchmarks.*$/, "");

// Ensure temp directory exists
mkdirSync(TEMP_DIR, { recursive: true });
mkdirSync(OUTPUT_DIR, { recursive: true });

/**
 * Analyzes a bundle file
 */
function analyzeBundle(filePath: string): BundleAnalysis["size"] {
  const content = readFileSync(filePath);
  const minified = content.length;
  // Use bun's built-in gzip
  // eslint-disable-next-line no-undef
  const gzipped = Bun.gzipSync(content).length;

  return {
    gzipped: gzipped,
    gzippedKB: gzipped / 1024,
    minified: minified,
    minifiedKB: minified / 1024,
    raw: minified, // bun build already minifies
    rawKB: minified / 1024,
  };
}

/**
 * Analyzes the built dist file directly (most accurate for primary comparison)
 */
function analyzeDistFile(library: "stoop" | "stitches"): BundleAnalysis["size"] | null {
  let filePath: string;

  if (library === "stoop") {
    filePath = join(ROOT_PATH, "packages/stoop/dist/create-stoop.js");
  } else {
    // Try to find stitches dist file - check root node_modules first (workspace setup)
    const stitchesPaths = [
      join(ROOT_PATH, "node_modules/@stitches/react/dist/index.mjs"),
      join(ROOT_PATH, "packages/benchmarks/node_modules/@stitches/react/dist/index.mjs"),
      join(ROOT_PATH, "node_modules/@stitches/react/dist/index.js"),
      join(ROOT_PATH, "packages/benchmarks/node_modules/@stitches/react/dist/index.js"),
    ];

    filePath = stitchesPaths.find((path) => existsSync(path)) || stitchesPaths[0];
  }

  try {
    if (!existsSync(filePath)) {
      return null;
    }

    return analyzeBundle(filePath);
  } catch (error) {
    console.warn(`Could not analyze dist file for ${library}:`, error);

    return null;
  }
}

/**
 * Creates a test entry point file for bundle analysis
 */
function createTestEntryPoint(
  library: "stoop" | "stitches",
  scenario: string,
  imports: string,
): string {
  const filePath = join(TEMP_DIR, `${library}-${scenario}.ts`);
  const content = `// Test entry point for ${library} - ${scenario}
${imports}

// Prevent tree-shaking removal
if (typeof window !== 'undefined') {
  (window as any).__bundle_test__ = {
    library: '${library}',
    scenario: '${scenario}',
  };
}
`;

  writeFileSync(filePath, content);

  return filePath;
}

/**
 * Builds a bundle using bun and returns the output path
 */
async function buildBundle(
  entryPoint: string,
  library: "stoop" | "stitches",
  scenario: string,
): Promise<string> {
  const outputPath = join(OUTPUT_DIR, `${library}-${scenario}.js`);

  try {
    if (library === "stoop") {
      // Build stoop bundle
      await $`bun build ${entryPoint} --outfile ${outputPath} --target browser --format esm --minify --external react --external react-dom --external react/jsx-runtime --define process.env.NODE_ENV='"production"'`.quiet();
    } else {
      // Build stitches bundle - stitches is already built, so we bundle our test file
      await $`bun build ${entryPoint} --outfile ${outputPath} --target browser --format esm --minify --external react --external react-dom --external react/jsx-runtime --define process.env.NODE_ENV='"production"'`.quiet();
    }
  } catch (error) {
    console.error(`Error building bundle for ${library} ${scenario}:`, error);
    throw error;
  }

  return outputPath;
}

/**
 * Analyzes tree shaking effectiveness by comparing full import vs partial imports
 */
function analyzeTreeShaking(
  fullImportSize: number,
  partialImportSize: number,
): BundleAnalysis["treeShaking"] {
  const unusedCode = fullImportSize - partialImportSize;
  const threshold = fullImportSize * 0.1; // 10% threshold

  return {
    effective: unusedCode > threshold,
    unusedCode: unusedCode > 0 ? unusedCode : 0,
    unusedCodeKB: unusedCode > 0 ? unusedCode / 1024 : 0,
  };
}

/**
 * Analyzes a specific import scenario
 */
async function analyzeScenario(
  library: "stoop" | "stitches",
  scenario: string,
  imports: string,
): Promise<BundleAnalysis> {
  const entryPoint = createTestEntryPoint(library, scenario, imports);
  const bundlePath = await buildBundle(entryPoint, library, scenario);
  const size = analyzeBundle(bundlePath);

  return {
    library,
    scenario,
    size,
    treeShaking: {
      effective: true, // Will be calculated in comparison
    },
  };
}

/**
 * Main bundle analysis function
 */
export async function analyzeBundles(): Promise<BundleComparison> {
  console.log("🔍 Analyzing bundle sizes...\n");

  // First, try to analyze dist files directly (most accurate)
  const stoopDistSize = analyzeDistFile("stoop");
  const stitchesDistSize = analyzeDistFile("stitches");

  if (!stoopDistSize) {
    console.warn("⚠️  Stoop dist file not found. Make sure to run 'bun run build' first.");
  }

  if (!stitchesDistSize) {
    console.warn("⚠️  Stitches dist file not found. Make sure @stitches/react is installed.");
  }

  if (stoopDistSize && stitchesDistSize) {
    console.log("📦 Analyzing built dist files (direct)...");
    console.log(
      `  Stoop:     ${stoopDistSize.minifiedKB.toFixed(2)} KB (minified) / ${stoopDistSize.gzippedKB.toFixed(2)} KB (gzipped)`,
    );
    console.log(
      `  Stitches:  ${stitchesDistSize.minifiedKB.toFixed(2)} KB (minified) / ${stitchesDistSize.gzippedKB.toFixed(2)} KB (gzipped)\n`,
    );
  } else {
    console.log("📦 Building test bundles for analysis...\n");
  }

  const stoopScenarios = [
    {
      imports: `import { createStoop } from "stoop";`,
      name: "full-import",
    },
    {
      imports: `import { createStoop } from "stoop";
const { css } = createStoop({ theme: {} });`,
      name: "css-only",
    },
    {
      imports: `import { createStoop } from "stoop";
const { styled } = createStoop({ theme: {} });`,
      name: "styled-only",
    },
    {
      imports: `import { createStoop } from "stoop";
const { createTheme } = createStoop({ theme: {} });`,
      name: "theme-only",
    },
    {
      imports: `import { createStoop } from "stoop";
const instance = createStoop({ theme: {} });`,
      name: "minimal",
    },
  ];

  const stitchesScenarios = [
    {
      imports: `import { createStitches } from "@stitches/react";`,
      name: "full-import",
    },
    {
      imports: `import { createStitches } from "@stitches/react";
const { css } = createStitches({ theme: {} });`,
      name: "css-only",
    },
    {
      imports: `import { createStitches } from "@stitches/react";
const { styled } = createStitches({ theme: {} });`,
      name: "styled-only",
    },
    {
      imports: `import { createStitches } from "@stitches/react";
const { createTheme } = createStitches({ theme: {} });`,
      name: "theme-only",
    },
    {
      imports: `import { createStitches } from "@stitches/react";
const instance = createStitches({ theme: {} });`,
      name: "minimal",
    },
  ];

  const stoopResults: BundleAnalysis[] = [];
  const stitchesResults: BundleAnalysis[] = [];

  // Analyze stoop scenarios
  console.log("📦 Analyzing Stoop bundles...");
  for (const scenario of stoopScenarios) {
    try {
      const result = await analyzeScenario("stoop", scenario.name, scenario.imports);

      stoopResults.push(result);
      console.log(
        `  ✓ ${scenario.name}: ${result.size.minifiedKB.toFixed(2)} KB (${result.size.gzippedKB.toFixed(2)} KB gzipped)`,
      );
    } catch (error) {
      console.error(`  ✗ ${scenario.name}: Failed`, error);
    }
  }

  // Analyze stitches scenarios
  console.log("\n📦 Analyzing Stitches bundles...");
  for (const scenario of stitchesScenarios) {
    try {
      const result = await analyzeScenario("stitches", scenario.name, scenario.imports);

      stitchesResults.push(result);
      console.log(
        `  ✓ ${scenario.name}: ${result.size.minifiedKB.toFixed(2)} KB (${result.size.gzippedKB.toFixed(2)} KB gzipped)`,
      );
    } catch (error) {
      console.error(`  ✗ ${scenario.name}: Failed`, error);
    }
  }

  // Calculate tree shaking effectiveness
  const stoopFull = stoopResults.find((r) => r.scenario === "full-import");
  const stoopMinimal = stoopResults.find((r) => r.scenario === "minimal");
  const stitchesFull = stitchesResults.find((r) => r.scenario === "full-import");
  const stitchesMinimal = stitchesResults.find((r) => r.scenario === "minimal");

  if (stoopFull && stoopMinimal) {
    stoopFull.treeShaking = analyzeTreeShaking(stoopFull.size.minified, stoopMinimal.size.minified);
  }

  if (stitchesFull && stitchesMinimal) {
    stitchesFull.treeShaking = analyzeTreeShaking(
      stitchesFull.size.minified,
      stitchesMinimal.size.minified,
    );
  }

  // Use dist file sizes if available (most accurate), otherwise use bundled results
  // Prefer dist files for primary comparison, but still use bundled results for tree-shaking analysis
  const stoopPrimarySize =
    stoopDistSize || stoopResults.find((r) => r.scenario === "full-import")?.size;
  const stitchesPrimarySize =
    stitchesDistSize || stitchesResults.find((r) => r.scenario === "full-import")?.size;

  if (!stoopPrimarySize || !stitchesPrimarySize) {
    throw new Error("Failed to analyze primary bundles. Make sure to run 'bun run build' first.");
  }

  // Create primary analysis from dist files (preferred) or bundled results
  const stoopFullImport = stoopResults.find((r) => r.scenario === "full-import");

  if (!stoopFullImport && !stoopDistSize) {
    throw new Error("Failed to find stoop full-import result");
  }

  const stoopPrimary: BundleAnalysis = stoopDistSize
    ? {
        library: "stoop",
        scenario: "dist-file",
        size: stoopDistSize,
        treeShaking:
          stoopResults.length > 0
            ? stoopFullImport?.treeShaking || {
                effective: true,
              }
            : { effective: true },
      }
    : stoopFullImport;

  const stitchesFullImport = stitchesResults.find((r) => r.scenario === "full-import");

  if (!stitchesFullImport && !stitchesDistSize) {
    throw new Error("Failed to find stitches full-import result");
  }

  const stitchesPrimary: BundleAnalysis = stitchesDistSize
    ? {
        library: "stitches",
        scenario: "dist-file",
        size: stitchesDistSize,
        treeShaking:
          stitchesResults.length > 0
            ? stitchesFullImport?.treeShaking || {
                effective: true,
              }
            : { effective: true },
      }
    : stitchesFullImport;

  // Add dist file results to arrays if they exist
  const allStoopResults = stoopDistSize ? [stoopPrimary, ...stoopResults] : stoopResults;
  const allStitchesResults = stitchesDistSize
    ? [stitchesPrimary, ...stitchesResults]
    : stitchesResults;

  const comparison: BundleComparison = {
    stitches: allStitchesResults,
    stoop: allStoopResults,
    summary: {
      comparison: {
        stoopVsStitches: {
          gzipped:
            ((stoopPrimary.size.gzippedKB - stitchesPrimary.size.gzippedKB) /
              stitchesPrimary.size.gzippedKB) *
            100,
          minified:
            ((stoopPrimary.size.minifiedKB - stitchesPrimary.size.minifiedKB) /
              stitchesPrimary.size.minifiedKB) *
            100,
        },
        winner:
          stoopPrimary.size.gzippedKB < stitchesPrimary.size.gzippedKB
            ? "stoop"
            : stoopPrimary.size.gzippedKB > stitchesPrimary.size.gzippedKB
              ? "stitches"
              : "tie",
      },
      stitches: {
        gzippedKB: stitchesPrimary.size.gzippedKB,
        minifiedKB: stitchesPrimary.size.minifiedKB,
        treeShakingEffective: stitchesPrimary.treeShaking.effective,
      },
      stoop: {
        gzippedKB: stoopPrimary.size.gzippedKB,
        minifiedKB: stoopPrimary.size.minifiedKB,
        treeShakingEffective: stoopPrimary.treeShaking.effective,
      },
    },
  };

  return comparison;
}

/**
 * Formats bundle comparison for console output
 */
export function formatBundleComparison(comparison: BundleComparison): string {
  const { stitches, stoop, summary } = comparison;
  const stoopPrimary =
    stoop.find((r) => r.scenario === "dist-file" || r.scenario === "full-import") || stoop[0];
  const stitchesPrimary =
    stitches.find((r) => r.scenario === "dist-file" || r.scenario === "full-import") || stitches[0];

  if (!stoopPrimary || !stitchesPrimary) {
    return "Error: Could not find primary bundle data";
  }

  let output = "\n📊 Bundle Size Analysis\n";

  output += "=".repeat(60) + "\n\n";

  output += "Primary Bundle (Full Import):\n";
  output += `  Stoop:     ${stoopPrimary.size.minifiedKB.toFixed(2)} KB (minified) / ${stoopPrimary.size.gzippedKB.toFixed(2)} KB (gzipped)\n`;
  output += `  Stitches:  ${stitchesPrimary.size.minifiedKB.toFixed(2)} KB (minified) / ${stitchesPrimary.size.gzippedKB.toFixed(2)} KB (gzipped)\n\n`;

  const diff = summary.comparison.stoopVsStitches.gzipped;
  const absDiff = Math.abs(diff);
  const { winner } = summary.comparison;

  output += `Comparison:\n`;
  output += `  ${winner === "stoop" ? "✅" : winner === "stitches" ? "❌" : "➖"} Stoop is ${absDiff.toFixed(1)}% ${diff < 0 ? "smaller" : "larger"} than Stitches (gzipped)\n\n`;

  output += "Tree Shaking:\n";
  output += `  Stoop:     ${stoopPrimary.treeShaking.effective ? "✅ Effective" : "❌ Not effective"}\n`;
  output += `  Stitches:  ${stitchesPrimary.treeShaking.effective ? "✅ Effective" : "❌ Not effective"}\n\n`;

  output += "All Scenarios:\n";
  output += "  Stoop:\n";
  for (const result of stoop) {
    output += `    ${result.scenario.padEnd(15)} ${result.size.minifiedKB.toFixed(2).padStart(6)} KB (min) / ${result.size.gzippedKB.toFixed(2).padStart(6)} KB (gzip)\n`;
  }

  output += "\n  Stitches:\n";
  for (const result of stitches) {
    output += `    ${result.scenario.padEnd(15)} ${result.size.minifiedKB.toFixed(2).padStart(6)} KB (min) / ${result.size.gzippedKB.toFixed(2).padStart(6)} KB (gzip)\n`;
  }

  return output;
}

/**
 * Saves bundle comparison to JSON file
 */
export function saveBundleComparison(
  comparison: BundleComparison,
  outputPath: string = join(OUTPUT_DIR, "bundle-analysis.json"),
): void {
  writeFileSync(outputPath, JSON.stringify(comparison, null, 2));
  console.log(`\n💾 Bundle analysis saved to: ${outputPath}`);
}

/**
 * Cleans up temporary files
 */
export function cleanup(): void {
  try {
    rmSync(TEMP_DIR, { force: true, recursive: true });
    // Keep dist/ for inspection, but could remove if needed
  } catch {
    // Ignore cleanup errors
  }
}
