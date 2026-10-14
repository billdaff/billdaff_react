import type { Page, Route } from '@playwright/test';
import { API_ORIGIN } from '../../src/api';
import type {
  EmploymentApiItem,
  PortfolioApiItem,
  PortfolioImageApiItem,
  ProjectTypeApiItem,
  ResumeArticleApiItem,
} from '../../src/types/api';
import employmentJson from '../fixtures/api/employment.json';
import portfoliosJson from '../fixtures/api/portfolios.json';
import getPortfolioImagesJson from '../fixtures/api/getPortfolioImages.json';
import getProjectTypesJson from '../fixtures/api/getProjectTypes.json';
import resumeArticlesJson from '../fixtures/api/resume_articles.json';

export const employment: EmploymentApiItem[] = employmentJson;
const portfolios: PortfolioApiItem[] = portfoliosJson;
const getPortfolioImages: Record<string, PortfolioImageApiItem[]> = getPortfolioImagesJson;
const getProjectTypes: ProjectTypeApiItem[] = getProjectTypesJson;
const resumeArticles: Record<string, ResumeArticleApiItem[]> = resumeArticlesJson;

const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

export type Endpoint =
  | 'employment'
  | 'portfolios'
  | 'getProjectTypes'
  | 'getPortfolioImages'
  | 'resume_articles';

export type EndpointHandler = (route: Route, param: string, fulfillFixture: () => Promise<void>) => Promise<void>;

export interface ApiController {
  unmocked: string[];
  override(endpoint: Endpoint, handler: EndpointHandler): void;
}

const fixtures: Record<Endpoint, (param: string) => unknown> = {
  employment: () => employment,
  portfolios: () => portfolios,
  getProjectTypes: () => getProjectTypes,
  getPortfolioImages: (id) => getPortfolioImages[id],
  resume_articles: (title) => resumeArticles[title],
};

const isEndpoint = (name: string): name is Endpoint => name in fixtures;

export async function mockApi(page: Page, { baseURL }: { baseURL: string }): Promise<ApiController> {
  const appOrigin = new URL(baseURL).origin;
  const overrides: Partial<Record<Endpoint, EndpointHandler>> = {};
  const unmocked: string[] = [];

  await page.route(
    (url) => url.origin !== appOrigin && url.origin !== API_ORIGIN,
    (route) => route.abort()
  );

  await page.route(`${API_ORIGIN}/**`, async (route) => {
    const { pathname } = new URL(route.request().url());
    const [, prefix, endpoint, ...rest] = pathname.split('/');

    if (prefix !== 'api') {
      return route.fulfill({ contentType: 'image/png', body: PIXEL });
    }

    const param = decodeURIComponent(rest.join('/'));
    if (!isEndpoint(endpoint)) {
      unmocked.push(pathname);
      return route.fulfill({ status: 404, json: { message: 'Unknown endpoint ' + pathname } });
    }

    const fulfillFixture = async () => {
      const body = fixtures[endpoint](param);
      if (body === undefined) {
        unmocked.push(pathname);
        return route.fulfill({ status: 404, json: { message: 'No fixture for ' + pathname } });
      }
      return route.fulfill({ json: body });
    };

    const override = overrides[endpoint];
    return override ? override(route, param, fulfillFixture) : fulfillFixture();
  });

  return {
    unmocked,
    override(endpoint, handler) {
      overrides[endpoint] = handler;
    },
  };
}
