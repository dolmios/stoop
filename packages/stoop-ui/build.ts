#!/usr/bin/env bun
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-console */
/* global Bun */
/**
 * Unified build script for stoop-ui
 * Handles cleaning, bundling, adding "use client" directive, and type generation
 */

import { $ } from "bun";
import { rm } from "fs/promises";
import { existsSync } from "node:fs";

const distDir = "./dist";
const outputFile = "./dist/index.js";
const entryPoint = "./src/index.ts";

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

async function buildJS() {
  console.log("📦 Building JavaScript bundle...");
  try {
    // Use --jsx=preserve to keep JSX syntax intact
    // This allows Next.js to handle JSX transformation with the correct runtime
    // (jsx for production, jsxDEV for development) based on its own environment
    // CRITICAL: Keep stoop external! Don't bundle it into stoop-ui
    // If we bundle stoop, it brings in its JSX-transformed components
    // Instead, let consumers resolve stoop at runtime where it's already built correctly
    const result = await $`NODE_ENV=production bun build ${entryPoint} --outfile ${outputFile} --target browser --format esm --minify --external react --external react-dom --external stoop --define process.env.NODE_ENV='"production"'`.quiet();

    if (result.exitCode !== 0) {
      throw new Error(`Build failed: ${result.stderr}`);
    }

    console.log(`✅ JavaScript bundle created: ${outputFile}`);
  } catch (error) {
    console.error("❌ Failed to build JavaScript:", error);
    throw error;
  }
}

async function addClientDirective() {
  console.log("📝 Adding 'use client' directive and converting JSX runtime...");
  try {
    const file = Bun.file(outputFile);
    let content = await file.text();

    // Ensure React is imported for classic JSX transform
    if (!content.includes('import React') && !content.includes('import{React')) {
      // Find the first import statement and add React import before it
      const importMatch = content.match(/^import/m);

      if (importMatch) {
        const importIndex = content.indexOf('import');

        content = content.slice(0, importIndex) + 'import React from "react";\n' + content.slice(importIndex);
      } else {
        // No imports found, add at the beginning (after "use client")
        if (content.startsWith('"use client"')) {
          content = '"use client";\nimport React from "react";\n' + content.slice('"use client";'.length);
        } else {
          content = 'import React from "react";\n' + content;
        }
      }
    }

    // Remove react/jsx-runtime imports and replace jsx/jsxs calls with React.createElement
    // First, find all jsx/jsxs variable names from imports (handle minified imports)
    const jsxImports: string[] = [];
    const jsxsImports: string[] = [];

    // Pattern: import{jsx as X,jsxs as Y}from"react/jsx-runtime" (minified)
    // Match: import{jsx as l$}from"react/jsx-runtime"
    // Match: import{jsx as D$}from"react/jsx-runtime"
    // Match: import{jsx as Eu,jsxs as v$}from"react/jsx-runtime"
    const importPattern = /import\{jsx(?:\s+as\s+([\w$]+))?(?:,jsxs(?:\s+as\s+([\w$]+))?)?\}\s*from\s*["']react\/jsx-runtime["'];?/g;
    let match;

    while ((match = importPattern.exec(content)) !== null) {
      const jsxName = match[1] || 'jsx';
      const jsxsName = match[2];

      jsxImports.push(jsxName);
      if (jsxsName) jsxsImports.push(jsxsName);
      else if (match[0].includes('jsxs')) jsxsImports.push('jsxs');
    }

    // Remove all react/jsx-runtime imports
    content = content.replace(/import\{jsx(?:\s+as\s+[\w$]+)?(?:,jsxs(?:\s+as\s+[\w$]+)?)?\}\s*from\s*["']react\/jsx-runtime["'];?/g, '');

    // Replace all jsx/jsxs calls with React.createElement
    for (const jsxVar of jsxImports) {
      // Escape special regex characters in variable name
      const escapedVar = jsxVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      content = content.replace(new RegExp(`\\b${escapedVar}\\s*\\(`, 'g'), 'React.createElement(');
    }
    for (const jsxsVar of jsxsImports) {
      const escapedVar = jsxsVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      content = content.replace(new RegExp(`\\b${escapedVar}\\s*\\(`, 'g'), 'React.createElement(');
    }

    if (!content.startsWith('"use client"')) {
      content = '"use client";\n' + content;
    }

    await Bun.write(outputFile, content);
    console.log("✅ Added 'use client' directive and converted JSX runtime");
  } catch (error) {
    console.error("❌ Failed to add 'use client' directive:", error);
    throw error;
  }
}

async function buildTypes() {
  console.log("📘 Generating TypeScript declarations...");
  try {
    const result = await $`bunx tsc --project tsconfig.build.json --emitDeclarationOnly`.quiet();

    if (result.exitCode !== 0) {
      throw new Error(`TypeScript compilation failed: ${result.stderr}`);
    }
    console.log("✅ TypeScript declarations generated");
  } catch (error) {
    console.error("❌ Failed to generate types:", error);
    throw error;
  }
}

async function build() {
  console.log("🚀 Building stoop-ui (production mode)...\n");

  try {
    await clean();
    await buildJS();
    await addClientDirective();
    await buildTypes();

    console.log("\n✅ Build completed successfully!");
  } catch (error) {
    console.error("\n❌ Build failed:", error);
    process.exit(1);
  }
}

build();
