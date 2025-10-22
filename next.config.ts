/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Modern build optimizations
  experimental: {
    optimizeCss: true,       // Speeds up CSS build
    scrollRestoration: true, // Preserves scroll position on navigation
  },

  // Remote images allowed
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'storage.cloud.google.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
    ],
  },

  // URL rewrites
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
      },
    ];
  },

  // Standalone build for Docker or containerized deployment
  output: 'standalone',
};

module.exports = nextConfig;
