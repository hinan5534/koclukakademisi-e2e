# Koçluk Akademisi — E2E Test Suite

Playwright + TypeScript tabanlı uçtan uca test framework'ü.

## Kurulum

```bash
npm install
npx playwright install
```

## Çalıştırma

```bash
# Smoke suite (hızlı kontrol — ~37sn)
npm run test:smoke

# Regression suite (tam test — ~48sn)
npm run test:regression

# Sadece homepage testleri
npm run test:homepage

# Headed (browser açık)
npm run test:headed

# Debug modu
npm run test:debug

# HTML raporu görüntüle
npm run report
```

## Ortam Değişkenleri

`.env.example` dosyasını kopyala:

```bash
cp .env.example .env
```

| Değişken | Açıklama |
|----------|----------|
| `BASE_URL` | Test edilecek URL (default: production) |
| `TEST_USER_EMAIL` | Login testleri için (default: hasan@gmail.com) |
| `TEST_USER_PASSWORD` | Login testleri için |

> ⚠️ **Rate Limiting**: Site çok fazla login denemesinde 15 dakika kilitliyor.
> CI/CD'de login testleri için `auth.json` storage state kullanımı önerilir (Sprint 3).

## Proje Yapısı

```
├── pages/
│   ├── BasePage.ts          # Abstract base class
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   └── components/
│       ├── Header.ts
│       └── Footer.ts
├── tests/
│   ├── homepage/
│   │   ├── homepage.smoke.spec.ts       ✅ Sprint 1
│   │   ├── homepage.regression.spec.ts  ✅ Sprint 1
│   │   └── homepage.responsive.spec.ts  ✅ Sprint 1
│   ├── navigation/
│   │   └── navigation.spec.ts           ✅ Sprint 1
│   └── auth/
│       └── login.spec.ts                ✅ Sprint 2
├── fixtures/
│   └── base.fixture.ts
├── utils/
│   ├── constants.ts
│   └── helpers.ts
└── config/
    └── environments.ts
```

## Test Sonuçları (Son Çalışma)

| Suite | Passed | Failed | Skipped |
|-------|--------|--------|---------|
| Smoke | 54 / 54 | 0 | 0 |
| Regression | 123 / 123 | 0 | 3 |

## Confirmed Bug Listesi

| ID | Severity | Bug | Durum |
|----|----------|-----|-------|
| BUG-001 | 🟡 Minor | Footer'da orphan "OK" text | Open |
| BUG-002 | 🟠 Major | Sahte telefon numarası (+90 212 123 45 67) footer'da | Open |
| BUG-003 | 🟡 Minor | Blog section görünür ama içerik yok | Open |
| BUG-004 | 🟡 Minor | Tablet 768px horizontal scroll (layout bozuluyor) | Open |
| BUG-005 | 🟡 Minor | Mobilde "Giriş Yap" butonu hamburger menüde gizli | Open |
| BUG-006 | 🟠 Major | Back butonu session korumuyor — login sonrası back'e basınca /giris'e dönüyor | Open |
| BUG-007 | 🟠 Major | Rate limiting — çok fazla login denemesinde 15dk kilit | Open |

## Sprint Planı

| Sprint | Kapsam | Durum |
|--------|--------|-------|
| Sprint 1 | Homepage, Navigation, Responsive | ✅ Tamamlandı |
| Sprint 2 | Login, Auth flow | ✅ Tamamlandı |
| Sprint 3 | Storage state auth, Dashboard, Haftalık Plan, Profil | 🔜 Bekliyor |

## CI/CD

GitHub Actions pipeline `.github/workflows/playwright.yml` içinde tanımlı.

- Her `push` ve `PR`'da smoke suite çalışır
- Smoke geçince regression paralel olarak 3 browser'da çalışır
- Her gün 06:00 UTC production health check

> ⚠️ CI/CD'de login testleri rate limiting sebebiyle başarısız olabilir.
> Sprint 3'te `auth.json` storage state entegrasyonu yapılacak.

GitHub Secrets:
- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`
