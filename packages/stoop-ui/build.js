const { spawn } = require('child_process');
const fs = require('fs');
const { join } = require('path');

/**
 * Build script that uses @swc/core with the stoop-swc plugin
 * to compile all components at build time
 */

const swcConfig = {
  jsc: {
    experimental: {
      plugins: [
        // Use the stoop-swc compiler plugin
        [join(__dirname, "../stoop-swc/compiler/target/wasm32-wasi/release/stoop_swc_compiler.wasm"), {}]
      ],
    },
    parser: {
      syntax: "typescript",
      tsx: true,
    },
    target: "es2022",
    transform: {
      react: {
        runtime: "automatic",
      },
    },
  },
  module: {
    type: "es6",
  },
};

// Write temporary .swcrc
fs.writeFileSync(join(__dirname, '.swcrc'), JSON.stringify(swcConfig, null, 2));

// Run @swc/cli to compile
const swc = spawn('npx', ['@swc/cli', 'src', '-d', 'dist', '--config-file', '.swcrc'], {
  cwd: __dirname,
  stdio: 'inherit',
});

swc.on('close', (code) => {
  // Clean up
  fs.unlinkSync(join(__dirname, '.swcrc'));
  process.exit(code);
});
