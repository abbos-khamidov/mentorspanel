/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Disable static generation for dynamic pages
  output: 'standalone',
  webpack: (config, { isServer }) => {
    // Exclude pg and related modules from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      };
      config.externals = [...(config.externals || []), 'pg', '@prisma/adapter-pg'];
    }
    return config;
  },
}

module.exports = nextConfig
