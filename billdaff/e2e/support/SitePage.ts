import { expect, type Locator, type Page } from '@playwright/test';
import { slugify } from '../../src/util/util';

export const SECTIONS = ['home', 'resume', 'portfolio', 'contact'] as const;
export type SectionId = (typeof SECTIONS)[number];
export type MenuName = 'Home' | 'Resume' | 'Portfolio' | 'Contact';


export class SitePage {
  readonly page: Page;
  readonly menu: Locator;
  readonly menuToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menu = page.locator('#nav');
    this.menuToggle = page.locator('.menu-toggle');
  }

  section(id: SectionId): Locator {
    return this.page.locator(`section.pt-page[data-id="${id}"]`);
  }

  currentSections(): Locator {
    return this.page.locator('section.pt-page-current');
  }

  menuLink(name: MenuName): Locator {
    return this.menu.getByRole('link', { name, exact: true });
  }

  async goto(id?: SectionId): Promise<void> {
    await this.page.goto(id ? `/#${id}` : '/');
    await expect(this.page.locator('.preloader')).toBeHidden();
    await this.expectCurrentSection(id || 'home');
  }

  async navigateTo(name: MenuName): Promise<void> {
    await this.menuLink(name).click();
    await this.expectCurrentSection(name.toLowerCase() as SectionId);
  }

  async expectCurrentSection(id: SectionId): Promise<void> {
    await expect(this.currentSections()).toHaveCount(1);
    await expect(this.currentSections()).toHaveAttribute('data-id', id);
    await expect(this.page).toHaveURL(new RegExp(`#${id}$`));
  }

  portfolioItem(title: string): Locator {
    return this.page.locator('#portfolio_grid figure').filter({
      has: this.page.locator(`a[href="#${slugify(title)}"]`),
    });
  }

  projectOverlay(title: string): Locator {
    return this.page.locator(`#page-ajax-loaded-${slugify(title)}`);
  }

  async openProject(title: string): Promise<void> {
    await this.portfolioItem(title).getByRole('link').click();
    await expect(this.projectOverlay(title)).toBeVisible();
  }
}
