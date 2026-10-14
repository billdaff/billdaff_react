import { test, expect } from './support/test';
import { employment } from './support/mockApi';

test.describe('API failures', () => {
  test('employment shows an error when the API fails', async ({ api, site }) => {
    api.override('employment', (route) => route.fulfill({ status: 500, body: 'Internal Server Error' }));
    await site.goto('resume');
    await expect(site.section('resume').locator('.timeline')).toHaveText('Error in loading');
  });

  test('employment shows an error when the API returns an error body', async ({ api, site }) => {
    api.override('employment', (route) => route.fulfill({ status: 404, json: { message: 'Not found' } }));
    await site.goto('resume');
    await expect(site.section('resume').locator('.timeline')).toHaveText('Error in loading');
  });

  test('an empty resume article is skipped without breaking the page', async ({ api, site }) => {
    api.override('resume_articles', (route, title, fulfillFixture) =>
      title === 'Education' ? route.fulfill({ json: [] }) : fulfillFixture()
    );
    await site.goto('resume');
    const resume = site.section('resume');
    await expect(resume.locator('.block-body')).toHaveCount(3);
    await expect(resume.getByRole('heading', { name: 'Education' })).toHaveCount(0);
    await expect(resume.locator('.timeline-item')).toHaveCount(employment.length);
  });

  test('portfolio still loads when a project has no image', async ({ api, page, site }) => {
    api.override('getPortfolioImages', (route, id, fulfillFixture) =>
      id === '102' ? route.fulfill({ json: [{}] }) : fulfillFixture()
    );
    await site.goto('portfolio');
    await expect(page.locator('#portfolio_grid figure')).toHaveCount(3);
    await expect(site.portfolioItem('Beta Report').locator('img')).toHaveCount(0);
  });

  test('project filters show an error when the API is unreachable', async ({ api, site }) => {
    api.override('getProjectTypes', (route) => route.abort('connectionrefused'));
    await site.goto('portfolio');
    await expect(site.section('portfolio').locator('.portfolio-content')).toContainText('Error in loading');
  });

  test('employment shows a loading state while waiting', async ({ api, site }) => {
    let release!: () => void;
    const released = new Promise<void>((resolve) => (release = resolve));
    api.override('employment', async (route) => {
      await released;
      await route.fulfill({ json: employment });
    });
    await site.goto('resume');
    const timeline = site.section('resume').locator('.timeline');
    await expect(timeline).toHaveText('Loading ...');
    release();
    await expect(timeline.locator('.timeline-item')).toHaveCount(employment.length);
  });
});
