/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');
const path = require('path');

const nextConfig = {
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
  reactStrictMode: false,
  swcMinify: true,
  webpack(config, options) {
    config.resolve.alias['@'] = __dirname;
    config.resolve.alias['@Errors'] = path.join(__dirname, 'custom-error');
    config.resolve.alias['@Domains'] = path.join(
      __dirname,
      'contexts',
      'record',
      'domains'
    );
    config.resolve.alias['@Usecases'] = path.join(
      __dirname,
      'contexts',
      'record',
      'usecases'
    );
    config.resolve.alias['@Repositories'] = path.join(
      __dirname,
      'contexts',
      'record',
      'infrastracture',
      'repository'
    );
    return config;
  },
};

module.exports = withPWA(nextConfig);
