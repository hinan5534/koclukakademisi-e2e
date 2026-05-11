import { Page, Locator, expect } from '@playwright/test';

export class Header {
  readonly page: Page;

  // NOTE: data-testid attribute mevcut değil — geliştirici takımına eklenmesi talep edilmeli
  // Şu an role + name tabanlı selector kullanılıyor (kırılgan olabilir)
  readonly logo: Locator;
  readonly navHome: Locator;
  readonly navAbout: Locator;
  readonly navBlog: Locator;
  readonly navContact: Locator;
  readonly btnLogin: Locator;
  readonly btnRegister: Locator;
  readonly btnCorporateLogin: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByRole('link', { name: /KA Koçluk Akademisi/i }).first();
    this.navHome = page.getByRole('link', { name: 'Ana Sayfa' }).first();
    this.navAbout = page.getByRole('link', { name: 'Hakkımızda' }).first();
    this.navBlog = page.getByRole('link', { name: 'Blog' }).first();
    this.navContact = page.getByRole('link', { name: 'İletişim' }).first();
    this.btnLogin = page.getByRole('link', { name: 'Giriş Yap' });
    this.btnRegister = page.getByRole('link', { name: 'Kayıt Ol' });
    this.btnCorporateLogin = page.getByRole('link', { name: 'Kurumsal Giriş' });
  }

  async isVisible(): Promise<boolean> {
    return this.logo.isVisible();
  }

  async clickLogo(): Promise<void> {
    await this.logo.click();
  }

  async clickLogin(): Promise<void> {
    await this.btnLogin.click();
  }

  async clickRegister(): Promise<void> {
    await this.btnRegister.click();
  }

  async clickCorporateLogin(): Promise<void> {
    await this.btnCorporateLogin.click();
  }

  async clickNavLink(name: 'home' | 'about' | 'blog' | 'contact'): Promise<void> {
    const links = {
      home: this.navHome,
      about: this.navAbout,
      blog: this.navBlog,
      contact: this.navContact,
    };
    await links[name].click();
  }

  async assertAllNavLinksVisible(): Promise<void> {
    await expect(this.navAbout).toBeVisible();
    await expect(this.navBlog).toBeVisible();
    await expect(this.navContact).toBeVisible();
    await expect(this.btnLogin).toBeVisible();
    await expect(this.btnRegister).toBeVisible();
    await expect(this.btnCorporateLogin).toBeVisible();
  }
}
