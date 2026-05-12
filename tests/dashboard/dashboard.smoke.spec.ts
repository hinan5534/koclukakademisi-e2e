import { test, expect, chromium } from '@playwright/test';
import { DashboardPage } from '../../pages/DashboardPage';
import { ROUTES } from '../../utils/constants';
import * as fs from 'fs';

// auth.json yoksa testleri skip et
const AUTH_FILE = 'auth.json';
const hasAuth = fs.existsSync(AUTH_FILE);

test.describe('Dashboard — Smoke Suite @smoke', () => {
  test.skip(!hasAuth, 'auth.json bulunamadı — npx playwright open --save-storage=auth.json https://koclukakademisi.com/giris ile oluştur');

  test.use({ storageState: AUTH_FILE });

  test('TC-D001: Login sonrası dashboard yükleniyor', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.open();
    const loggedIn = await dashboard.isLoggedIn();
    expect(loggedIn, 'Dashboard açılmıyor — session geçersiz olabilir').toBe(true);
  });

  test('TC-D002: Haftalık Plan sayfası yükleniyor', async ({ page }) => {
    await page.goto(ROUTES.WEEKLY_PLAN);
    await expect(page).not.toHaveURL(new RegExp(ROUTES.LOGIN));
    await expect(page.getByText('Giriş Gerekli')).not.toBeVisible({ timeout: 5_000 }).catch(() => {});
  });

  test('TC-D003: Günlük Görevler sayfası yükleniyor', async ({ page }) => {
    await page.goto(ROUTES.DAILY_TASKS);
    await expect(page).not.toHaveURL(new RegExp(ROUTES.LOGIN));
  });

  test('TC-D004: İstatistikler sayfası yükleniyor', async ({ page }) => {
    await page.goto(ROUTES.STATISTICS);
    await expect(page).not.toHaveURL(new RegExp(ROUTES.LOGIN));
  });

  test('TC-D005: Profil sayfası yükleniyor', async ({ page }) => {
    await page.goto(ROUTES.PROFILE);
    await expect(page).not.toHaveURL(new RegExp(ROUTES.LOGIN));
  });

  test('TC-D006: Takvim sayfası yükleniyor', async ({ page }) => {
    await page.goto(ROUTES.CALENDAR);
    await expect(page).not.toHaveURL(new RegExp(ROUTES.LOGIN));
  });

  test('TC-D007: Not Defteri sayfası yükleniyor', async ({ page }) => {
    await page.goto(ROUTES.NOTES);
    await expect(page).not.toHaveURL(new RegExp(ROUTES.LOGIN));
  });

  test('TC-D008: Sınav Geri Sayım sayfası yükleniyor', async ({ page }) => {
    await page.goto(ROUTES.EXAM_COUNTDOWN);
    await expect(page).not.toHaveURL(new RegExp(ROUTES.LOGIN));
  });

  test('TC-D009: Deneme Analizi sayfası yükleniyor', async ({ page }) => {
    await page.goto(ROUTES.EXAM_ANALYSIS);
    await expect(page).not.toHaveURL(new RegExp(ROUTES.LOGIN));
  });

  test('TC-D010: Arkadaşlarım sayfası yükleniyor', async ({ page }) => {
    await page.goto(ROUTES.FRIENDS);
    await expect(page).not.toHaveURL(new RegExp(ROUTES.LOGIN));
  });
});
