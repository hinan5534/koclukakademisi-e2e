import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string = '/'): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForVisible(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    );
    await this.page.waitForTimeout(400);
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo({ top: 0 }));
    await this.page.waitForTimeout(200);
  }

  async getMetaContent(name: string): Promise<string | null> {
    return this.page.evaluate((n) => {
      const el =
        document.querySelector(`meta[name="${n}"]`) ||
        document.querySelector(`meta[property="${n}"]`);
      return el ? el.getAttribute('content') : null;
    }, name);
  }

  async hasNoHorizontalScroll(): Promise<boolean> {
    return this.page.evaluate(
      () => document.body.scrollWidth <= window.innerWidth
    );
  }

  async getConsoleErrors(): Promise<string[]> {
    const errors: string[] = [];
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    return errors;
  }
}
