'use strict';

const licenseKey = process.env.NEW_RELIC_LICENSE_KEY;
const logLevel = process.env.LOG_LEVEL || 'info';

if (!licenseKey) {
  console.error('newRelic の LicenseKey が必要です');
}

/**
 * New Relic agent configuration.
 *
 * See lib/config/default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * When true, all request headers except for those listed in attributes.exclude
   * will be captured for all traces, unless otherwise specified in a destination's
   * attributes include/exclude lists.
   */
  allow_all_headers: true,
  /**
   * Array of application names.
   */
  app_name: 'treco',
  application_logging: {
    enabled: false,
    forwarding: {
      enabled: false,
    },
    level: process.env.LOG_LEVEL || 'info',
  },
  attributes: {
    /**
     * Prefix of attributes to exclude from all destinations. Allows * as wildcard
     * at end.
     *
     * NOTE: If excluding headers, they must be in camelCase form to be filtered.
     *
     * @name NEW_RELIC_ATTRIBUTES_EXCLUDE
     */
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*',
    ],
  },
  /**
   * Your New Relic license key.
   */
  license_key: licenseKey,
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: logLevel,
  },
};
