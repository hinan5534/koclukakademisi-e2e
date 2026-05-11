import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ROUTES } from '../../utils/constants';

/**
 * Sprint 2 — Login Test Suite
 * Bu dosya credentials alındıktan sonra aktif hale gelecek.
 * Şu an tüm testler skip edilmiş durumda.
 */

const USER_EMAIL = process.env.TEST_USER_EMAIL || '';
const USER_PASSWORD = process.env.TEST_USER_PASSWORD || '';

test.describe('Login — Smoke Suite @smoke', () => {
  test.skip(!USER_EMAIL, 'TEST_USER_EMAIL env değişkeni tanımlı değil — Sprint 2');

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
    await loginPage.loginAndExpectError(USER_EMAIL, 'yanlis-sifre-12345');
    const errorText = await loginPage.getErrorText();
    expect(errorText).not.toBeNull();
  });

  test('TC-L004: Boş form submit edilemiyor', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.submitButton.click();
    // Hala login sayfasındayız
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
    // App çökmemeli, hata mesajı dönmeli
    await expect(page).not.toHaveURL(/error|500/);
  });

  test('TC-L007: Başarılı login sonrası back butonu session korumalı', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.loginAndExpectSuccess(USER_EMAIL, USER_PASSWORD);
    await page.goBack();
    // Login sayfasına dönse bile oturum korunuyor mu?
    await expect(page).not.toHaveURL(new RegExp(ROUTES.LOGIN));
  });
});

test.describe('Login — Regression Suite @regression', () => {
  test.skip(!USER_EMAIL, 'TEST_USER_EMAIL env değişkeni tanımlı değil — Sprint 2');

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
    // TODO: Logout flow implement edilince doldur
    test.fixme();
  });
});
