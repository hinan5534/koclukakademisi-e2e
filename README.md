# Koçluk Akademisi — E2E Test Suite

Playwright + TypeScript tabanlı uçtan uca test framework'ü.

## Kurulum

```bash
npm install
npx playwright install
```

## Çalıştırma

```bash
# Tüm testler
npm test

# Sadece smoke testler
npm run test:smoke

# Sadece regression testler
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
| `TEST_USER_EMAIL` | Sprint 2 login testleri için |
| `TEST_USER_PASSWORD` | Sprint 2 login testleri için |

## Proje Yapısı

```
├── pages/              # Page Object Model
│   ├── BasePage.ts     # Abstract base class
│   ├── HomePage.ts
│   ├── LoginPage.ts    # Sprint 2
│   └── components/
│       ├── Header.ts
│       └── Footer.ts
├── tests/
│   ├── homepage/       # Sprint 1 — aktif
│   │   ├── homepage.smoke.spec.ts
│   │   ├── homepage.regression.spec.ts
│   │   └── homepage.responsive.spec.ts
│   ├── navigation/
│   │   └── navigation.spec.ts
│   └── auth/           # Sprint 2 — credentials bekleniyor
│       └── login.spec.ts
├── fixtures/
│   └── base.fixture.ts
├── utils/
│   ├── constants.ts    # Route'lar, viewport'lar, text'ler
│   └── helpers.ts      # Yardımcı fonksiyonlar
└── config/
    └── environments.ts
```

## Known Bugs (Sprint 1 Bulgular)

| ID | Bug | Severity |
|----|-----|----------|
| TC-023 | Blog section görünür ama içerik yok | Major |
| TC-027 | Footer'da orphan "OK" text | Critical |
| TC-028b | Sahte telefon numarası (+90 212 123 45 67) | Major |

## CI/CD

GitHub Actions otomatik çalışır:
- Her `push` ve `PR`'da smoke suite
- Smoke geçince regression (paralel, 3 browser)
- Her gün 06:00 UTC'de production health check

Secrets tanımlanması gereken değerler:
- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`

## Sprint Planı

| Sprint | Kapsam |
|--------|--------|
| ✅ Sprint 1 | Homepage, Navigation, Responsive |
| 🔜 Sprint 2 | Login, Authenticated user flows |
| 🔜 Sprint 3 | Haftalık plan, Dashboard, Profile |
