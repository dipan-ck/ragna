import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignore TypeScript errors on build
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint errors on build (this is what you want)
  },
};

export default nextConfig;
