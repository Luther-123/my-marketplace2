/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // If your repository name is "plugKe", set basePath and assetPrefix like this:
  // basePath: '/my-marketplace2',
  // assetPrefix: '/my-marketplace2/',
  images: {
    unoptimized: true, // Required for static export if using next/image
  },
};

module.exports = nextConfig;