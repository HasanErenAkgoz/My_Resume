# Hasan Eren Akgöz — CV & Tanıtım Sitesi

Fütüristik, iki dilli (TR/EN), İK-dostu bir CV ve tanıtım sitesi.
**"Mission Control × Holographic"** tasarım dili: etkileyici görünüm + 6 saniyelik
İK taramasına uygun, erişilebilir ve hızlı.

## Öne çıkanlar
- **Angular 18 + SSR/Prerender** — SEO ve LinkedIn OG bot uyumu
- **AI Chat (.NET 8 + SignalR)** — CV-only context, token-token streaming, IP rate limit, keysiz demo fallback
- **İki mod:** Explore (holografik/wow) ↔ Scan (sade, İK-dostu). `?mode=scan` ile
  paylaşılabilir; header toggle ile anında değişir.
- **İK Özeti kutusu** — isim, unvan, son iş, stack, müsaitlik; fold üstünde, tıklamasız
- **3 case study** — problem → çözüm → etki (Feedback4e AI, RealSolutions ERP, TBF migrasyon)
- **GitHub aktivite kartı**, **2D yetkinlik grid**, **görev kayıtları** (tüm bullet açık)
- **KVKK uyumlu** çerez banner'ı + `/privacy` (TR/EN)
- **Erişilebilirlik:** WCAG AA odak, `prefers-reduced-motion`, print stylesheet
- **JSON-LD Person**, Open Graph, `sitemap.xml`, `robots.txt`
- İçerik tek bir iki dilli dosyada: `frontend/src/assets/data/cv.data.json`

## Geliştirme

```bash
cd frontend
npm install
npm start            # http://localhost:4200 (dev)
```

### AI Chat backend (.NET 8 + SignalR)

```bash
cd backend/CvSite.Api
export DOTNET_ROOT=$HOME/.dotnet && export PATH=$HOME/.dotnet:$PATH   # PATH'te değilse
ASPNETCORE_URLS=http://localhost:5080 dotnet run --no-launch-profile  # hub: /hubs/chat
```

Frontend, `localhost:4200/4000` üzerinde çalışırken hub'a otomatik olarak
`http://localhost:5080/hubs/chat` adresinden bağlanır. `OPENAI_API_KEY` tanımlı
değilse asistan güvenli bir demo yanıtı döndürür.

## Production build + SSR

```bash
cd frontend
npm run build
node dist/frontend/server/server.mjs   # http://localhost:4000
```

## Docker

```bash
docker compose up --build   # http://localhost:8080 (nginx → SSR + .NET hub)
```

**Sunucu (production):**

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
# Caddy → 127.0.0.1:8888 — bkz. docs/DEPLOYMENT-TR.md
```

Üç servis ayağa kalkar: `web` (Angular SSR), `api` (.NET 8 SignalR) ve `proxy`
(nginx). nginx tek origin sunar; tarayıcı sohbete same-origin `/hubs/chat`
üzerinden ulaşır (production'da CORS gerekmez). AI anahtarını `.env` ile geçin.

## İçerik güncelleme
`frontend/src/assets/data/cv.data.json` dosyasını düzenleyin ve
[`docs/CONTENT-CHECKLIST.md`](docs/CONTENT-CHECKLIST.md) adımlarını izleyin.
Admin paneli yoktur (bilinçli karar — JSON + Git + IDE yeterli).

## Mimari notu (Senior kararı)
CV içeriği salt-okunur olduğundan içerik tipli JSON olarak bundle edilir ve
SSR/istemcide aynı şekilde sunulur (admin paneli yok). Dinamik GitHub verisi
public API + SSR Node sunucusu ile karşılanır.

**AI Chat** ayrı bir **.NET 8 + SignalR** servisidir (`backend/CvSite.Api`):
OpenAI anahtarı sunucuda gizlenir, yanıtlar `IAsyncEnumerable` ile token-token
stream edilir, IP bazlı saatlik rate limit uygulanır ve CV dışına çıkmayan bir
sistem promptu kullanılır. Anahtar yoksa güvenli demo yanıtı döner. Frontend
`@microsoft/signalr` ile hub'a bağlanır; production'da nginx tek origin sağlar.

## Yol haritası
- **v1.0:** MVP — tüm İK/hiring manager bölümleri, SSR, KVKK, SEO, CI/CD
- **v1.1 (bu sürüm):** Boot sequence, 3D Skill Constellation (Three.js), Command Palette,
  holografik 3D profil + nebula, **AI Chat (.NET 8 + SignalR)**
- **v1.2:** Testimonials, blog

## Dokümanlar
- [`docs/CONTENT-CHECKLIST.md`](docs/CONTENT-CHECKLIST.md)
- [`docs/SEO-STRATEGY.md`](docs/SEO-STRATEGY.md)
- [`docs/SHARE-LINKS.md`](docs/SHARE-LINKS.md)
- [`docs/PRIVACY-tr.md`](docs/PRIVACY-tr.md) · [`docs/PRIVACY-en.md`](docs/PRIVACY-en.md)
