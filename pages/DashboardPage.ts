import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../utils/constants';

export class DashboardPage extends BasePage {
  readonly weeklyPlanLink: Locator;
  readonly dailyTasksLink: Locator;
  readonly statisticsLink: Locator;
  readonly examCountdownLink: Locator;
  readonly examAnalysisLink: Locator;
  readonly profileLink: Locator;
  readonly calendarLink: Locator;
  readonly notesLink: Locator;
  readonly friendsLink: Locator;
  readonly userGreeting: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);

    this.weeklyPlanLink = page.getByRole('link', { name: /haftalık plan/i }).first();
    this.dailyTasksLink = page.getByRole('link', { name: /günlük/i }).first();
    this.statisticsLink = page.getByRole('link', { name: /istatistik|ilerleme/i }).first();
    this.examCountdownLink = page.getByRole('link', { name: /sınav geri/i }).first();
    this.examAnalysisLink = page.getByRole('link', { name: /deneme/i }).first();
    this.profileLink = page.getByRole('link', { name: /profil|kişisel bilgi/i }).first();
    this.calendarLink = page.getByRole('link', { name: /takvim/i }).first();
    this.notesLink = page.getByRole('link', { name: /not defteri/i }).first();
    this.friendsLink = page.getByRole('link', { name: /arkadaş/i }).first();
    this.userGreeting = page.getByText(/hasan|merhaba|hoşgeldin/i).first();
    this.logoutButton = page.getByRole('button', { name: /çıkış|logout/i })
      .or(page.getByRole('link', { name: /çıkış|logout/i }));
  }

  async open(): Promise<void> {
    await this.navigate(ROUTES.WEEKLY_PLAN);
  }

  async isLoggedIn(): Promise<boolean> {
    const url = this.page.url();
    return !url.includes(ROUTES.LOGIN);
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
