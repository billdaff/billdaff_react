import { test, expect } from './support/test';
import { SECTIONS } from './support/SitePage';

test.describe('section navigation', () => {
  test('opens on the home section by default', async ({ site }) => {
    await site.goto();
    await expect(site.section('home')).toBeVisible();
    await expect(site.menuLink('Home').locator('xpath=..')).toHaveClass(/active/);
  });

  for (const id of SECTIONS) {
    test(`deep link #${id} opens that section`, async ({ site }) => {
      await site.goto(id);
      await expect(site.section(id)).toBeVisible();
      for (const other of SECTIONS.filter((s) => s !== id)) {
        await expect(site.section(other)).toBeHidden();
      }
    });
  }

  test('main menu switches sections and highlights the active item', async ({ site }) => {
    await site.goto();
    const steps = [
      ['Resume', 'resume'],
      ['Portfolio', 'portfolio'],
      ['Contact', 'contact'],
      ['Home', 'home'],
    ] as const;
    for (const [name, id] of steps) {
      await site.navigateTo(name);
      await expect(site.section(id)).toBeVisible();
      await expect(site.menu.locator('li.active')).toHaveText(name);
    }
  });

  test('browser back returns to the previous section', async ({ page, site }) => {
    await site.goto();
    await site.navigateTo('Resume');
    await page.goBack();
    await site.expectCurrentSection('home');
  });
});
