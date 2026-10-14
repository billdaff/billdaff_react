import { defineConfig, devices } from '@playwright/test';
import baseConfig, { reporters } from './playwright.config';

export default defineConfig({
  ...baseConfig,
  testDir: './e2e/live',
  outputDir: 'test-results/live',
  reporter: reporters('live'),
  projects: [{ name: 'live', use: { ...devices['Desktop Chrome'] } }],
});
