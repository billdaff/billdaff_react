import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';
const LIVE_SPECS = /[\\/]live[\\/]/;
const MOBILE_SPECS = /mobile-.*\.spec\.ts/;
// perf tests use Chrome-only APIs
const PERF_SPECS = /-performance\.spec\.ts/;

export const reporters = (suite: string) => [
  ['list'] as const,
  ['html', { open: 'never', outputFolder: `playwright-report/${suite}` }] as const,
  ['junit', { outputFile: `reports/junit-${suite}.xml` }] as const,
];

export default defineConfig({
  testDir: './e2e',
  outputDir: 'test-results/mocked',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: reporters('mocked'),
  use: {
    baseURL: BASE_URL,
    timezoneId: 'America/New_York',
    locale: 'en-US',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testIgnore: [LIVE_SPECS, MOBILE_SPECS] },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testIgnore: [LIVE_SPECS, MOBILE_SPECS, PERF_SPECS] },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testIgnore: [LIVE_SPECS, MOBILE_SPECS, PERF_SPECS] },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] }, testMatch: MOBILE_SPECS },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'yarn start',
        url: BASE_URL,
        env: { BROWSER: 'none', PORT: '3000' },
        reuseExistingServer: !process.env.CI,
        timeout: 180 * 1000,
      },
});
