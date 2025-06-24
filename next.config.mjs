/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
    images: {
        domains: ['media.vaticannews.va'], // Add external image domains here
      },
};

export default nextConfig;

