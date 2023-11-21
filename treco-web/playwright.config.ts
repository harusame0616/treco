import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */

const defaultUserStorageState = 'playwright/.auth/defaultTrainee.json';
const setupProjectName = 'setup';
export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
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
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        storageState: defaultUserStorageState,
      },
    },
  ],
  reporter: 'html',
  retries: process.env.CI ? 1 : 0,
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run start',
    env: {
      NEXT_AUTH_JWT_NO_ENCRYPTION: 'true',
    },
    reuseExistingServer: !process.env.CI,
    url: 'http://127.0.0.1:3000',
  },
  workers: process.env.CI ? 1 : undefined,
});
