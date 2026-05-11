import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { VIEWPORTS } from '../../utils/constants';
import { assertNoHorizontalScroll } from '../../utils/helpers';

test.describe('Homepage — Responsive Suite @regression', () => {
  const viewportCases = [
    { name: 'Mobile S (375px)', viewport: VIEWPORTS.MOBILE_S },
    { name: 'Mobile L (414px)', viewport: VIEWPORTS.MOBILE_L },
    { name: 'Tablet (768px)', viewport: VIEWPORTS.TABLET },
    { name: 'Desktop MD (1280px)', viewport: VIEWPORTS.DESKTOP_MD },
    { name: 'Desktop LG (1440px)', viewport: VIEWPORTS.DESKTOP_LG },
  ];

  for (const { name, viewport } of viewportCases) {
    test(`TC-029-031: ${name} — layout bozulmuyor`, async ({ page }) => {
      await page.setViewportSize(viewport);
      const homePage = new HomePage(page);
      await homePage.open();

      // Hero heading görünür
      await expect(homePage.heroHeading).toBeVisible();

      // CTA görünür
      await expect(homePage.heroCTA).toBeVisible();

      // Horizontal scroll yok
      await assertNoHorizontalScroll(page);
    });
  }

  test('Mobile: Header logo görünür', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.MOBILE_S);
    const homePage = new HomePage(page);
    await homePage.open();
    await expect(homePage.header.logo).toBeVisible();
  });

  test('Mobile: Giriş Yap butonu görünür', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.MOBILE_S);
    const homePage = new HomePage(page);
    await homePage.open();
    await expect(homePage.header.btnLogin).toBeVisible();
  });

  test('Mobile: Feature cards görünür', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.MOBILE_S);
    const homePage = new HomePage(page);
    await homePage.open();
    await expect(homePage.featuresSectionHeading).toBeVisible();
    const count = await homePage.getFeatureCardCount();
    expect(count).toBeGreaterThanOrEqual(9);
  });
});
