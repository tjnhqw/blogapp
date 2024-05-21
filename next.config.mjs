/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "blogappcourse7344a3afede44186a43f752c7e53e15d1d238-dev.s3.ap-southeast-1.amazonaws.com"
      },
    ]
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  output: "export",
};

export default nextConfig;
