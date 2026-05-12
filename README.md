# Koçluk Akademisi — E2E Test Suite

Playwright + TypeScript tabanlı uçtan uca test framework.

## Kurulum

\`\`\`bash
npm install
npx playwright install
\`\`\`

## Çalıştırma

\`\`\`bash
npm run test:smoke
npm run test:regression
npm run test:homepage
npm run test:headed
npm run test:debug
npm run report
\`\`\`

## Ortam Değişkenleri

\`\`\`bash
cp .env.example .env
\`\`\`

| Değişken | Açıklama |
|----------|----------|
| BASE_URL | Test edilecek URL (default: production) |
| TEST_USER_EMAIL | Login testleri için (default: hasan@gmail.com) |
| TEST_USER_PASSWORD | Login testleri için |

Rate Limiting: Site çok fazla login denemesinde 15 dakika kilitliyor. CI/CD'de login testleri için auth.json storage state kullanımı önerilir (Sprint 3).

## Proje Yapısı

\`\`\`
pages/
  BasePage.ts
  HomePage.ts
  LoginPage.ts
  components/
    Header.ts
    Footer.ts
tests/
  homepage/
    homepage.smoke.spec.ts       Sprint 1
    homepage.regression.spec.ts  Sprint 1
    homepage.responsive.spec.ts  Sprint 1
  navigation/
    navigation.spec.ts           Sprint 1
  auth/
    login.spec.ts                Sprint 2
fixtures/
  base.fixture.ts
utils/
  constants.ts
  helpers.ts
config/
  environments.ts
\`\`\`

## Test Sonuçları

| Suite      | Passed  | Failed | Skipped |
|------------|---------|--------|---------|
| Smoke      | 54 / 54 | 0      | 0       |
| Regression | 123/123 | 0      | 3       |

## Confirmed Bug Listesi

| ID      | Severity | Bug                                              | Durum |
|---------|----------|--------------------------------------------------|-------|
| BUG-001 | Minor    | Footer orphan OK text                            | Open  |
| BUG-002 | Major    | Sahte telefon numarasi +90 212 123 45 67         | Open  |
| BUG-003 | Minor    | Blog section gorunur ama icerik yok              | Open  |
| BUG-004 | Minor    | Tablet 768px horizontal scroll                   | Open  |
| BUG-005 | Minor    | Mobilde Giris Yap hamburger menude gizli         | Open  |
| BUG-006 | Major    | Back butonu session korumuyor                    | Open  |
| BUG-007 | Major    | Rate limiting - cok fazla login denemesi 15dk    | Open  |

## Sprint Plani

| Sprint   | Kapsam                                      | Durum        |
|----------|---------------------------------------------|--------------|
| Sprint 1 | Homepage, Navigation, Responsive            | Tamamlandi   |
| Sprint 2 | Login, Auth flow                            | Tamamlandi   |
| Sprint 3 | Storage state auth, Dashboard, Profil       | Bekliyor     |

## CI/CD

GitHub Actions pipeline .github/workflows/playwright.yml icinde tanimli.

- Her push ve PR'da smoke suite calisir
- Smoke gecince regression paralel olarak 3 browser'da calisir
- Her gun 06:00 UTC production health check

CI/CD'de login testleri rate limiting sebebiyle basarisiz olabilir. Sprint 3'te auth.json storage state entegrasyonu yapilacak.

GitHub Secrets:
- TEST_USER_EMAIL
- TEST_USER_PASSWORD
