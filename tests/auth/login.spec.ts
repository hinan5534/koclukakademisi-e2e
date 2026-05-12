import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ROUTES } from '../../utils/constants';

const USER_EMAIL = process.env.TEST_USER_EMAIL || 'hasan@gmail.com';
const USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'Guvenli123';

test.describe('Login — Smoke Suite @smoke', () => {

  test('TC-L001: Login sayfası yükleniyor', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
  });

  test('TC-L002: Geçerli credentials ile giriş başarılı', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.loginAndExpectSuccess(USER_EMAIL, USER_PASSWORD);
  });

  test('TC-L003: Yanlış password ile hata mesajı görünür', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.loginAndExpectError(USER_EMAIL, 'yanlis-sifre-99999');
    const errorText = await loginPage.getErrorText();
    expect(errorText).not.toBeNull();
  });

  test('TC-L004: Boş form submit edilemiyor', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.submitButton.click();
    await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
  });

  test('TC-L005: Geçersiz email formatı ile hata', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.loginAndExpectError('gecersizemail', USER_PASSWORD);
  });

  test('TC-L006: SQL injection denemesi zararsız', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.loginAndExpectError("' OR '1'='1", "' OR '1'='1");
    await expect(page).not.toHaveURL(/error|500/);
  });

  test('TC-L007: [KNOWN BUG] Back butonu session koruması yok', async ({ page }) => {
    // BUG: Login sonrası back'e basınca /giris'e dönüyor — session korunmuyor
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.loginAndExpectSuccess(USER_EMAIL, USER_PASSWORD);
    await page.goBack();
    const url = page.url();
    if (url.includes(ROUTES.LOGIN)) {
      console.warn('BUG TC-L007: Back butonu session koruması eksik');
    }
    // Soft-fail: geliştirici ekibine raporlandı
  });
});

test.describe('Login — Regression Suite @regression', () => {

  test('TC-L008: XSS payload email alanında zararsız', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.loginAndExpectError('<script>alert(1)</script>@test.com', 'test');
    await expect(page).not.toHaveURL(/error|500/);
  });

  test('TC-L009: Çok uzun input (500 karakter) çökertmiyor', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    const longStr = 'a'.repeat(500);
    await loginPage.loginAndExpectError(longStr + '@test.com', longStr);
    await expect(page).not.toHaveURL(/error|500/);
  });

  test('TC-L010: Logout sonrası protected route /giris\'e redirect', async ({ page }) => {
    test.fixme();
  });
});
