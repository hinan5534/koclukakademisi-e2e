import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FEATURE_CARDS, ROUTES } from '../utils/constants';

export class HomePage extends BasePage {
  readonly header: Header;
  readonly footer: Footer;

  readonly heroHeading: Locator;
  readonly heroSubtext: Locator;
  readonly heroCTA: Locator;
  readonly featuresSectionHeading: Locator;
  readonly featureCards: Locator;
  readonly blogSectionHeading: Locator;
  readonly footerCTA: Locator;
  readonly trustBadges: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.footer = new Footer(page);

    this.heroHeading = page.getByRole('heading', { level: 1 });
    this.heroSubtext = page.getByText(/Yapay zeka destekli haftalık plan sistemi/i);
    // İki CTA var (hero + footer), first() hero CTA'sı
    this.heroCTA = page
      .getByRole('link', { name: /Haftalık Planınızı Oluşturun/i })
      .first();
    this.footerCTA = page
      .getByRole('link', { name: /Haftalık Planınızı Oluşturun/i })
      .last();
    this.featuresSectionHeading = page.getByText('Neden Koçluk Akademisi?');
    this.featureCards = page.locator('a').filter({
      hasText:
        /Haftalık Plan|Günlük Plan|İlerleme Analizi|Sınav Geri Sayım|Deneme Analizi|Kişisel Bilgilerim|Kişisel Takvim|Not Defteri|Arkadaşlarım/,
    });
    this.blogSectionHeading = page.getByText('Son Blog Yazılarımız');
    this.trustBadges = page.getByText(/Güvenli ve Gizli|7\/24 Destek|Ücretsiz Başlangıç/i);
  }

  async open(): Promise<void> {
    await this.navigate(ROUTES.HOME);
  }

  async getHeroHeadingText(): Promise<string | null> {
    return this.heroHeading.textContent();
  }

  async clickHeroCTA(): Promise<void> {
    await this.heroCTA.click();
  }

  async clickFooterCTA(): Promise<void> {
    await this.scrollToBottom();
    await this.footerCTA.click();
  }

  async getFeatureCardCount(): Promise<number> {
    return this.featureCards.count();
  }

  async isBlogSectionVisible(): Promise<boolean> {
    return this.blogSectionHeading.isVisible();
  }

  async getBlogCardCount(): Promise<number> {
    // Assumption: Blog kartları article, .blog-card veya [class*="blog"] ile bulunabilir
    const cards = this.page.locator('article, [class*="blog-card"], [class*="blog_card"]');
    return cards.count();
  }

  /**
   * Her feature card'ın beklenen href'e sahip olup olmadığını kontrol eder.
   */
  async assertFeatureCardLinks(): Promise<void> {
    for (const card of FEATURE_CARDS) {
      const link = this.page.getByRole('link', { name: new RegExp(card.label, 'i') }).first();
      const href = await link.getAttribute('href');
      expect(href, `Feature card "${card.label}" wrong href`).toContain(card.route);
    }
  }

  async assertMetaTags(): Promise<void> {
    const description = await this.getMetaContent('description');
    expect(description).not.toBeNull();
    expect(description!.length).toBeGreaterThan(50);

    const ogTitle = await this.getMetaContent('og:title');
    expect(ogTitle).not.toBeNull();

    const ogImage = await this.getMetaContent('og:image');
    expect(ogImage).not.toBeNull();
  }
}
