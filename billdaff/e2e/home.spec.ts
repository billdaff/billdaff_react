import { test, expect } from './support/test';
import { BIRTHDAY } from '../src/util/util';

function ageOn(date: Date, timeZone: string): number {
  const [year, month, day] = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .split('-')
    .map(Number);
  const hadBirthday = month > BIRTHDAY.month || (month === BIRTHDAY.month && day >= BIRTHDAY.day);
  return year - BIRTHDAY.year - (hadBirthday ? 0 : 1);
}

test.describe('home section', () => {
  test.beforeEach(async ({ site }) => {
    await site.goto('home');
  });

  test('shows the profile summary', async ({ site }) => {
    const home = site.section('home');
    await expect(home.getByRole('heading', { level: 1 })).toHaveText('Bill Dafeldecker');
    await expect(home.getByRole('heading', { name: 'About Me' })).toBeVisible();
    await expect(home.locator('.info-list')).toContainText('Brick, NJ');
  });

  test('shows age calculated from the current date', async ({ site, clockTime, timezoneId }) => {
    const age = ageOn(clockTime, timezoneId!);
    await expect(site.section('home').locator('#age')).toHaveText(String(age));
  });

  test('links to email, GitHub and the resume PDF', async ({ site }) => {
    const home = site.section('home');
    await expect(home.getByRole('link', { name: 'billdafeldecker@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:billdafeldecker@gmail.com'
    );
    await expect(home.getByRole('link', { name: 'https://github.com/billdaff' })).toHaveAttribute(
      'href',
      'https://github.com/billdaff'
    );
    const resume = home.getByRole('link', { name: 'Download Resume' });
    await expect(resume).toHaveAttribute('href', 'assets/DafeldeckerResume.pdf');
    await expect(resume).toHaveAttribute('target', '_blank');
  });

  test('resume PDF is served', async ({ request }) => {
    const response = await request.get('/assets/DafeldeckerResume.pdf');
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('application/pdf');
  });
});

for (const date of ['2026-07-10', '2026-07-11', '2026-07-20', '2026-12-31', '2027-08-01']) {
  test.describe(`age on ${date}`, () => {
    test.use({ clockTime: new Date(`${date}T12:00:00-05:00`) });

    test('matches the birthday', async ({ site, clockTime, timezoneId }) => {
      await site.goto('home');
      await expect(site.section('home').locator('#age')).toHaveText(String(ageOn(clockTime, timezoneId!)));
    });
  });
}
