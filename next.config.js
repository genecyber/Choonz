/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile Strudel packages
  transpilePackages: [
    '@strudel/core',
    '@strudel/mini',
    '@strudel/webaudio'
  ],
}

module.exports = nextConfig
