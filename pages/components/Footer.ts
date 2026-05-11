import { Page, Locator, expect } from '@playwright/test';

export class Footer {
  readonly page: Page;

  readonly footer: Locator;
  readonly privacyLink: Locator;
  readonly termsLink: Locator;
  readonly emailText: Locator;
  readonly copyright: Locator;

  constructor(page: Page) {
    this.page = page;
    this.footer = page.locator('footer');
    this.privacyLink = page.getByRole('link', { name: 'Gizlilik Politikası' });
    this.termsLink = page.getByRole('link', { name: 'Kullanım Koşulları' });
    this.emailText = page.getByText('info.koclukakademisi@gmail.com');
    this.copyright = page.getByText(/2026 Koçluk Akademisi/);
  }

  async isVisible(): Promise<boolean> {
    return this.footer.isVisible();
  }

  async getFullText(): Promise<string | null> {
    return this.footer.textContent();
  }

  /**
   * TC-027: Footer'da yanlışlıkla bırakılmış "OK" text bug kontrolü
   */
  async hasOrphanOKText(): Promise<boolean> {
    const text = await this.getFullText();
    // "OK" tek başına bir kelime olarak var mı?
    return /\bOK\b/.test(text ?? '');
  }

  /**
   * Sahte telefon numarası hâlâ mevcut mu?
   * +90 (212) 123 45 67 — placeholder bırakılmış
   */
  async hasFakePhoneNumber(): Promise<boolean> {
    const text = await this.getFullText();
    return (text ?? '').includes('123 45 67');
  }

  async clickPrivacyLink(): Promise<void> {
    await this.privacyLink.click();
  }

  async clickTermsLink(): Promise<void> {
    await this.termsLink.click();
  }

  async assertQuickLinks(): Promise<void> {
    const links = ['Ana Sayfa', 'Hakkımızda', 'Blog', 'İletişim'];
    for (const name of links) {
      const link = this.page.locator('footer').getByRole('link', { name });
      await expect(link).toBeVisible();
    }
  }
}
