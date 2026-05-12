# Koçluk Akademisi — Bug Raporu
**Tarih:** 13 Mayıs 2026  
**Test Ortamı:** https://koclukakademisi.com  
**Test Eden:** QA Automation Suite (Playwright + TypeScript)  
**Browsers:** Chromium, Firefox, WebKit  

---

## BUG-001 — Footer'da Orphan "OK" Text
**Severity:** 🟡 Minor  
**Sayfa:** Tüm sayfalar (Footer)  
**URL:** https://koclukakademisi.com → En alta scroll

### Reproduce Adımları
1. https://koclukakademisi.com adresini aç
2. Sayfanın en altına scroll et
3. Footer'ın sol alt köşesine bak

### Beklenen Davranış
Footer'da sadece logo, linkler ve iletişim bilgileri görünmeli.

### Gerçek Davranış
Footer'da "OK" yazısı görünüyor. Hiçbir context'e bağlı değil, kullanıcıyı konfüze ediyor.

### Teknik Detay
Footer DOM'unda `<span>OK</span>` veya benzeri bir element var. Muhtemelen cookie consent veya notification snippet'inin yarım kalmış hali.

### Test Kodu
```typescript
// tests/homepage/homepage.regression.spec.ts
test('TC-027: Footer orphan "OK" text bug kontrolü', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const footerText = await page.locator('footer').textContent();
  // "OK" text footer'da görünüyor — BUG
});
```

---

## BUG-002 — Footer'da Sahte Telefon Numarası
**Severity:** 🟠 Major  
**Sayfa:** Tüm sayfalar (Footer)  
**URL:** https://koclukakademisi.com → En alta scroll

### Reproduce Adımları
1. https://koclukakademisi.com adresini aç
2. Sayfanın en altına scroll et
3. İletişim bölümündeki telefon numarasına bak

### Beklenen Davranış
Gerçek bir destek telefon numarası veya telefon alanı tamamen kaldırılmış olmalı.

### Gerçek Davranış
Footer'da `+90 (212) 123 45 67` yazıyor. Bu açıkça bir placeholder/test numarasıdır. Production'da yayında olmamalı.

### Etki
- Kullanıcı güveni zedeleniyor
- Kullanıcılar bu numarayı arayıp ulaşamayınca şikâyet edebilir
- Yasal açıdan sahte iletişim bilgisi sorun yaratabilir

### Çözüm Önerisi
Gerçek telefon numarası yoksa bu alanı tamamen kaldır veya sadece email ile devam et.

---

## BUG-003 — Blog Section Görünür Ama İçerik Yok (Unauthenticated)
**Severity:** 🟡 Minor  
**Sayfa:** Ana Sayfa (unauthenticated)  
**URL:** https://koclukakademisi.com (giriş yapmadan)

### Reproduce Adımları
1. Gizli/Incognito sekme aç
2. https://koclukakademisi.com adresini aç
3. Sayfanın en altına scroll et
4. "Son Blog Yazılarımız" bölümüne bak

### Beklenen Davranış
Blog section ya içerik göstermeli ya da hiç render edilmemeli.

### Gerçek Davranış
"Son Blog Yazılarımız" başlığı görünüyor ama altında hiç blog kartı yok. Boş section kullanıcıya kötü bir UX sunuyor.

**Not:** Giriş yapıldığında blog içerikleri görünüyor — bu nedenle authenticated/unauthenticated state ayrımı yapılması gerekiyor.

### Çözüm Önerisi
```javascript
// Unauthenticated kullanıcıya blog gösterilmeyecekse:
{isAuthenticated && <BlogSection />}

// Ya da API'dan veri gelmezse section'ı gizle:
{blogPosts.length > 0 && <BlogSection posts={blogPosts} />}
```

---

## BUG-004 — Tablet 768px'de Horizontal Scroll (Layout Bozuluyor)
**Severity:** 🟡 Minor  
**Sayfa:** Tüm sayfalar  
**URL:** https://koclukakademisi.com (768px viewport)

