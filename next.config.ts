/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // any other existing settings remain here
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
