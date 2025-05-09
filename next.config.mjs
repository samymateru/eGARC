/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
    images: {
        domains: ['img.freepik.com'], // Add external image domains here
      },
};

export default nextConfig;

