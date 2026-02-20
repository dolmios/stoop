import createMDX from "@next/mdx";

// stoop is a build-time SWC plugin that transforms styled() calls into
// atomic CSS class names at compile time, eliminating runtime CSS-in-JS overhead.
// The plugin requires the compiled WASM binary to be present. In production
// builds this is enabled via the experimental.swcPlugins config below.
// During local development without the compiled WASM, the stoop runtime
// shims are used instead (styled() falls back gracefully).
//
// To enable the SWC plugin in production:
//   experimental: {
//     swcPlugins: [["stoop/plugin", {}]],
//   },

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      'rehype-slug', // Add IDs to headings
      'rehype-autolink-headings', // Make headings linkable
      'rehype-highlight', // Syntax highlighting
    ],
    remarkPlugins: [
      'remark-gfm', // GitHub Flavored Markdown
    ],
  },
});

export default withMDX(nextConfig);
