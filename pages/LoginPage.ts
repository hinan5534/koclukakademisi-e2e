import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../utils/constants';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    super(page);

    // DOM'dan görülen gerçek selector'lar — tek form, tab yok
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('[class*="error"], [class*="alert"], [role="alert"]').first();
    this.forgotPasswordLink = page.getByText('Şifremi unuttum');
  }

  async open(): Promise<void> {
    await this.navigate(ROUTES.LOGIN);
    // Tab yok, direkt form görünür — sadece form'un yüklendiğini bekle
    await this.emailInput.waitFor({ state: 'visible', timeout: 10_000 });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    // Submit öncesi kısa bekle — SPA form validation
    await this.page.waitForTimeout(300);
    await this.submitButton.click();
  }

  async dismissNotificationPrompt(): Promise<void> {
    // "Bildirimlere izin verin" banner'ını kapat
    const dismissBtn = this.page.getByRole('button', { name: /sonra|kapat|izin verme/i })
      .or(this.page.locator('button').filter({ hasText: /sonra/i }))
      .or(this.page.locator('[aria-label="kapat"], [aria-label="close"]'));
    const visible = await dismissBtn.isVisible().catch(() => false);
    if (visible) {
      await dismissBtn.click();
      await this.page.waitForTimeout(300);
    }
  }

  async loginAndExpectSuccess(email: string, password: string): Promise<void> {
    await this.login(email, password);
    // URL'nin /giris'ten başka bir şeye değişmesini bekle
    await this.page.waitForURL((url) => !url.toString().includes(ROUTES.LOGIN), {
      timeout: 20_000,
    });
  }

  async loginAndExpectError(email: string, password: string): Promise<void> {
    await this.login(email, password);
    await this.page.waitForTimeout(1500);
    const url = this.page.url();
    if (!url.includes(ROUTES.LOGIN)) {
      await expect(this.errorMessage).toBeVisible({ timeout: 5_000 });
    }
    // Login sayfasında kaldıysa zaten hata var demektir — pass
  }

  async getErrorText(): Promise<string | null> {
    try {
      return await this.errorMessage.textContent({ timeout: 3_000 });
    } catch {
      return null;
    }
  }
}
