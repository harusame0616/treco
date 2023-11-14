import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */

const defaultUserStorageState = 'playwright/.auth/defaultTrainee.json';
const setupProjectName = 'setup';
export default defineConfig({
  forbidOnly: !!process.env.CI,
  projects: [
    {
      name: setupProjectName,
      testMatch: '**/*.setup.ts',
    },
    {
      dependencies: [setupProjectName],
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: defaultUserStorageState,
      },
    },
    {
      dependencies: [setupProjectName],
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'], storageState: defaultUserStorageState },
    },
    {
      dependencies: [setupProjectName],
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'], storageState: defaultUserStorageState },
    },
  ],
  reporter: 'html',
  retries: process.env.CI ? 1 : 0,
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  /* Run your local dev server before starting the tests */
  webServer: process.env.CI
    ? {
        command: 'npm run start',
        reuseExistingServer: !process.env.CI,
        url: 'http://127.0.0.1:3000',
      }
    : undefined,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 8,
});
