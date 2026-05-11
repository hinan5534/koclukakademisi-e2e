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

  test('TC-004: "Giriş Yap" butonu /giris\'e gider', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.header.clickLogin();
    await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
  });

  test('TC-005: "Kayıt Ol" butonu /kayit\'a gider', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.header.clickRegister();
    await expect(page).toHaveURL(new RegExp(ROUTES.REGISTER));
  });

  test('TC-006: "Kurumsal Giriş" butonu /kurumsal-giris\'e gider', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.header.clickCorporateLogin();
    await expect(page).toHaveURL(new RegExp(ROUTES.CORPORATE_LOGIN));
  });

  test('TC-010: Hero CTA haftalik-plan veya giris\'e yönlendiriyor', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.clickHeroCTA();
    await expect(page).toHaveURL(new RegExp(`${ROUTES.WEEKLY_PLAN}|${ROUTES.LOGIN}`));
  });

  test('TC-029: Mobile 375px layout bozulmuyor', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.MOBILE_S);
    const homePage = new HomePage(page);
    await homePage.open();
    await expect(homePage.heroHeading).toBeVisible();
    await assertNoHorizontalScroll(page);
  });

  test('TC-036: Auth olmadan /haftalik-plan login\'e redirect eder', async ({ page }) => {
    await page.goto(ROUTES.WEEKLY_PLAN);
    await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
  });

  test('TC-037: Auth olmadan /profil login\'e redirect eder', async ({ page }) => {
    await page.goto(ROUTES.PROFILE);
    await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
  });
});
