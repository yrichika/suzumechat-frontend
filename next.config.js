/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // necessary to create docker image
  rewrites: async () => {
    return [
      {
        source: '/back/:path*',
        destination: 'http://localhost:8080/:path*',
      },
    ]
  },
}

module.exports = nextConfig
