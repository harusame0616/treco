/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');

const nextConfig = {
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withPWA(nextConfig);
