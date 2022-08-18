/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // necessary to create docker image
  rewrites: async () => {
    return [
      {
        source: `${process.env.NEXT_PUBLIC_BACK_PREFIX}/:path*`,
        destination: `${process.env.NEXT_PUBLIC_BACK_URL}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
