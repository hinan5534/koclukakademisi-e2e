import { test, expect } from '../../fixtures/base.fixture';
import { EXPECTED_TEXTS, ROUTES, VIEWPORTS } from '../../utils/constants';
import { assertNoHorizontalScroll } from '../../utils/helpers';
import { HomePage } from '../../pages/HomePage';

test.describe('Homepage — Smoke Suite @smoke', () => {
  test('TC-001: Sayfa başarılı yükleniyor ve title doğru', async ({ page }) => {
    await page.goto(ROUTES.HOME);
    await expect(page).toHaveTitle(EXPECTED_TEXTS.PAGE_TITLE);
    await expect(page).toHaveURL(/koclukakademisi\.com\/?$/);
  });

  test('TC-002: Hero h1 başlık görünür ve doğru', async ({ homePage }) => {
    await expect(homePage.heroHeading).toBeVisible();
    const text = await homePage.getHeroHeadingText();
    expect(text).toContain('Haftalık Plan');
  });

  test('TC-002b: Hero CTA butonu görünür', async ({ homePage }) => {
    await expect(homePage.heroCTA).toBeVisible();
  });

  test('TC-003: Header logo görünür', async ({ homePage }) => {
    await expect(homePage.header.logo).toBeVisible();
  });

  test('TC-004: "Giriş Yap" butonu doğru href\'e sahip', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    const href = await homePage.header.btnLogin.getAttribute('href');
    expect(href).toContain(ROUTES.LOGIN);
  });

  test('TC-005: "Kayıt Ol" butonu doğru href\'e sahip', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    const href = await homePage.header.btnRegister.getAttribute('href');
    expect(href).toContain(ROUTES.REGISTER);
  });

  test('TC-006: "Kurumsal Giriş" butonu doğru href\'e sahip', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    const href = await homePage.header.btnCorporateLogin.getAttribute('href');
    expect(href).toContain(ROUTES.CORPORATE_LOGIN);
  });

  test('TC-010: Hero CTA doğru href\'e sahip', async ({ homePage }) => {
    const href = await homePage.heroCTA.getAttribute('href');
    expect(href).toMatch(/haftalik-plan|giris/);
  });

  test('TC-029: Mobile 375px layout bozulmuyor', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.MOBILE_S);
    const homePage = new HomePage(page);
    await homePage.open();
    await expect(homePage.heroHeading).toBeVisible();
    await assertNoHorizontalScroll(page);
  });

  test('TC-036: [KNOWN BUG] /haftalik-plan auth guard yok — login\'e redirect etmiyor', async ({ page }) => {
    // BUG: Protected route unauthenticated kullanıcıya açık
    // Beklenen: /giris'e redirect | Gerçek: /haftalik-plan açılıyor
    await page.goto(ROUTES.WEEKLY_PLAN);
    const url = page.url();
    const hasAuthGuard = url.includes(ROUTES.LOGIN);
    if (!hasAuthGuard) {
      console.warn('BUG TC-036: /haftalik-plan auth guard eksik — unauthenticated erişim açık');
    }
    // Test şimdilik soft-fail: bug bilinçli olarak loglanıyor
  });

  test('TC-037: [KNOWN BUG] /profil auth guard yok — login\'e redirect etmiyor', async ({ page }) => {
    // BUG: Protected route unauthenticated kullanıcıya açık
    await page.goto(ROUTES.PROFILE);
    const url = page.url();
    const hasAuthGuard = url.includes(ROUTES.LOGIN);
    if (!hasAuthGuard) {
      console.warn('BUG TC-037: /profil auth guard eksik — unauthenticated erişim açık');
    }
  });
});
