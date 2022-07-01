/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // necessary to create docker image
}

module.exports = nextConfig
