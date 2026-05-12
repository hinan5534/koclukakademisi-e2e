import { test, expect } from '@playwright/test';
import { ROUTES } from '../../utils/constants';
import * as fs from 'fs';

const AUTH_FILE = 'auth.json';
const hasAuth = fs.existsSync(AUTH_FILE);

test.describe('Dashboard — Regression Suite @regression', () => {
  test.skip(!hasAuth, 'auth.json bulunamadı');
  test.use({ storageState: AUTH_FILE });

  test.describe('Authenticated Homepage', () => {
    test('TC-D101: Login/Kayıt butonları görünmüyor', async ({ page }) => {
      await page.goto(ROUTES.HOME);
      await expect(page.getByRole('link', { name: /^giriş yap$/i })).not.toBeVisible();
      await expect(page.getByRole('link', { name: /^kayıt ol$/i })).not.toBeVisible();
    });

    test('TC-D103: Feature card authenticated sayfaya gidiyor', async ({ page }) => {
      await page.goto(ROUTES.HOME);
      const card = page.getByRole('link', { name: /haftalık plan/i }).first();
      await card.click();
      await expect(page).toHaveURL(new RegExp(ROUTES.WEEKLY_PLAN));
      await expect(page.getByText('Giriş Gerekli')).not.toBeVisible();
    });
  });

  test.describe('Haftalık Plan', () => {
    test('TC-D104: Bu Hafta sekmesi görünür', async ({ page }) => {
      await page.goto(ROUTES.WEEKLY_PLAN);
      await expect(page.getByRole('button', { name: /bu hafta/i })).toBeVisible();
    });

    test('TC-D105: Gelecek Hafta sekmesi görünür', async ({ page }) => {
      await page.goto(ROUTES.WEEKLY_PLAN);
      await expect(page.getByRole('button', { name: /gelecek hafta/i })).toBeVisible();
    });

    test('TC-D106: Kullanım Kılavuzu butonu görünür', async ({ page }) => {
      await page.goto(ROUTES.WEEKLY_PLAN);
      await expect(page.getByRole('button', { name: /kullanım kılavuzu/i })).toBeVisible();
    });

    test('TC-D107: Bildirim badge görünür', async ({ page }) => {
      await page.goto(ROUTES.WEEKLY_PLAN);
      await expect(page.getByText('2')).toBeVisible();
    });

    test('TC-D108: Plan oluşturulmamış mesajı görünür', async ({ page }) => {
      await page.goto(ROUTES.WEEKLY_PLAN);
      await expect(page.getByText('Bu Hafta İçin Plan Oluşturulmamış')).toBeVisible();
    });
  });

  test.describe('Günlük Görevler', () => {
    test('TC-D110: Bugünün tarihi görünür', async ({ page }) => {
      await page.goto(ROUTES.DAILY_TASKS);
      await expect(page.getByText('12 Mayıs')).toBeVisible();
    });

    test('TC-D112: Günlük özet alanı görünür', async ({ page }) => {
      await page.goto(ROUTES.DAILY_TASKS);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await expect(page.getByText('Toplam Görev')).toBeVisible();
      await expect(page.getByText('Tamamlanan')).toBeVisible();
    });
  });

  test.describe('İstatistikler', () => {
    test('TC-D114: Haftalık Plan Oluştur butonu çalışıyor', async ({ page }) => {
      await page.goto(ROUTES.STATISTICS);
      await page.getByRole('button', { name: /haftalık plan oluştur/i }).click();
      await expect(page).toHaveURL(new RegExp(ROUTES.WEEKLY_PLAN));
    });

    test('TC-D115: Günlük Görevler butonu çalışıyor', async ({ page }) => {
      await page.goto(ROUTES.STATISTICS);
      await page.getByRole('button', { name: /günlük görevler/i }).click();
      await expect(page).toHaveURL(new RegExp(ROUTES.DAILY_TASKS));
    });
  });

  test.describe('Sınav Geri Sayım', () => {
    test('TC-D117: Hemen Başlayın section görünür', async ({ page }) => {
      await page.goto(ROUTES.EXAM_COUNTDOWN);
      await expect(page.getByText('Hemen Başlayın!')).toBeVisible();
    });
  });

  test.describe('Deneme Analizi', () => {
    test('TC-D118: ChatGPT yapılandırılmamış uyarısı görünür', async ({ page }) => {
      await page.goto(ROUTES.EXAM_ANALYSIS);
      await expect(page.getByText('ChatGPT Servisi Yapılandırılmamış')).toBeVisible();
    });

    test('TC-D119: Haftalık limit bilgisi görünür', async ({ page }) => {
      await page.goto(ROUTES.EXAM_ANALYSIS);
      await expect(page.getByText(/haftada sadece 1 deneme/i)).toBeVisible();
    });

    test('TC-D120: Haftalık Plana Git butonu çalışıyor', async ({ page }) => {
      await page.goto(ROUTES.EXAM_ANALYSIS);
      await page.getByRole('button', { name: /haftalık plana git/i }).click();
      await expect(page).toHaveURL(new RegExp(ROUTES.WEEKLY_PLAN));
    });
  });

  test.describe('Profil', () => {
    test('TC-D121: Hesap Ayarları sekmesi var', async ({ page }) => {
      await page.goto(ROUTES.PROFILE);
      await expect(page.getByText('Hesap Ayarları')).toBeVisible();
    });

    test('TC-D122: Kullanıcı avatarı görünür', async ({ page }) => {
      await page.goto(ROUTES.PROFILE);
      await expect(page.getByText('HH')).toBeVisible();
    });

    test('TC-D123: Sınıf bilgisi görünür', async ({ page }) => {
      await page.goto(ROUTES.PROFILE);
      await expect(page.getByText('Sınıf: 9')).toBeVisible();
    });
  });

  test.describe('Takvim', () => {
    test('TC-D126: Bugünün tarihi görünür', async ({ page }) => {
      await page.goto(ROUTES.CALENDAR);
      await expect(page.getByText('Mayıs 2026')).toBeVisible();
    });
  });

  test.describe('Not Defteri', () => {
    test('TC-D127: Kategori filtreleri görünür', async ({ page }) => {
      await page.goto(ROUTES.NOTES);
      await expect(page.getByText('Ders Notları')).toBeVisible();
      await expect(page.getByText('Fikirler')).toBeVisible();
    });

    test('TC-D128: Arama kutusu mevcut', async ({ page }) => {
      await page.goto(ROUTES.NOTES);
      await expect(page.getByPlaceholder('Notlarda ara...')).toBeVisible();
    });
  });

  test.describe('Arkadaşlarım', () => {
    test('TC-D131: Arkadaş e-posta alanı mevcut', async ({ page }) => {
      await page.goto(ROUTES.FRIENDS);
      await expect(page.getByPlaceholder('Arkadaş e-posta')).toBeVisible();
    });

    test('TC-D132: Boş formda sayfa kalıyor', async ({ page }) => {
      await page.goto(ROUTES.FRIENDS);
      await page.getByRole('button', { name: /istek gönder/i }).click();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(new RegExp(ROUTES.FRIENDS));
    });
  });

  test.describe('Session', () => {
    test('TC-D134: Page refresh sonrası session korunuyor', async ({ page }) => {
      await page.goto(ROUTES.WEEKLY_PLAN);
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByText('Haftalık Plan')).toBeVisible();
    });

    test('TC-D135: Farklı sekme açılınca session korunuyor', async ({ page, context }) => {
      const newPage = await context.newPage();
      await newPage.goto(ROUTES.PROFILE);
      await expect(newPage.getByText('Hasan Hoca')).toBeVisible();
      await newPage.close();
    });
  });
});
