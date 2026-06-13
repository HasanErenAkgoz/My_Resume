# İçerik Güncelleme Kontrol Listesi

CV içeriği tek bir iki dilli dosyada tutulur:
`frontend/src/assets/data/cv.data.json` (her alan `{ "tr": "...", "en": "..." }`).

> Not: Plan iki ayrı `cv.tr.json` / `cv.en.json` öngörüyordu; alan bazlı
> bilingual model seçildiği için tek dosya kullanıldı — bu, TR/EN arasında
> yapısal kayma (drift) riskini ortadan kaldırır.

Her güncellemede aşağıdaki adımları tamamlayın:

- [ ] `cv.data.json` içinde ilgili alanlar güncellendi (TR + EN birlikte)
- [ ] JSON geçerli mi kontrol edildi (`node -e "require('./frontend/src/assets/data/cv.data.json')"`)
- [ ] `caseStudies` metinleri TR/EN tutarlı
- [ ] `hrSignals` değerleri güncel (availability, noticePeriod, workPreference)
- [ ] `public/assets/cv/HasanErenAkgoz-CV.pdf` yeniden export edildi (ATS uyumlu)
- [ ] Profil fotoğrafı değiştiyse `public/assets/images/profile.webp` WebP olarak optimize edildi (≤ 100 KB)
- [ ] LinkedIn profili ile bilgiler tutarlı
- [ ] `git commit` → CI/CD otomatik deploy

## ATS PDF kuralları
- Tek sütun, standart font (Arial/Calibri), tablo yok
- Site içeriği ile birebir aynı bilgiler
- Dosya adı: `HasanErenAkgoz-CV.pdf`
