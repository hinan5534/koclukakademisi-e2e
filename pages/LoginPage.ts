import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../utils/constants';

/**
 * LoginPage — Sprint 2
 * Credentials alındıktan sonra selector'lar doldurulacak.
 * Assumption: Standart email + password form mevcut.
 */
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    super(page);

    // Selector'lar login sayfası incelendikten sonra güncellenecek
    this.emailInput = page.getByLabel(/e-posta|email/i).or(page.locator('input[type="email"]'));
    this.passwordInput = page
      .getByLabel(/şifre|parola|password/i)
      .or(page.locator('input[type="password"]'));
    this.submitButton = page
      .getByRole('button', { name: /giriş yap|giriş|login/i })
      .or(page.locator('button[type="submit"]'));
    this.errorMessage = page.locator('[class*="error"], [class*="alert"], [role="alert"]');
    this.forgotPasswordLink = page.getByRole('link', { name: /şifrem|parolamı unuttum/i });
    this.registerLink = page.getByRole('link', { name: /kayıt ol|üye ol/i });
  }

  async open(): Promise<void> {
    await this.navigate(ROUTES.LOGIN);
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async loginAndExpectSuccess(email: string, password: string): Promise<void> {
    await this.login(email, password);
    // Başarılı girişte dashboard'a redirect beklenir
    await expect(this.page).toHaveURL(
      new RegExp(`${ROUTES.WEEKLY_PLAN}|${ROUTES.PROFILE}|dashboard`)
    );
  }

  async loginAndExpectError(email: string, password: string): Promise<void> {
    await this.login(email, password);
    await expect(this.errorMessage).toBeVisible();
  }

  async getErrorText(): Promise<string | null> {
    return this.errorMessage.textContent();
  }
}
