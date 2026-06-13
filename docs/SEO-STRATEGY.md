# SEO & Paylaşım Stratejisi

## SSR / Prerender
- Uygulama Angular 18 **SSR + prerender** ile yayınlanır (`angular.json` → `prerender: true`).
- `/` ve `/privacy` build sırasında statik olarak prerender edilir; LinkedIn/Facebook
  botları JS çalıştırmadan tam HTML + meta etiketlerini görür.
- Çalışma zamanında SSR sunucusu (`server.ts`) dinamik istekleri de render eder.

## Meta etiketleri
- `SeoService` (`src/app/core/services/seo.service.ts`) dile göre `<title>`,
  `description`, Open Graph ve Twitter Card etiketlerini günceller.
- `index.html` içinde statik fallback OG meta bulunur.

## JSON-LD
- Her sayfada `Schema.org/Person` JSON-LD enjekte edilir (ad, unvan, e-posta,
  `sameAs` → LinkedIn + GitHub, `knowsAbout` → stack).

## Dosyalar
- `frontend/public/robots.txt` — tüm botlara açık + sitemap referansı
- `frontend/public/sitemap.xml` — `/` ve `/privacy`

## OG görseli — yapılacak (production öncesi)
- `frontend/public/assets/images/og-banner.svg` hazır (1200×630).
- Bazı sosyal platformlar SVG OG görselini render etmez. Production'dan önce
  PNG'ye çevirin:
  ```bash
  # rsvg-convert veya resvg ile
  rsvg-convert -w 1200 -h 630 og-banner.svg -o og-banner.png
  ```
  Ardından `index.html` ve `seo.service.ts` içindeki `og:image` uzantısını
  `.png` yapın.

## Profil fotoğrafı — yapılacak
- `public/assets/images/profile.webp` eklenince İK Özeti'nde otomatik görünür.
- Yoksa baş harfler (`HA`) fallback olarak gösterilir (mevcut davranış).
