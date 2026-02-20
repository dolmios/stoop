/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcPlugins: [
      ['stoop-swc/compiler', {}]
    ]
  }
};

module.exports = nextConfig;
