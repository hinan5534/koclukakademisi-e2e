import { test, expect } from '../../fixtures/base.fixture';
import { EXPECTED_TEXTS, FEATURE_CARDS, PROTECTED_ROUTES, ROUTES } from '../../utils/constants';
import { HomePage } from '../../pages/HomePage';

test.describe('Homepage — Regression Suite @regression', () => {
  test('TC-012: En az 9 feature kartı render edilmiş', async ({ homePage }) => {
    const count = await homePage.getFeatureCardCount();
    expect(count, 'Feature card sayısı 9\'dan az').toBeGreaterThanOrEqual(9);
  });

  test('TC-013-021: Feature card linkleri doğru route\'lara işaret ediyor', async ({ homePage }) => {
    await homePage.assertFeatureCardLinks();
  });

  test('TC-022: Blog section başlığı görünür', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.scrollToBottom();
    await expect(homePage.blogSectionHeading).toBeVisible();
  });

  test('TC-023: Blog section içerik var veya gizlenmiş [known-bug]', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    const visible = await homePage.isBlogSectionVisible();
    if (visible) {
      const cardCount = await homePage.getBlogCardCount();
      // BUG: Şu an section görünür ama içerik yok
      // Bu test intentionally fail edecek, known bug olarak işaretlendi
      expect(
        cardCount,
        'BUG TC-023: Blog section görünür ama blog kartı yok'
      ).toBeGreaterThan(0);
    }
    // Section gizliyse test pass
  });

  test('TC-027: Footer orphan "OK" text bug kontrolü [known-bug]', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.scrollToBottom();
    const hasBug = await homePage.footer.hasOrphanOKText();
    expect(hasBug, 'BUG TC-027: Footer\'da orphan "OK" text mevcut').toBe(false);
  });

  test('TC-028b: Footer sahte telefon numarası hâlâ var [known-bug]', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.scrollToBottom();
    const hasFakePhone = await homePage.footer.hasFakePhoneNumber();
    if (hasFakePhone) {
      console.warn('BUG TC-028b: Sahte telefon numarası (+90 212 123 45 67) hâlâ görünür');
    }
  });

  test('TC-024: Footer quick links görünür', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.scrollToBottom();
    await homePage.footer.assertQuickLinks();
  });

  test('TC-025: Footer Gizlilik Politikası linki çalışıyor', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.scrollToBottom();
    await homePage.footer.clickPrivacyLink();
    await expect(page).toHaveURL(new RegExp(ROUTES.PRIVACY));
  });

  test('TC-026: Footer Kullanım Koşulları linki çalışıyor', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.scrollToBottom();
    await homePage.footer.clickTermsLink();
    await expect(page).toHaveURL(new RegExp(ROUTES.TERMS));
  });

  test('TC-032: Meta title doğru', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await expect(page).toHaveTitle(EXPECTED_TEXTS.PAGE_TITLE);
  });

  test('TC-033: Meta description mevcut ve yeterli uzunlukta', async ({ homePage }) => {
    const desc = await homePage.getMetaContent('description');
    expect(desc, 'Meta description eksik').not.toBeNull();
    expect(desc!.length, 'Meta description çok kısa').toBeGreaterThan(50);
  });

  test('TC-035: Var olmayan route uygun response döner', async ({ page }) => {
    const response = await page.goto('/bu-sayfa-kesinlikle-yoktur-xyzabc123');
    const status = response?.status();
    // 404 veya redirect (200) kabul edilir
    expect([200, 404]).toContain(status);
  });

  test.describe('[KNOWN BUG] Protected route\'lar auth guard eksik', () => {
    for (const route of PROTECTED_ROUTES) {
      test(`${route} — unauthenticated erişim açık (auth guard yok)`, async ({ page }) => {
        await page.goto(route);
        const url = page.url();
        if (!url.includes(ROUTES.LOGIN)) {
          console.warn(`BUG: ${route} auth guard eksik — unauthenticated erişim açık`);
        }
        // Soft-fail: geliştirici ekibine raporlanacak
      });
    }
  });

  test.describe('Navigation linkleri', () => {
    const navLinks = [
      { name: 'Hakkımızda', route: ROUTES.ABOUT },
      { name: 'Blog', route: ROUTES.BLOG },
      { name: 'İletişim', route: ROUTES.CONTACT },
    ] as const;

    for (const link of navLinks) {
      test(`TC-00x: Nav "${link.name}" → ${link.route}`, async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await homePage.header.clickNavLink(
          link.name === 'Hakkımızda' ? 'about' : link.name === 'Blog' ? 'blog' : 'contact'
        );
        await expect(page).toHaveURL(new RegExp(link.route));
      });
    }
  });
});
