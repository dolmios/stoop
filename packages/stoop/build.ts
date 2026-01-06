#!/usr/bin/env bun
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global Bun */
/**
 * Unified build script for stoop
 * Handles cleaning, bundling (main + SSR), and type generation
 */

import { $ } from "bun";
import { rm, mkdir, copyFile } from "fs/promises";
import { existsSync } from "node:fs";
import { dirname } from "path";

const distDir = "./dist";
const mainEntry = "./src/create-stoop.ts";
const ssrEntry = "./src/create-stoop-ssr.ts";
const mainOutput = "./dist/create-stoop.js";
const ssrOutput = "./dist/create-stoop-ssr.js";
const declarationSource = "./src/types/react-polymorphic-types.d.ts";
const declarationDest = "./dist/types/react-polymorphic-types.d.ts";

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
    const result = await $`NODE_ENV=production bun build ${mainEntry} --outfile ${mainOutput} --target browser --format esm --minify --jsx=automatic --external react --external react-dom --external react/jsx-runtime --define process.env.NODE_ENV='"production"'`.quiet();

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
    const result = await $`NODE_ENV=production bun build ${ssrEntry} --outfile ${ssrOutput} --target browser --format esm --minify --jsx=automatic --external react --external react-dom --external react/jsx-runtime --define process.env.NODE_ENV='"production"'`.quiet();

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

async function copyDeclarations() {
  console.log("📋 Copying type declarations...");
  try {
    if (existsSync(declarationSource)) {
      // Ensure destination directory exists
      const destDir = dirname(declarationDest);

      await mkdir(destDir, { recursive: true });

      // Copy the file
      await copyFile(declarationSource, declarationDest);
      console.log("✅ Copied type declarations");
    } else {
      console.log("ℹ️  Source declaration file not found, skipping");
    }
  } catch (error) {
    // Non-fatal error, just log it
    console.log("ℹ️  Could not copy declarations:", error instanceof Error ? error.message : String(error));
  }
}

async function build() {
  console.log("🚀 Building stoop (production mode)...\n");

  try {
    await clean();
    await buildMain();
    await buildSSR();
    await buildTypes();
    await copyDeclarations();

    console.log("\n✅ Build completed successfully!");
  } catch (error) {
    console.error("\n❌ Build failed:", error);
    process.exit(1);
  }
}

build();
