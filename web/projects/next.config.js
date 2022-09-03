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
    config.resolve.alias['@Queries'] = path.join(
      __dirname,
      'contexts',
      'record',
      'infrastracture',
      'query'
    );
    config.resolve.alias['@Hooks'] = path.join(__dirname, 'hooks');
    config.resolve.alias['@Components'] = path.join(__dirname, 'components');
    return config;
  },
};

module.exports = withPWA(nextConfig);
