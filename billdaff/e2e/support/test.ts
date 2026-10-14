import { test as base, expect } from '@playwright/test';
import { mockApi, type ApiController } from './mockApi';
import { SitePage } from './SitePage';

interface Fixtures {
  clockTime: Date;
  api: ApiController;
  pageErrors: string[];
  site: SitePage;
}

export const test = base.extend<Fixtures>({
  clockTime: [new Date(), { option: true }],

  api: [
    async ({ page, baseURL, clockTime }, use) => {
      await page.clock.install({ time: clockTime });
      const api = await mockApi(page, { baseURL: baseURL! });
      await use(api);
      expect(api.unmocked, 'API requests without a fixture').toEqual([]);
    },
    { auto: true },
  ],

  pageErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await use(errors);
      expect(errors, 'uncaught errors in the page').toEqual([]);
    },
    { auto: true },
  ],

  site: async ({ page }, use) => {
    await use(new SitePage(page));
  },
});

export { expect };
