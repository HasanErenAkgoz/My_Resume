# Coolify ile CV Sitesi Deploy Rehberi

Coolify, sunucuda kendi **Vercel/Heroku benzeri panelin** olur: GitHub’a push → otomatik deploy, domain + SSL panelden.

Bu proje 3 servis kullanır (`web` + `api` + `proxy`). Coolify’da domain **doğrudan `web`’e değil**, nginx **`proxy`** servisine bağlanmalı — böylece `/hubs/chat` (SignalR) çalışır.

---

## Ön koşullar

- Hetzner VPS (4 GB RAM yeter — CX23)
- SSH erişimi (`ssh root@SUNUCU_IP`)
- GitHub repo: `HasanErenAkgoz/My_Resume`
- Domain (opsiyonel; Coolify geçici `sslip.io` URL de verir)

---

## Önemli: Mevcut manuel kurulum

Sunucuda `/opt/CV` ile `docker compose up` yaptıysan **önce durdur**:

```bash
cd /opt/CV
docker compose down
```

Coolify kurulumu **80 ve 443** portlarını kendi Traefik proxy’si için kullanır; çakışma olmamalı.

---

## Adım 1 — Coolify kur (sunucuda, bir kez)

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Kurulum:
- Docker
- Traefik (HTTPS / routing)
- Coolify paneli

**5–10 dk** sürebilir. Bittiğinde terminalde panel adresi yazar (genelde `http://SUNUCU_IP:8000`).

Firewall:

```bash
ufw allow 8000    # Coolify panel (ilk kurulum)
ufw allow 80
ufw allow 443
ufw allow OpenSSH
ufw enable
```

Tarayıcıda: `http://167.233.118.211:8000` (kendi IP’n)

İlk açılışta admin hesabı oluştur.

---

## Adım 2 — GitHub bağla

Coolify panelinde:

1. **Keys & Tokens** veya **Sources**
2. **GitHub** → **Connect** (GitHub App kur)
3. `HasanErenAkgoz/My_Resume` reposuna erişim ver

---

## Adım 3 — Yeni proje + Docker Compose

1. **+ New Project** → isim: `cv-site`
2. **+ New Resource**
3. **Public Repository** veya bağlı **GitHub** → repo seç: `My_Resume`
4. Branch: `main`
5. **Build Pack:** `Docker Compose`
6. **Docker Compose location:** `docker-compose.coolify.yml`  
   (Kökteki `docker-compose.yml` değil — Coolify için port’suz varyant)
7. **Base Directory:** `/` (repo kökü)

---

## Adım 4 — Ortam değişkenleri (.env yerine panel)

**Environment Variables** sekmesi:

| Key | Value |
|-----|--------|
| `OPENAI_API_KEY` | `sk-proj-...` |
| `OPENAI_MODEL` | `gpt-4o-mini` |
| `AI_CHAT_RATE_LIMIT_PER_HOUR` | `10` |

Coolify bunları `api` servisine compose üzerinden geçirir.

---

## Adım 5 — Domain’i doğru servise bağla

Bu adım kritik.

1. Resource ayarlarında **Domains** / **Network**
2. Domain ekle:
   - Kendi domain: `erenakgoz.dev`
   - veya Coolify’ın verdiği geçici URL
3. **Servis:** `proxy` (web veya api değil!)
4. **Port:** `8080`
5. **HTTPS:** Enable (Let’s Encrypt)

Traefik → `proxy:8080` → nginx → `/` web, `/hubs/` api

---

## Adım 6 — Deploy

**Deploy** butonuna bas.

İlk build **10–20 dk** sürebilir (Angular + .NET imajları).

Loglarda:
- `web` build
- `api` build
- `proxy` pull (nginx)

Hepsi yeşil → site açılır.

---

## Adım 7 — Test

- `https://domainin.com`
- `https://domainin.com?mode=scan`
- AI chat — mesaj gönder, stream gelsin
- `https://domainin.com/api/health`

---

## Otomatik deploy (push = canlı)

Coolify GitHub App ile webhook kurar:

```
Lokalde değişiklik → git push → Coolify otomatik pull + build + deploy
```

Manuel sunucu SSH’sına gerek kalmaz.

`cv.data.json` değiştirdiysen repoda backend kopyasını da güncelle:

```bash
cp frontend/src/assets/data/cv.data.json backend/CvSite.Api/Data/cv.data.json
git add -A && git commit -m "content: ..." && git push
```

---

## Coolify vs manuel terminal

| İş | Manuel | Coolify |
|----|--------|---------|
| İlk kurulum | Terminal | Panel + 1 install script |
| `.env` | `nano .env` | Panel → Environment Variables |
| Deploy | `docker compose up --build` | Deploy butonu / git push |
| SSL | Caddy / Certbot elle | Panel → Enable HTTPS |
| Log | `docker compose logs` | Panel → Logs |
| Restart | Terminal | Panel → Restart |

---

## Sık sorunlar

| Sorun | Çözüm |
|-------|--------|
| Port 80 meşgul | Eski `docker compose down`; Coolify Traefik’i kontrol et |
| AI chat kırık | Domain `proxy:8080`’e mi bağlı? `web`’e bağlıysa SignalR çalışmaz |
| Build fail | Panel logları; RAM yetersizse CX33 düşün |
| Repo private | GitHub App izni veya PAT |
| Yanlış compose | `docker-compose.coolify.yml` seçildiğinden emin ol |

---

## Dosyalar

| Dosya | Amaç |
|-------|------|
| `docker-compose.yml` | Manuel VPS deploy (port 8080/80) |
| `docker-compose.coolify.yml` | Coolify — host port yok, Traefik yönlendirir |
| `deploy/nginx.conf` | Tek origin: `/` + `/hubs/chat` |

---

## Geri dönüş (Coolify’dan çıkmak)

```bash
# Coolify’ı kaldırmak (dikkatli)
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash -s uninstall

# Manuel deploy’a dön
cd /opt/CV
docker compose up --build -d
```

---

İlgili: [DEPLOYMENT-TR.md](./DEPLOYMENT-TR.md) — terminal ile manuel kurulum açıklamaları.
