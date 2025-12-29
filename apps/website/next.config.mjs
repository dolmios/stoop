import createMDX from "@next/mdx";

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
