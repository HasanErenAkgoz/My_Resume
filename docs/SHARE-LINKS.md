# Paylaşım Linkleri Rehberi

Site iki modda çalışır. Linki nereye koyduğunuza göre doğru modu seçin.

| Kanal | Link | Mod | Neden |
|-------|------|-----|-------|
| LinkedIn bio | `https://hasaneren.dev?mode=scan` | Scan | İK sade, hızlı taranabilir görünüm görür |
| CV PDF / QR kod | `https://hasaneren.dev?mode=scan` | Scan | Kurumsal İK uyumu |
| E-posta imzası | `https://hasaneren.dev?mode=scan` | Scan | Profesyonel, abartısız |
| Tech topluluk / Twitter | `https://hasaneren.dev` | Explore | Tam holografik deneyim (wow) |
| Hiring manager DM | `https://hasaneren.dev` | Explore | Case study + GitHub + tüm deneyim |

## Mod davranışı
- `?mode=scan` → site doğrudan Scan Mode'da açılır (animasyon/neon kapalı).
- Header'daki **Scan/Explore toggle** ile kullanıcı modu anında değiştirebilir;
  URL `history.replaceState` ile güncellenir (sayfa yenilenmez).
- `prefers-reduced-motion` açık kullanıcılar otomatik Scan Mode görür.
- İlk ziyaret (URL parametresi yok) → Explore Mode.
