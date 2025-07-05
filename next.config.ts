/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Dangerously allow production builds to complete even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
