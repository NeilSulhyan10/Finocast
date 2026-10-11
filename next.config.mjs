/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    localPatterns: [
      { pathname: "/images/**", search: "?v=20261011" },
      { pathname: "/images/finocast-logo.png", search: "" },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [400, 800, 1200, 1600, 2000],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [],
  },
};

export default nextConfig;