### Reproduce Adımları
1. Chrome DevTools aç (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Viewport genişliğini 768px olarak ayarla
4. Sayfayı sağa kaydır

### Beklenen Davranış
768px viewport'ta layout düzgün görünmeli, horizontal scroll olmamalı.

### Gerçek Davranış
`document.body.scrollWidth > window.innerWidth` — yatay scroll bar beliriyor, içerik taşıyor.

### Teknik Detay
Muhtemelen `min-width` değeri olan bir element veya fixed width ile tanımlanmış bir container var.

### Çözüm Önerisi
```css
/* Sorunlu element'i bulmak için: */
* { outline: 1px solid red; }

/* Genel çözüm: */
* { box-sizing: border-box; }
.container { max-width: 100%; overflow-x: hidden; }
```

---

## BUG-005 — Mobilde "Giriş Yap" Butonu Hamburger Menüde Gizli
**Severity:** 🟡 Minor  
**Sayfa:** Ana Sayfa (Mobile)  
**URL:** https://koclukakademisi.com (375px viewport)

### Reproduce Adımları
1. Telefonda veya DevTools'da 375px viewport ile aç
2. Header'da "Giriş Yap" butonunu arama

### Beklenen Davranış
"Giriş Yap" butonu mobile'da da direkt görünmeli veya hamburger menü açıkça belirtilmeli.

### Gerçek Davranış
"Giriş Yap" butonu hamburger menü içinde gizleniyor. Kullanıcı hamburger menüyü açmadan giriş yapamıyor. Bu önemli bir CTA'nın gizlenmesi demek.

### Etki
Mobile kullanıcı dönüşüm oranını düşürür.

### Çözüm Önerisi
"Giriş Yap" butonunu mobile'da da header'da görünür tut, gerekirse hamburger menüdeki diğer linkleri gizle.

---

## BUG-006 — Login Sonrası Back Butonu Session Korumuyor
**Severity:** 🟠 Major  
**Sayfa:** Login → Dashboard  
**URL:** https://koclukakademisi.com/giris

### Reproduce Adımları
1. https://koclukakademisi.com/giris adresine git
2. Geçerli credentials ile giriş yap
3. Dashboard'a yönlendirilince tarayıcının **Geri** butonuna bas

### Beklenen Davranış
Geri butonuna basınca kullanıcı dashboard'da kalmalı veya ana sayfaya gitmeli. Login sayfasına dönmemeli.

### Gerçek Davranış
Geri butonuna basınca `/giris` sayfası tekrar açılıyor. Kullanıcı tekrar giriş yapabilir durumda görünüyor (ancak session hâlâ aktif).

### Teknik Detay
Login sonrası `history.replace()` yerine `history.push()` kullanılıyor olabilir. Ya da login sayfası session kontrolü yapmıyor.

### Çözüm Önerisi
```javascript
// Login sayfasında session kontrolü:
useEffect(() => {
  if (isAuthenticated) {
    router.replace('/haftalik-plan'); // push yerine replace kullan
  }
}, [isAuthenticated]);
```

---

## BUG-007 — Login Rate Limiting (15 Dakika IP Kilidi)
**Severity:** 🟠 Major  
**Sayfa:** Login  
**URL:** https://koclukakademisi.com/giris

### Reproduce Adımları
1. https://koclukakademisi.com/giris adresine git
2. Yanlış şifre ile 5-10 kez giriş dene
3. Sonraki denemede hata mesajını gözlemle

### Beklenen Davranış
Rate limiting makul — örneğin 5 başarısız denemeden sonra 5 dakika bekleme. Ya da CAPTCHA göster.

### Gerçek Davranış
"Çok fazla deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyin." mesajı çıkıyor ve **doğru şifre ile de giriş yapılamıyor**.

### Etki
- Gerçek kullanıcılar yanlışlıkla kilitlenirse 15 dakika erişemez
- Test/QA süreçlerini engelliyor
- Otomatik test pipeline'larında sorun çıkarıyor

### Çözüm Önerisi
- Test ortamı için rate limiting devre dışı bırak
- Production'da CAPTCHA ile destekle
- "Şifremi Unuttum" flow'unu öne çıkar

---

## BUG-008 — Deneme Analizi: ChatGPT Servisi Yapılandırılmamış
**Severity:** 🟠 Major  
**Sayfa:** Deneme Analizi  
**URL:** https://koclukakademisi.com/deneme-analizi

### Reproduce Adımları
1. Giriş yap
2. https://koclukakademisi.com/deneme-analizi adresine git
3. Sayfanın üst kısmına bak

### Beklenen Davranış
Deneme analizi özelliği çalışıyor olmalı veya "yakında" mesajı gösterilmeli.

### Gerçek Davranış
Sayfada büyük kırmızı uyarı kutusuyla "⚠️ ChatGPT Servisi Yapılandırılmamış — Deneme analizi yapabilmek için ChatGPT servisinin yapılandırılması gerekiyor." yazıyor.

### Etki
- Bu sayfa production'da yayında ama özellik çalışmıyor
- Kullanıcı deneyimini direkt kötü etkiliyor
- Ürün güvenilirliğini zedeliyor

### Çözüm Önerisi
- API key'i environment variable olarak ekle
- Ya da özelliği "coming soon" olarak işaretle ve sayfayı gizle

---

## BUG-009 — İstatistikler: "Haftalık Plan Oluştur" Butonu Redirect Etmiyor
**Severity:** 🟡 Minor  
**Sayfa:** İstatistikler  
**URL:** https://koclukakademisi.com/istatistikler

### Reproduce Adımları
1. Giriş yap
2. https://koclukakademisi.com/istatistikler adresine git
3. "Haftalık Plan Oluştur" butonuna tıkla

### Beklenen Davranış
`/haftalik-plan` sayfasına yönlendirilmeli.

### Gerçek Davranış
Buton tıklanıyor ama sayfa değişmiyor. URL hâlâ `/istatistikler` olarak kalıyor. Buton onClick handler'ı çalışmıyor ya da navigation kodu hatalı.

### Teknik Detay
Playwright testi: buton `.click()` başarılı ama `page.url()` hâlâ `/istatistikler` döndürüyor.

### Çözüm Önerisi
```javascript
// Button onClick:
<button onClick={() => router.push('/haftalik-plan')}>
  Haftalık Plan Oluştur
</button>

// Ya da Link olarak:
<Link href="/haftalik-plan">
  <button>Haftalık Plan Oluştur</button>
</Link>
```

---

## Özet Tablosu

| ID | Severity | Sayfa | Bug | Öncelik |
|----|----------|-------|-----|---------|
| BUG-001 | 🟡 Minor | Footer | Orphan "OK" text | Düşük |
| BUG-002 | 🟠 Major | Footer | Sahte telefon numarası | Yüksek |
| BUG-003 | 🟡 Minor | Homepage | Blog section boş (unauthenticated) | Orta |
| BUG-004 | 🟡 Minor | Genel | Tablet 768px layout bozuluyor | Orta |
| BUG-005 | 🟡 Minor | Homepage Mobile | Giriş Yap hamburger'da gizli | Orta |
| BUG-006 | 🟠 Major | Login | Back butonu session korumuyor | Yüksek |
| BUG-007 | 🟠 Major | Login | Rate limiting 15dk IP kilidi | Yüksek |
| BUG-008 | 🟠 Major | Deneme Analizi | ChatGPT yapılandırılmamış | Kritik |
| BUG-009 | 🟡 Minor | İstatistikler | Haftalık Plan butonu redirect etmiyor | Orta |

**Toplam:** 9 bug — 3 Major, 6 Minor
