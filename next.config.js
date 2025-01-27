/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'minios3-minio.dpbdp1.easypanel.host',
      'console-minios3-minio.dpbdp1.easypanel.host',
      'images.unsplash.com',
      'i.imgur.com',
      'imgur.com',
      'via.placeholder.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET" },
        ],
      },
    ]
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 