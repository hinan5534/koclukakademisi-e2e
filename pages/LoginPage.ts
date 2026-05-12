import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../utils/constants';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly normalLoginTab: Locator;

  constructor(page: Page) {
    super(page);

    // Sayfada iki sekme var: "Giriş" ve "Kurumsal Giriş"
    // Sadece normal "Giriş" sekmesini kullanıyoruz — kurumsal ile karışmaması için
    this.normalLoginTab = page
      .getByRole('tab', { name: /^giriş$/i })
      .or(page.getByRole('button', { name: /^giriş$/i }))
      .or(page.locator('a, button, [role="tab"]').filter({ hasText: /^Giriş$/ }));

    this.emailInput = page
      .getByLabel(/e-posta|email/i)
      .or(page.locator('input[type="email"]'))
      .first();

    this.passwordInput = page
      .getByLabel(/şifre|parola|password/i)
      .or(page.locator('input[type="password"]'))
      .first();

    // first() — kurumsal form'un submit butonuyla karışmaması için
    this.submitButton = page
      .getByRole('button', { name: /giriş yap/i })
      .or(page.locator('button[type="submit"]'))
      .first();

    this.errorMessage = page
      .locator('[class*="error"], [class*="alert"], [role="alert"], [class*="hata"]')
      .first();

    this.forgotPasswordLink = page.getByRole('link', { name: /şifr.*unuttum|parolamı unuttum/i });
    this.registerLink = page.getByRole('link', { name: /kayıt ol|üye ol/i });
  }

  async open(): Promise<void> {
    await this.navigate(ROUTES.LOGIN);
    // Eğer "Giriş" tab'ı görünürse tıkla — kurumsal tab varsayılan aktif olabilir
    const tabVisible = await this.normalLoginTab.isVisible().catch(() => false);
    if (tabVisible) {
      await this.normalLoginTab.click();
      await this.page.waitForTimeout(300);
    }
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async loginAndExpectSuccess(email: string, password: string): Promise<void> {
    await this.login(email, password);
    await expect(this.page).not.toHaveURL(new RegExp(ROUTES.LOGIN), { timeout: 15_000 });
  }

  async loginAndExpectError(email: string, password: string): Promise<void> {
    await this.login(email, password);
    const stayedOnLogin = this.page.url().includes(ROUTES.LOGIN);
    if (!stayedOnLogin) {
      await expect(this.errorMessage).toBeVisible({ timeout: 5_000 });
    }
  }

  async getErrorText(): Promise<string | null> {
    return this.errorMessage.textContent();
  }
}
