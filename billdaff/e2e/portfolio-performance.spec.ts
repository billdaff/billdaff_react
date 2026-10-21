import type { Page } from '@playwright/test';
import { test, expect } from './support/test';
import getPortfolioImagesJson from './fixtures/api/getPortfolioImages.json';

// Limits based on Google's Core Web Vitals "good" scores.
const BUDGET = {
  firstContentfulPaintMs: 1800,
  largestContentfulPaintMs: 2500,
  cumulativeLayoutShift: 0.1,
  interactionMs: 200,
  longTaskMs: 200,
};
const API_LATENCY_MS = 300;

// Slow down the browser so results look like a real user's device, not my laptop.
// Same settings Lighthouse uses. Choose with PERF_PROFILE=mobile|desktop|none.
const KBPS = 1024 / 8;
const PROFILES = {
  // average phone on slow 4G
  mobile: { cpuSlowdown: 4, latencyMs: 150, downloadKbps: 1638.4, uploadKbps: 675 },
  // desktop on wifi/wired
  desktop: { cpuSlowdown: 1, latencyMs: 40, downloadKbps: 10240, uploadKbps: 10240 },
  none: undefined,
};
const PROFILE_NAME = (process.env.PERF_PROFILE || 'mobile') as keyof typeof PROFILES;
if (!(PROFILE_NAME in PROFILES)) {
  throw new Error(`Unknown PERF_PROFILE "${PROFILE_NAME}", expected one of ${Object.keys(PROFILES).join(', ')}`);
}
const PROFILE = PROFILES[PROFILE_NAME];
const IMAGE_COUNT = Object.keys(getPortfolioImagesJson).length;

// Shape of the metrics collected in the browser. Times are ms since the page started loading.
interface Vitals {
  fcp: number | undefined; // first contentful paint, undefined until something is drawn
  lcp: number | undefined; // largest contentful paint, updates as bigger elements appear
  cls: number; // cumulative layout shift score, 0 means nothing moved
  longTasks: number[]; // how long each main thread block lasted
  interactions: { name: string; duration: number }[]; // event name (click, pointerdown...) and response time
}

// lets TypeScript know about window.__vitals, which the init script adds
declare global {
  interface Window {
    __vitals: Vitals;
  }
}

// Runs in the browser before the page loads and records performance metrics
// into window.__vitals so the test can read them later.
async function observeVitals(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const vitals: Vitals = { fcp: undefined, lcp: undefined, cls: 0, longTasks: [], interactions: [] };
    window.__vitals = vitals;
    const observe = (type: string, onEntry: (entry: any) => void, options: Record<string, unknown> = {}) =>
      new PerformanceObserver((list) => list.getEntries().forEach(onEntry)).observe({
        type,
        buffered: true,
        ...options,
      } as PerformanceObserverInit);

    // first paint on screen
    observe('paint', (entry) => {
      if (entry.name === 'first-contentful-paint') vitals.fcp = entry.startTime;
    });
    // when the biggest element finished drawing
    observe('largest-contentful-paint', (entry) => (vitals.lcp = entry.startTime));
    // how much content jumped around (ignores shifts caused by clicks)
    observe('layout-shift', (entry) => {
      if (!entry.hadRecentInput) vitals.cls += entry.value;
    });
    // anything that blocked the main thread for 50ms+
    observe('longtask', (entry) => vitals.longTasks.push(entry.duration));
    // how long clicks/key presses took to respond
    observe('event', (entry) => vitals.interactions.push({ name: entry.name, duration: entry.duration }), {
      durationThreshold: 16,
    });
  });
}

// Uses Chrome DevTools Protocol to slow down CPU and network.
// Note: mocked API responses aren't affected, only the app's own files are.
async function throttle(page: Page): Promise<void> {
  if (!PROFILE) return;
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: PROFILE.cpuSlowdown });
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: PROFILE.latencyMs,
    downloadThroughput: PROFILE.downloadKbps * KBPS,
    uploadThroughput: PROFILE.uploadKbps * KBPS,
  });
}

const readVitals = (page: Page) => page.evaluate(() => window.__vitals);

test.describe(`portfolio performance (${PROFILE_NAME} profile)`, () => {
  // Chromium only (set in playwright.config.ts)
  test.beforeEach(async ({ page }) => {
    test.slow(!!PROFILE, 'Throttled page loads take longer');
    await throttle(page);
    await observeVitals(page);
  });

  test('loads within the paint and layout shift budgets', async ({ page, site }) => {
    await site.goto('portfolio');
    await expect(page.locator('#portfolio_grid figure img')).toHaveCount(IMAGE_COUNT);
    await expect(page.locator('#portfolio_grid')).toHaveClass(/shuffle/);
    // wait 2 frames so any late layout shifts get recorded
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));

    const vitals = await readVitals(page);
    // shows the numbers in the HTML report
    test.info().annotations.push({ type: 'vitals', description: JSON.stringify(vitals) });
    expect(vitals.fcp, 'first contentful paint (ms)').toBeLessThan(BUDGET.firstContentfulPaintMs);
    expect(vitals.lcp, 'largest contentful paint (ms)').toBeLessThan(BUDGET.largestContentfulPaintMs);
    expect(vitals.cls, 'cumulative layout shift').toBeLessThan(BUDGET.cumulativeLayoutShift);
  });

  test('fetches project images in parallel', async ({ api, page, site }) => {
    // delay each image request and track how many are open at the same time
    let inFlight = 0;
    let maxInFlight = 0;
    api.override('getPortfolioImages', async (_route, _id, fulfillFixture) => {
      maxInFlight = Math.max(maxInFlight, ++inFlight);
      await new Promise((resolve) => setTimeout(resolve, API_LATENCY_MS));
      inFlight--;
      await fulfillFixture();
    });

    await site.goto('portfolio');
    await expect(page.locator('#portfolio_grid figure')).toHaveCount(IMAGE_COUNT);

    // if requests ran one at a time this would be 1
    expect(maxInFlight, 'image requests in flight at once').toBe(IMAGE_COUNT);
  });

  test('filtering and opening a project stay responsive', async ({ page, site }) => {
    await site.goto('portfolio');
    await expect(page.locator('#portfolio_grid')).toHaveClass(/shuffle/);
    // only count long tasks from here on, not from page load
    const longTasksBefore = (await readVitals(page)).longTasks.length;

    for (const filter of ['Data Reporting', 'Web Development', 'All']) {
      await page.locator('#portfolio_filters .filter', { hasText: filter }).click();
      await expect(page.locator('#portfolio_filters li.active')).toHaveText(filter);
    }
    await site.openProject('Alpha Site');
    await site.projectOverlay('Alpha Site').locator('.ajax-page-close-button a').click();
    await expect(site.projectOverlay('Alpha Site')).toBeHidden();

    const vitals = await readVitals(page);
    // fast clicks (under 16ms) don't get recorded, so this list can be empty
    const durations = vitals.interactions.map(({ duration }) => duration);
    test.info().annotations.push({
      type: 'click durations (ms)',
      description: JSON.stringify(vitals.interactions.filter(({ name }) => name === 'click').map(({ duration }) => duration)),
    });
    expect(Math.max(0, ...durations), 'slowest interaction (ms)').toBeLessThan(
      BUDGET.interactionMs
    );
    expect(vitals.longTasks.slice(longTasksBefore).filter((duration) => duration > BUDGET.longTaskMs)).toEqual([]);
  });
});
