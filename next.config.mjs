/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Essential for Vercel
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'fooderu.s3.amazonaws.com'
      }
    ],
  },
};
export default nextConfig;