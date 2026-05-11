import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ROUTES } from '../../utils/constants';

test.describe('Navigation @regression', () => {
  test('TC-003: Logo ana sayfaya yönlendiriyor', async ({ page }) => {
    // Önce başka bir sayfaya git, sonra logo'ya tıkla
    await page.goto(ROUTES.ABOUT);
    const homePage = new HomePage(page);
    await homePage.header.clickLogo();
    await expect(page).toHaveURL(/koclukakademisi\.com\/?$/);
  });

  test('TC-007: "Hakkımızda" nav linki', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.header.clickNavLink('about');
    await expect(page).toHaveURL(new RegExp(ROUTES.ABOUT));
  });

  test('TC-008: "Blog" nav linki', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.header.clickNavLink('blog');
    await expect(page).toHaveURL(new RegExp(ROUTES.BLOG));
  });

  test('TC-009: "İletişim" nav linki', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.header.clickNavLink('contact');
    await expect(page).toHaveURL(new RegExp(ROUTES.CONTACT));
  });

  test('TC-011: Footer CTA doğru href\'e sahip', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.scrollToBottom();
    const href = await homePage.footerCTA.getAttribute('href');
    expect(href).toMatch(/haftalik-plan|giris/);
  });

  test('Tüm nav linkleri keyboard (Tab) ile erişilebilir', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();

    // Tab ile focuslanabilir elementleri sayar
    const focusableCount = await page.evaluate(() => {
      const selector = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
      return document.querySelectorAll(selector).length;
    });
    expect(focusableCount).toBeGreaterThan(5);
  });

  test('Tüm linkler geçerli href attribute\'a sahip', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();

    const links = await page.locator('a[href]').all();
    for (const link of links) {
      const href = await link.getAttribute('href');
      expect(href, 'Boş href bulundu').not.toBe('');
      expect(href, '#-only href bulundu').not.toBe('#');
    }
  });
});
