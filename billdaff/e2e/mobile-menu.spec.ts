import { test, expect } from './support/test';

test('mobile menu opens, navigates and closes', async ({ page, site }) => {
  await site.goto();
  const header = page.locator('#site_header');

  await expect(header).toHaveClass(/mobile-menu-hide/);
  await expect(site.menuLink('Resume')).toBeHidden();

  await site.menuToggle.click();
  await expect(header).not.toHaveClass(/mobile-menu-hide/);
  await expect(site.menuLink('Resume')).toBeVisible();

  await site.navigateTo('Resume');
  await expect(header).toHaveClass(/mobile-menu-hide/);
  await expect(site.section('resume')).toBeVisible();
});
