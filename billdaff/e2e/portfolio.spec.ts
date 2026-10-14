import { test, expect } from './support/test';

const ALL = ['Alpha Site', 'Beta Report', 'Gamma.App'];

test.describe('portfolio section', () => {
  test.beforeEach(async ({ site }) => {
    await site.goto('portfolio');
  });

  test('shows a filter per project type and every project', async ({ page, site }) => {
    await expect(page.locator('#portfolio_filters .filter')).toHaveText(['All', 'Web Development', 'Data Reporting']);
    for (const title of ALL) {
      await expect(site.portfolioItem(title).locator('.name')).toHaveText(title);
    }
  });

  test('filters projects by type', async ({ page, site }) => {
    await expect(page.locator('#portfolio_grid figure')).toHaveCount(ALL.length);

    await page.locator('#portfolio_filters .filter', { hasText: 'Data Reporting' }).click();
    await expect(page.locator('#portfolio_filters li.active')).toHaveText('Data Reporting');
    await expect(site.portfolioItem('Alpha Site')).toBeHidden();
    await expect(site.portfolioItem('Beta Report')).toBeVisible();
    await expect(site.portfolioItem('Gamma.App')).toBeVisible();

    await page.locator('#portfolio_filters .filter', { hasText: 'All' }).click();
    for (const title of ALL) {
      await expect(site.portfolioItem(title)).toBeVisible();
    }
  });

  test('opens a project with its description and technologies', async ({ site }) => {
    await site.openProject('Alpha Site');
    const overlay = site.projectOverlay('Alpha Site');
    await expect(overlay.getByRole('heading', { level: 1 })).toHaveText('Alpha Site');
    await expect(overlay).toContainText('Alpha description.');
    await expect(overlay.locator('.tags li')).toHaveText(['React', 'Drupal']);
  });

  test('closes a project', async ({ site }) => {
    await site.openProject('Alpha Site');
    await site.projectOverlay('Alpha Site').locator('.ajax-page-close-button a').click();
    await expect(site.projectOverlay('Alpha Site')).toBeHidden();
  });

  test('steps to the next and previous project', async ({ site }) => {
    await site.openProject('Alpha Site');

    await site.projectOverlay('Alpha Site').locator('a[href="#beta-report"]').click();
    await expect(site.projectOverlay('Beta Report')).toBeVisible();
    await expect(site.projectOverlay('Alpha Site')).toBeHidden();

    await site.projectOverlay('Beta Report').locator('a[href="#alpha-site"]').click();
    await expect(site.projectOverlay('Alpha Site')).toBeVisible();
    await site.projectOverlay('Alpha Site').locator('a[href="#gamma-app"]').click();
    await expect(site.projectOverlay('Gamma.App')).toBeVisible();
  });
});
