# Koçluk Akademisi — E2E Test Suite

Playwright + TypeScript tabanlı end-to-end test altyapısı. Page Object Model mimarisi, paralel test execution ve GitHub Actions CI/CD pipeline ile production-grade bir QA sistemi.

---

## Gereksinimler

- Node.js 20+
- npm 10+

## Kurulum

```bash
git clone https://github.com/hinan5534/koclukakademisi-e2e
cd koclukakademisi-e2e
npm install
npx playwright install
cp .env.example .env
```

## Auth Session Oluşturma

Dashboard testleri Playwright storage state kullanır. İlk çalıştırmadan önce session oluştur:

```bash
npx ts-node setup-auth.ts
```

Script headful browser açar. Giriş yaptıktan sonra terminalde Enter'a bas. `auth.json` oluşur ve dashboard testleri bu dosyayı kullanır. Dosya `.gitignore`'dadır, commit edilmez. Session süresi dolduğunda tekrar çalıştır.

---

## Testleri Çalıştırma

```bash
# Kritik path kontrolü — CI'da her commit'te çalışır
npm run test:smoke

# Tüm test suite — merge öncesi çalıştır
npm run test:regression

# Belirli dosya
npx playwright test tests/dashboard/

# Belirli browser
npx playwright test --project=chromium

# Debug modu
npm run test:debug

# Headed (browser görünür)
npm run test:headed

# HTML raporu
npm run report
```

---

## Mimari

```
pages/                  POM katmanı
  BasePage.ts           Tüm page object'lerin base class'ı
  HomePage.ts           Ana sayfa
  LoginPage.ts          Login sayfası
  DashboardPage.ts      Dashboard sayfası
  components/
    Header.ts           Header component
    Footer.ts           Footer component

tests/                  Test dosyaları
  homepage/             Smoke + Regression + Responsive
  navigation/           Nav link testleri
  auth/                 Login, session, rate limit
  dashboard/            Authenticated user flow testleri

utils/
  constants.ts          Route'lar, viewport'lar, sabit metinler
  helpers.ts            assertNoHorizontalScroll, captureConsoleErrors vb.

config/
  environments.ts       Production / Staging / Local config

setup-auth.ts           Auth.json oluşturan script
playwright.config.ts    Paralel execution, browser matrix, reporter config
```

### Page Object Modeli

```typescript
// Örnek kullanım
const homePage = new HomePage(page);
await homePage.open();
await homePage.header.clickLogin();
await homePage.assertFeatureCardLinks();
```

### Test Anatomy

```typescript
test.describe('Dashboard @regression', () => {
  test.use({ storageState: 'auth.json' });

  test('TC-D002: Haftalık Plan yükleniyor', async ({ page }) => {
    await page.goto(ROUTES.WEEKLY_PLAN);
    await expect(page.getByRole('heading', { name: 'Haftalık Plan' })).toBeVisible();
    await expect(page.getByText('Merhaba Hasan Hoca')).toBeVisible();
  });
});
```

---

## Test Coverage

| Katman | Kapsam | Test Sayısı |
|--------|--------|:-----------:|
| Smoke | Critical path, auth guard, mobile layout | 54 |
| Regression | Tüm sayfalar, nav, footer, session, feature cards | 144 |
| Dashboard | Haftalık Plan, Günlük Görevler, İstatistikler, Profil, Takvim, Not Defteri, Arkadaşlar, Deneme Analizi | 54 |
| **Toplam** | | **198** |

**Son çalışma:** Smoke 54/54 ✅ · Regression 198/198 ✅ · Süre ~2dk

---

## Ortam Değişkenleri

| Değişken | Açıklama | Default |
|----------|----------|---------|
| `BASE_URL` | Test URL'i | `https://koclukakademisi.com` |
| `TEST_USER_EMAIL` | Login kullanıcısı | `hasan@gmail.com` |
| `TEST_USER_PASSWORD` | Login şifresi | — |
| `TEST_ENV` | `production` / `staging` / `local` | `production` |

---

## CI/CD Pipeline

`.github/workflows/playwright.yml` üç aşamalıdır:

**1. Smoke** — Her push ve PR'da Chromium'da çalışır. Fail ederse regression başlamaz.

**2. Regression** — Smoke geçince Chromium, Firefox ve WebKit'te paralel çalışır. Her browser bağımsız job'dur.

**3. Auth setup** — Regression job'larından önce `tests/auth/setup.spec.ts` çalışır, `auth.json` oluşturur, dashboard testleri bu dosyayı kullanır.

**Zamanlanmış çalışma:** Her gün 06:00 UTC'de production health check.

```
GitHub Secrets → Settings → Actions:
  TEST_USER_EMAIL
  TEST_USER_PASSWORD
```

---

## Bilinen Buglar

| ID | Severity | Sayfa | Açıklama |
|----|:--------:|-------|----------|
| BUG-001 | Minor | Footer | Orphan "OK" text |
| BUG-002 | Major | Footer | Placeholder tel: +90 212 123 45 67 |
| BUG-003 | Minor | Homepage | Blog section unauthenticated'da boş |
| BUG-004 | Minor | Responsive | Tablet 768px horizontal scroll |
| BUG-005 | Minor | Mobile | Giriş Yap hamburger menüde gizli |
| BUG-006 | Major | Login | Back butonu session kırmıyor |
| BUG-007 | Major | Login | Rate limiting — 15dk IP kilidi |
| BUG-008 | Major | Deneme Analizi | ChatGPT servisi yapılandırılmamış |
| BUG-009 | Minor | İstatistikler | Haftalık Plan butonu redirect etmiyor |

Detaylı reproduce adımları, teknik analiz ve çözüm önerileri için `BUG_REPORT.md` dosyasına bak.

---

## Yeni Test Yazma

1. Selector için önce `npx playwright open --load-storage=auth.json <URL>` ile sayfayı incele
2. `pages/` altında POM metodunu ekle veya güncelle
3. `tests/` altında spec dosyasına `@smoke` veya `@regression` tag'i ile test yaz
4. `npm run test:smoke` veya `npm run test:regression` ile lokal doğrula
5. Commit & push — CI otomatik tetiklenir
