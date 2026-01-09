#!/usr/bin/env bun
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-console */

/* global Bun */
/**
 * Unified build script for stoop
 * Handles cleaning, bundling (main + SSR), and type generation
 */

import { $ } from "bun";
import { rm, mkdir } from "fs/promises";
import { existsSync } from "node:fs";

const distDir = "./dist";
const mainEntry = "./src/index.ts";
const ssrEntry = "./src/create-stoop-ssr.ts";
const mainOutput = "./dist/index.js";
const ssrOutput = "./dist/create-stoop-ssr.js";

async function clean() {
  console.log("🧹 Cleaning dist directory...");
  try {
    if (existsSync(distDir)) {
      await rm(distDir, { force: true, recursive: true });
      console.log("✅ Cleaned dist directory");
    } else {
      console.log("ℹ️  dist directory does not exist");
    }
  } catch (error) {
    console.error("❌ Failed to clean dist directory:", error);
    throw error;
  }
}

async function buildMain() {
  console.log("📦 Building main bundle...");
  try {
    const result =
      await $`NODE_ENV=production bun build ${mainEntry} --outfile ${mainOutput} --target browser --format esm --minify --jsx=automatic --external react --external react-dom --external react/jsx-runtime --define process.env.NODE_ENV='"production"'`.quiet();

    if (result.exitCode !== 0) {
      throw new Error(`Main build failed: ${result.stderr}`);
    }

    console.log(`✅ Main bundle created: ${mainOutput}`);
  } catch (error) {
    console.error("❌ Failed to build main bundle:", error);
    throw error;
  }
}

async function buildSSR() {
  console.log("📦 Building SSR bundle...");
  try {
    const result =
      await $`NODE_ENV=production bun build ${ssrEntry} --outfile ${ssrOutput} --target browser --format esm --minify --jsx=automatic --external react --external react-dom --external react/jsx-runtime --define process.env.NODE_ENV='"production"'`.quiet();

    if (result.exitCode !== 0) {
      throw new Error(`SSR build failed: ${result.stderr}`);
    }

    console.log(`✅ SSR bundle created: ${ssrOutput}`);
  } catch (error) {
    console.error("❌ Failed to build SSR bundle:", error);
    throw error;
  }
}

async function buildTypes() {
  console.log("📘 Generating TypeScript declarations...");
  try {
    const result = await $`bunx tsc --project tsconfig.build.json`.quiet();

    if (result.exitCode !== 0) {
      throw new Error(`TypeScript compilation failed: ${result.stderr}`);
    }
    console.log("✅ TypeScript declarations generated");
  } catch (error) {
    console.error("❌ Failed to generate types:", error);
    throw error;
  }
}

async function createTypesEntrypoint() {
  console.log("📝 Creating types/index.js entrypoint...");
  try {
    const typesDir = "./dist/types";
    const typesIndexPath = `${typesDir}/index.js`;

    // Ensure types directory exists
    await mkdir(typesDir, { recursive: true });

    // Create index.js that re-exports from main module
    // This is needed because stoop-ui's compiled .d.ts files reference import("stoop/types")
    // and TypeScript requires a corresponding .js file for the package export to work
    const content = `// Re-export types from main module for compatibility\nexport * from '../index.js';\n`;

    await Bun.write(typesIndexPath, content);

    console.log("✅ Created types/index.js entrypoint");
  } catch (error) {
    console.error("❌ Failed to create types entrypoint:", error);
    throw error;
  }
}

async function build() {
  console.log("🚀 Building stoop (production mode)...\n");

  try {
    await clean();
    await buildMain();
    await buildSSR();
    await buildTypes();
    await createTypesEntrypoint();

    console.log("\n✅ Build completed successfully!");
  } catch (error) {
    console.error("\n❌ Build failed:", error);
    process.exit(1);
  }
}

build();
