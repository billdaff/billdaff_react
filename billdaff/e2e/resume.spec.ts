import { test, expect } from './support/test';

test.describe('resume section', () => {
  test.beforeEach(async ({ site }) => {
    await site.goto('resume');
  });

  test('lists employment newest first with formatted dates', async ({ site }) => {
    const items = site.section('resume').locator('.timeline-item');
    await expect(items.locator('.item-small')).toHaveText([
      'Sample Software Co - Remote',
      'Example Agency - Trenton, NJ',
      'First Job LLC - Brick, NJ',
    ]);
    await expect(items.locator('.item-period')).toHaveText([
      '09-2019 to present',
      '06-2015 to 08-2019',
      '01-2010 to 05-2015',
    ]);
    await expect(items.first().locator('.item-title')).toHaveText('Senior Developer');
    await expect(items.first().locator('.item-description')).toHaveText('Leads frontend work.');
  });

  test('renders each resume article from the API', async ({ site }) => {
    const resume = site.section('resume');
    for (const [title, text] of [
      ['Education', 'Fixture education text.'],
      ['Qualifications and Technology Experience', 'Fixture qualifications text.'],
      ['Notable Projects', 'Fixture notable projects text.'],
      ['Services and Solutions', 'Fixture services text.'],
    ]) {
      const block = resume.locator('.block').filter({ has: site.page.getByRole('heading', { name: title, exact: true }) });
      await expect(block.locator('.block-body')).toHaveText(text);
    }
  });

  test('has a resume download link', async ({ site }) => {
    await expect(site.section('resume').getByRole('link', { name: 'Download Resume' })).toHaveAttribute(
      'href',
      'assets/DafeldeckerResume.pdf'
    );
  });
});
