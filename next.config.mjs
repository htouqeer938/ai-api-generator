/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Do not fail production builds on lint issues; lint separately in CI.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
