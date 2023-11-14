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
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Configure projects for major browsers */
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
    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        storageState: defaultUserStorageState,
      },
    },
  ],
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  testDir: './e2e',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    baseURL: 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
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
  workers: process.env.CI ? 1 : undefined,
});
