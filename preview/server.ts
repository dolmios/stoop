// @ts-ignore
import { serve } from "bun";
import { join } from "path";

const projectRoot = process.cwd();

serve({
  fetch(req) {
    const url = new URL(req.url);
    const filePath = url.pathname === "/" ? "/preview/index.html" : url.pathname;
    const fullPath = join(projectRoot, filePath.startsWith('/dist/') ? filePath.slice(1) : filePath);

    try {
      const file = Bun.file(fullPath);
      const response = new Response(file);
      
      if (filePath.endsWith('.css')) {
        response.headers.set('Content-Type', 'text/css');
      }
      
      return response;
    } catch (error) {
      console.error(`Error serving ${filePath}:`, error);

      return new Response("Not found", { status: 404 });
    }
  },
  port: 3001,
});

console.log(`Preview server running at http://localhost:3001`); 