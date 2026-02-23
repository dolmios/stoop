import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      'rehype-slug',
      'rehype-autolink-headings',
      'rehype-highlight',
    ],
    remarkPlugins: [
      'remark-gfm',
    ],
  },
});

export default withMDX({
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
});
