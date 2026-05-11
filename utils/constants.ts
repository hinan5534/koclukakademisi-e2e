export const BASE_URL = process.env.BASE_URL || 'https://koclukakademisi.com';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/giris',
  REGISTER: '/kayit',
  CORPORATE_LOGIN: '/kurumsal-giris',
  WEEKLY_PLAN: '/haftalik-plan',
  DAILY_TASKS: '/gunluk-gorevler',
  STATISTICS: '/istatistikler',
  EXAM_COUNTDOWN: '/sinav-geri-sayim',
  EXAM_ANALYSIS: '/deneme-analizi',
  PROFILE: '/profil',
  CALENDAR: '/takvim',
  NOTES: '/not-defteri',
  FRIENDS: '/arkadaslarim',
  ABOUT: '/hakkimizda',
  BLOG: '/blog',
  CONTACT: '/iletisim',
  PRIVACY: '/gizlilik-politikasi',
  TERMS: '/kullanim-kosullari',
} as const;

export const TIMEOUTS = {
  SHORT: 5_000,
  MEDIUM: 10_000,
  LONG: 30_000,
} as const;

export const VIEWPORTS = {
  MOBILE_S: { width: 375, height: 812 },
  MOBILE_L: { width: 414, height: 896 },
  TABLET: { width: 768, height: 1024 },
  DESKTOP_MD: { width: 1280, height: 800 },
  DESKTOP_LG: { width: 1440, height: 900 },
} as const;

export const EXPECTED_TEXTS = {
  PAGE_TITLE: 'Haftalık Plan ile Öğrenci Koçluğu | Koçluk Akademisi',
  HERO_HEADING: 'Haftalık Plan ile',
  HERO_SUBTEXT: 'Yapay zeka destekli haftalık plan sistemi',
  FEATURES_HEADING: 'Neden Koçluk Akademisi?',
  BLOG_HEADING: 'Son Blog Yazılarımız',
  FOOTER_COPYRIGHT: '2026 Koçluk Akademisi',
  FOOTER_EMAIL: 'info.koclukakademisi@gmail.com',
} as const;

export const FEATURE_CARDS = [
  { label: 'Haftalık Plan', route: ROUTES.WEEKLY_PLAN },
  { label: 'Günlük Plan Takibi', route: ROUTES.DAILY_TASKS },
  { label: 'İlerleme Analizi', route: ROUTES.STATISTICS },
  { label: 'Sınav Geri Sayım', route: ROUTES.EXAM_COUNTDOWN },
  { label: 'Deneme Analizi', route: ROUTES.EXAM_ANALYSIS },
  { label: 'Kişisel Bilgilerim', route: ROUTES.PROFILE },
  { label: 'Kişisel Takvim', route: ROUTES.CALENDAR },
  { label: 'Not Defteri', route: ROUTES.NOTES },
  { label: 'Arkadaşlarım', route: ROUTES.FRIENDS },
] as const;

export const PROTECTED_ROUTES = [
  ROUTES.WEEKLY_PLAN,
  ROUTES.DAILY_TASKS,
  ROUTES.STATISTICS,
  ROUTES.EXAM_COUNTDOWN,
  ROUTES.EXAM_ANALYSIS,
  ROUTES.PROFILE,
  ROUTES.CALENDAR,
  ROUTES.NOTES,
  ROUTES.FRIENDS,
] as const;
