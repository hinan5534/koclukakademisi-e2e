# Koçluk Akademisi — E2E Test Suite

Playwright + TypeScript tabanlı uçtan uca test framework. Sprint 1'den Sprint 4'e kadar tüm özellikler test edilmiştir.

---

## Kurulum

\`\`\`bash
npm install
npx playwright install
\`\`\`

## Çalıştırma

\`\`\`bash
# Smoke suite (~37sn)
npm run test:smoke

# Regression suite (~2.1dk)
npm run test:regression

# Sadece homepage
npm run test:homepage

# Headed (browser açık)
npm run test:headed

# Debug modu
npm run test:debug

# HTML raporu
npm run report
\`\`\`

---

## Auth (Dashboard Testleri İçin Zorunlu)

Dashboard testleri auth.json session dosyasına ihtiyaç duyar:

\`\`\`bash
npx ts-node setup-auth.ts
\`\`\`

Browser açılır, elle giriş yap, terminalde Enter bas, auth.json kaydedilir.

auth.json .gitignore'a eklenmiştir — repo'ya commit edilmez.
Session süresi dolduğunda tekrar oluşturulması gerekir.

---

## Ortam Değişkenleri

\`\`\`bash
cp .env.example .env
\`\`\`

| Değişken | Açıklama | Default |
|----------|----------|---------|
| BASE_URL | Test edilecek URL | https://koclukakademisi.com |
| TEST_USER_EMAIL | Login test kullanıcısı | hasan@gmail.com |
| TEST_USER_PASSWORD | Login test şifresi | — |

---

## Proje Yapısı

\`\`\`
pages/
  BasePage.ts              # Abstract base class
  HomePage.ts              # Ana sayfa POM
  LoginPage.ts             # Login sayfası POM
  DashboardPage.ts         # Dashboard POM
  components/
    Header.ts
    Footer.ts
tests/
  homepage/
    homepage.smoke.spec.ts        Sprint 1
    homepage.regression.spec.ts   Sprint 1
    homepage.responsive.spec.ts   Sprint 1
  navigation/
    navigation.spec.ts            Sprint 1
  auth/
    login.spec.ts                 Sprint 2
  dashboard/
    dashboard.smoke.spec.ts       Sprint 3 & 4
    dashboard.regression.spec.ts  Sprint 3 & 4
fixtures/
  base.fixture.ts
utils/
  constants.ts
  helpers.ts
config/
  environments.ts
setup-auth.ts
.github/
  workflows/
    playwright.yml
\`\`\`

---

## Test Sonuçları (Son Çalışma)

| Suite | Passed | Failed | Skipped | Süre |
|-------|--------|--------|---------|------|
| Smoke | 54 / 54 | 0 | 0 | ~37sn |
| Regression | 198 / 198 | 0 | 3 | ~2.1dk |

3 skipped: Login testleri — TEST_USER_EMAIL tanımlı değilse CI'da skip edilir.

---

## Sprint Planı

| Sprint | Kapsam | Test Sayısı | Durum |
|--------|--------|-------------|-------|
| Sprint 1 | Homepage, Navigation, Responsive | 54 | Tamamlandı |
| Sprint 2 | Login, Auth flow | 14 | Tamamlandı |
| Sprint 3 | Dashboard session, Auth guard | 17 | Tamamlandı |
| Sprint 4 | Haftalık Plan, Günlük Görevler, Profil, Takvim, Not Defteri, Arkadaşlar, Deneme Analizi | 33 | Tamamlandı |

---

## Confirmed Bug Listesi

| ID | Severity | Sayfa | Bug | Durum |
|----|----------|-------|-----|-------|
| BUG-001 | Minor | Footer | Orphan OK text görünüyor | Open |
| BUG-002 | Major | Footer | Sahte telefon numarası +90 212 123 45 67 | Open |
| BUG-003 | Minor | Homepage | Blog section görünür ama içerik yok | Open |
| BUG-004 | Minor | Homepage | Tablet 768px horizontal scroll | Open |
| BUG-005 | Minor | Homepage | Mobilde Giriş Yap hamburger menüde gizli | Open |
| BUG-006 | Major | Login | Back butonu session korumuyor | Open |
| BUG-007 | Major | Login | Rate limiting — çok fazla denemede 15dk kilit | Open |
| BUG-008 | Major | Deneme Analizi | ChatGPT servisi yapılandırılmamış | Open |
| BUG-009 | Minor | İstatistikler | Haftalık Plan Oluştur butonu redirect etmiyor | Open |

---

## CI/CD

GitHub Actions pipeline .github/workflows/playwright.yml içinde tanımlı.

Tetikleyiciler:
- Her push ve PR'da smoke suite (Chromium)
- Smoke geçince regression paralel olarak Chromium, Firefox, WebKit
- Her gün 06:00 UTC production health check

Rate Limiting Notu:
Login testleri çok hızlı çalışınca site 15 dakika IP bazlı kilit uygular.
CI'da TEST_USER_EMAIL secret tanımlı değilse login testleri otomatik skip edilir.

GitHub Secrets:
- TEST_USER_EMAIL
- TEST_USER_PASSWORD

---

## Yeni Test Eklemek

1. İlgili pages/ dosyasına POM metodu ekle
2. tests/ altında uygun spec dosyasına test yaz
3. @smoke veya @regression tag'i ekle
4. npm run test:smoke veya npm run test:regression ile doğrula
5. Commit ve push — CI otomatik çalışır
