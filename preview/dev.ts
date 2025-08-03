#!/usr/bin/env bun
/* eslint-disable no-undef */
/* eslint-disable no-console */
// Enhanced dev server with JSX transpilation for demos

import { build } from 'esbuild';

const server = Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);
    
    if (url.pathname === '/') {
      // Serve the new JSX-based demo page
      const html = await Bun.file('./preview/index-jsx.html').text();

      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    if (url.pathname === '/demos/bundle.js') {
      // Transpile and bundle the JSX demos on the fly
      try {
        const result = await build({
          bundle: true,
          define: {
            'process.env.NODE_ENV': '"development"'
          },
          entryPoints: ['./preview/demos/index.tsx'],
          external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
          format: 'esm',
          jsx: 'automatic',
          target: 'es2020',
          write: false
        });
        
        const js = result.outputFiles[0].text;

        return new Response(js, {
          headers: { 'Content-Type': 'application/javascript' }
        });
      } catch (error) {
        console.error('Demo transpilation error:', error);

        return new Response(`// Demo transpilation failed: ${error}`, { 
          headers: { 'Content-Type': 'application/javascript' },
          status: 500
        });
      }
    }
    
    if (url.pathname === '/dist/index.js') {
      // Serve the built library
      try {
        const js = await Bun.file('./dist/index.js').text();

        return new Response(js, {
          headers: { 'Content-Type': 'application/javascript' }
        });
      } catch {
        return new Response('Library not built. Run `bun run build` first.', { status: 404 });
      }
    }
    
    if (url.pathname.startsWith('/dist/')) {
      // Serve other built files
      try {
        const file = Bun.file(`.${url.pathname}`);

        return new Response(file);
      } catch {
        return new Response('File not found', { status: 404 });
      }
    }
    
    return new Response('Not found', { status: 404 });
  },
  port: 3000,
});

console.log(`🚀 Preview server running at http://localhost:${server.port}`);
// eslint-disable-next-line no-useless-escape
console.log('📦 Run \`bun run build\` first to build the library');
console.log('✨ Clean component demos with navigation!');