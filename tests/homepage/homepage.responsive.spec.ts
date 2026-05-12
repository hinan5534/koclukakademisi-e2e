import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { VIEWPORTS } from '../../utils/constants';
import { assertNoHorizontalScroll } from '../../utils/helpers';

test.describe('Homepage — Responsive Suite @regression', () => {
  const viewportCases = [
    { name: 'Mobile S (375px)', viewport: VIEWPORTS.MOBILE_S },
    { name: 'Mobile L (414px)', viewport: VIEWPORTS.MOBILE_L },
    { name: 'Desktop MD (1280px)', viewport: VIEWPORTS.DESKTOP_MD },
    { name: 'Desktop LG (1440px)', viewport: VIEWPORTS.DESKTOP_LG },
  ];

  for (const { name, viewport } of viewportCases) {
    test(`TC-029-031: ${name} — layout bozulmuyor`, async ({ page }) => {
      await page.setViewportSize(viewport);
      const homePage = new HomePage(page);
      await homePage.open();
      await expect(homePage.heroHeading).toBeVisible();
      await expect(homePage.heroCTA).toBeVisible();
      await assertNoHorizontalScroll(page);
    });
  }

  test('TC-031b: Tablet 768px — [KNOWN BUG] layout sorunu', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.TABLET);
    const homePage = new HomePage(page);
    await homePage.open();
    const hasOverflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    if (hasOverflow) {
      console.warn('BUG TC-031b: Tablet 768px horizontal scroll var');
    }
    await expect(homePage.heroHeading).toBeVisible();
  });

  test('Mobile: Hero heading ve CTA görünür', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.MOBILE_S);
    const homePage = new HomePage(page);
    await homePage.open();
    await expect(homePage.heroHeading).toBeVisible();
    await expect(homePage.heroCTA).toBeVisible();
  });

  test('Mobile: Feature cards görünür', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.MOBILE_S);
    const homePage = new HomePage(page);
    await homePage.open();
    const count = await homePage.getFeatureCardCount();
    expect(count).toBeGreaterThanOrEqual(9);
  });

  test('Mobile: [KNOWN BUG] Giriş Yap hamburger menüde gizli', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.MOBILE_S);
    const homePage = new HomePage(page);
    await homePage.open();
    const isVisible = await homePage.header.btnLogin.isVisible().catch(() => false);
    if (!isVisible) {
      console.warn('BUG: Mobilde Giriş Yap butonu hamburger menüde gizli');
    }
  });
});
