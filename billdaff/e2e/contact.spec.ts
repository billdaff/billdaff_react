import { test, expect } from './support/test';

test('contact section shows location, email and availability', async ({ site }) => {
  await site.goto('contact');
  const contact = site.section('contact');
  await expect(contact.getByRole('heading', { name: 'Contact' })).toBeVisible();
  await expect(contact.locator('.contact-info-block h5')).toHaveText([
    'Brick NJ, USA',
    'billdafeldecker@gmail.com',
    'Freelance Available',
  ]);
});
