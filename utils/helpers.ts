import { Page, expect } from '@playwright/test';

/**
 * Sayfada horizontal scroll var mı kontrol eder.
 * Responsive testlerde kullanılır.
 */
export async function assertNoHorizontalScroll(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    return document.body.scrollWidth > window.innerWidth;
  });
  expect(overflow, 'Horizontal scroll detected — layout broken').toBe(false);
}

/**
 * Bir URL'in belirli bir route ile eşleşip eşleşmediğini kontrol eder.
 */
export async function assertUrlContains(page: Page, path: string): Promise<void> {
  await expect(page).toHaveURL(new RegExp(path.replace('/', '\\/')));
}

/**
 * Sayfanın en altına smooth scroll yapar ve layout'un settle etmesini bekler.
 */
export async function scrollToBottom(page: Page): Promise<void> {
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
  await page.waitForTimeout(500);
}

/**
 * Sayfanın en üstüne çıkar.
 */
export async function scrollToTop(page: Page): Promise<void> {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(300);
}

/**
 * Network isteğini intercept ederek belirli bir URL pattern'inin
 * çağrılıp çağrılmadığını izler.
 */
export async function waitForRequest(page: Page, urlPattern: string | RegExp): Promise<void> {
  await page.waitForRequest(urlPattern, { timeout: 10_000 });
}

/**
 * Element'in viewport içinde görünür olup olmadığını kontrol eder.
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, selector);
}

/**
 * Sayfa yükleme performansını ölçer ve ms cinsinden döner.
 */
export async function measurePageLoadTime(page: Page, url: string): Promise<number> {
  const start = Date.now();
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  return Date.now() - start;
}

/**
 * Console error'larını yakalar.
 * Test setup'ında kullanılır.
 */
export function captureConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  return errors;
}
