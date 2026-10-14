import { test, expect } from '@playwright/test';
import { API_ORIGIN, RESUME_ARTICLE_TITLES } from '../../src/api';

const contracts: Record<string, string[]> = {
  employment: ['name', 'field_job_title', 'field_dates_worked', 'field_location', 'description__value'],
  portfolios: ['title', 'field_portfolio_images', 'field_project_type', 'body', 'field_technologies'],
  getProjectTypes: ['field_project_type'],
  ...Object.fromEntries(
    RESUME_ARTICLE_TITLES.map((title) => [`resume_articles/${encodeURIComponent(title)}`, ['title', 'body']])
  ),
};

for (const [endpoint, fields] of Object.entries(contracts)) {
  test(`API ${endpoint} returns the fields the app reads`, async ({ request }) => {
    const response = await request.get(`${API_ORIGIN}/api/${endpoint}`);
    expect(response.ok()).toBeTruthy();
    const body: Record<string, unknown>[] = await response.json();
    expect(body.length).toBeGreaterThan(0);
    body.forEach((item, index) => {
      for (const field of fields) {
        expect(item, `${endpoint}[${index}].${field}`).toHaveProperty(field);
      }
    });
  });
}

test('API values have the shapes the fixtures use', async ({ request }) => {
  const portfolios = await (await request.get(`${API_ORIGIN}/api/portfolios`)).json();
  for (const portfolio of portfolios) {
    expect(Array.isArray(portfolio.field_portfolio_images), portfolio.title).toBe(true);
  }

  const employment = await (await request.get(`${API_ORIGIN}/api/employment`)).json();
  for (const job of employment) {
    expect(job.field_dates_worked).toMatch(/^\d{2}-\d{4}(, \d{2}-\d{4})?$/);
  }
});

test('site renders live content', async ({ page }) => {
  await page.goto('/#resume');
  const resume = page.locator('section[data-id="resume"]');
  await expect(resume.locator('.timeline-item').first()).toBeVisible({ timeout: 20000 });
  await expect(resume.locator('.block-body')).toHaveCount(RESUME_ARTICLE_TITLES.length);
  await expect(page.getByText('Error in loading')).toHaveCount(0);

  await page.goto('/#portfolio');
  await expect(page.locator('#portfolio_grid figure').first()).toBeAttached({ timeout: 30000 });
  await expect(page.locator('#portfolio_filters .filter').nth(1)).toBeAttached();
});
