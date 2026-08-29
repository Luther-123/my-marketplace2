/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/my-marketplace2',
  assetPrefix: '/my-marketplace2/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;