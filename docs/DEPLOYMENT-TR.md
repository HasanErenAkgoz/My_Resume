# CV Sitesi — Sunucu Kurulum Rehberi (Hetzner)

Bu doküman, projeyi Hetzner VPS üzerinde canlıya alırken terminalde çalıştırdığımız komutların **ne işe yaradığını** açıklar.  
Ek olarak, aynı işleri **arayüzden** yapıp yapamayacağınızı özetler.

---

## Genel mimari

```
Tarayıcı → http://SUNUCU_IP veya domain
              ↓
         nginx (proxy) :80
         ├── /           → Angular SSR (web)
         └── /hubs/chat  → .NET API (api)
```

Üç Docker konteyneri birlikte çalışır: `web`, `api`, `proxy`.

---

## Ön koşullar

| Gereksinim | Açıklama |
|------------|----------|
| Hetzner sunucu | Örn. CX23 — 2 vCPU, 4 GB RAM, Nuremberg |
| SSH erişimi | Mac’ten `ssh root@SUNUCU_IP` |
| GitHub repo | https://github.com/HasanErenAkgoz/My_Resume |
| OpenAI API key | AI chat için (opsiyonel; yoksa demo modu) |

---

## 1. SSH ile sunucuya bağlanma

```bash
ssh root@167.233.118.211
```

| Ne yapar? | Mac’inizden Hetzner sunucusuna şifreli uzaktan bağlantı açar. Bundan sonraki komutlar **sunucuda** çalışır. |
|-----------|-------------------------------------------------------------------------------------------------------------|
| `root` | Linux’te tam yetkili yönetici kullanıcı. |
| IP | Hetzner Console → Servers → IPv4 adresi. |

**Host key uyarısı** (`REMOTE HOST IDENTIFICATION HAS CHANGED`):

```bash
ssh-keygen -R 167.233.118.211
```

Rescue modu veya sunucu yeniden kurulunca SSH anahtarı değişir; eski kaydı siler.

---

## 2. Sistemi güncelleme

```bash
apt update && apt upgrade -y
```

| Komut | Ne yapar? |
|-------|-----------|
| `apt update` | Paket listesini günceller (yeni sürüm bilgisi çeker). |
| `apt upgrade -y` | Kurulu paketleri güvenlik ve hata düzeltmeleriyle günceller. `-y` = onay sormadan evet der. |

Sunucuyu güvenli ve güncel tutmak için ilk adım.

---

## 3. Git ve yardımcı araçlar

```bash
apt install -y git curl ca-certificates
```

| Paket | Ne işe yarar? |
|-------|----------------|
| `git` | GitHub’dan projeyi klonlamak için. |
| `curl` | Docker kurulum script’ini indirmek için. |
| `ca-certificates` | HTTPS bağlantılarında sertifika doğrulama. |

---

## 4. Docker kurulumu

```bash
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker
```

| Adım | Ne yapar? |
|------|-----------|
| `get.docker.com` script | Docker Engine + Docker Compose plugin’i otomatik kurar. |
| `systemctl enable docker` | Sunucu yeniden başlayınca Docker’ın otomatik açılmasını sağlar. |
| `systemctl start docker` | Docker servisini hemen başlatır. |

**Neden Docker?** Projede `web`, `api` ve `nginx` birlikte tanımlı (`docker-compose.yml`). Tek komutla üç servisi aynı şekilde ayağa kaldırır; Node/.NET sürümlerini elle kurmaya gerek kalmaz.

---

## 5. Projeyi sunucuya indirme

```bash
cd /opt
git clone https://github.com/HasanErenAkgoz/My_Resume.git CV
cd CV
```

| Ne yapar? | |
|-----------|--|
| `cd /opt` | Projeler için yaygın klasör (`/opt/CV`). |
| `git clone ...` | GitHub’daki kodu sunucuya kopyalar. |
| `cd CV` | Proje kök dizinine girer. |

**Not:** Repo private ise GitHub Personal Access Token veya SSH key gerekir. Public repoda kullanıcı/şifre sorulmaz.

---

## 6. Ortam değişkenleri (`.env`)

```bash
nano .env
```

Dosya içeriği:

```env
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini
AI_CHAT_RATE_LIMIT_PER_HOUR=10
```

| Değişken | Ne işe yarar? |
|----------|----------------|
| `OPENAI_API_KEY` | .NET API’nin OpenAI’ye bağlanması. Tarayıcıya **asla** gitmez. |
| `OPENAI_MODEL` | Kullanılacak model (örn. `gpt-4o-mini`). |
| `AI_CHAT_RATE_LIMIT_PER_HOUR` | IP başına saatlik mesaj limiti (kötüye kullanımı sınırlar). |

`nano` kaydetme: `Ctrl+O` → Enter → `Ctrl+X`

`.env` Git’e commit edilmez (`.gitignore`’da) — sadece sunucuda kalır.

---

## 7. HTTP portunu 80 yapma

```bash
sed -i 's/"8080:8080"/"80:8080"/' docker-compose.yml
```

| Ne yapar? | |
|-----------|--|
| `docker-compose.yml` | `proxy` (nginx) servisinin dış portunu **8080 → 80** yapar. |
| Sonuç | `http://SUNUCU_IP` ile doğrudan site açılır (port yazmadan). |

`8080:8080` = dışarıdan 8080, konteyner içi 8080.  
`80:8080` = dışarıdan 80 (standart web), konteyner içi 8080.

---

## 8. Siteyi build edip çalıştırma

```bash
docker compose up --build -d
```

| Parça | Anlamı |
|-------|--------|
| `docker compose up` | `docker-compose.yml`’deki servisleri başlatır. |
| `--build` | İmajları yeniden derler (Angular + .NET). İlk sefer 10–15 dk sürebilir. |
| `-d` | Arka planda (detached) çalıştırır; terminal kapanınca durmaz. |

**Oluşan konteynerler:**

| Servis | Teknoloji | Görev |
|--------|-----------|--------|
| `web` | Node.js + Angular SSR | Site HTML’i, statik dosyalar |
| `api` | .NET 8 + SignalR | AI chat, `/hubs/chat` |
| `proxy` | nginx | Tek giriş noktası; `/` → web, `/hubs/` → api |

Kontrol:

```bash
docker compose ps          # çalışan servisler
curl -I http://localhost/  # ana sayfa 200 mü?
curl http://localhost/api/health  # API sağlık kontrolü
```

Log:

```bash
docker compose logs -f web
docker compose logs -f api
docker compose logs -f proxy
```

---

## 9. Firewall (güvenlik duvarı)

```bash
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable
```

| Kural | Ne işe yarar? |
|-------|----------------|
| `OpenSSH` (22) | SSH ile sunucuya bağlanmaya devam edersiniz. |
| `80` | HTTP (site). |
| `443` | HTTPS (domain + SSL sonrası). |
| `ufw enable` | Kuralları aktif eder. |

Hetzner panelinde de **Firewalls** ile 22, 80, 443 açık olmalı.

---

## 10. Tarayıcıdan test

```
http://167.233.118.211
http://167.233.118.211?mode=scan
```

AI chat, CV indirme ve bölümlerin görünmesi gerekir.

---

## 11. Güncelleme (kod değişince)

Lokalde değişiklik → GitHub’a push → sunucuda:

```bash
cd /opt/CV
git pull
cp frontend/src/assets/data/cv.data.json backend/CvSite.Api/Data/cv.data.json
docker compose up --build -d
```

| Adım | Neden? |
|------|--------|
| `git pull` | Yeni kodu çeker. |
| `cp cv.data.json` | Frontend ve backend CV verisini senkron tutar. |
| `docker compose up --build -d` | Değişiklikleri yeniden build edip yayınlar. |

---

## 12. Domain ve HTTPS (sonraki adım)

1. Domain panelinde **A kaydı** → sunucu IP  
2. Sunucuda **Caddy** veya **Certbot** ile ücretsiz SSL  
3. `https://domainin.com` üzerinden erişim  

Detay için README ve bu dosyanın “İlgili dosyalar” bölümüne bakın.

---

## Sık karşılaşılan sorunlar

| Belirti | Olası neden | Çözüm |
|---------|-------------|--------|
| `Permission denied (ssh)` | SSH key sunucuda yok | Hetzner’da key seçerek sunucu oluştur veya `authorized_keys` ekle |
| `Connection refused` | Sunucu kapalı / reboot | Panelden Running bekle, 2–3 dk |
| Git `Password authentication not supported` | GitHub şifre kabul etmiyor | Repo public yap veya Personal Access Token |
| 502 Bad Gateway | nginx upstream hazır değil | `docker compose restart proxy` |
| AI cevap vermiyor | `.env` key yok/yanlış | `docker compose logs api` |

---

## Terminal yerine arayüz kullanılabilir mi?

Kısmen **evet**, tamamen **hayır** — sunucu yönetimi ve ilk kurulum için bir miktar terminal veya terminal yerine geçen araç gerekir. Aşağıda neyin nereden yapılabileceği özetlenmiştir.

### Zaten arayüz olan işler (Hetzner)

| İş | Arayüz |
|----|--------|
| Sunucu oluşturma / silme | [Hetzner Cloud Console](https://console.hetzner.cloud) |
| IP, firewall, rescue | Aynı panel |
| Tarayıcıdan acil terminal | Sunucu → **Console** |
| SSH key ekleme | **Security → SSH keys** |
| Fatura, sunucu durumu | Panel |

Bunlar için terminal şart değil.

### Terminal yerine kullanılabilecek araçlar

| Araç | Ne sağlar? | Bu proje için |
|------|------------|-------------|
| **[Portainer](https://www.portainer.io/)** | Docker konteynerlerini web’den başlat/durdur, log gör | `docker compose` sonrası yönetim için uygun |
| **[Coolify](https://coolify.io/)** | GitHub bağla → push ile otomatik deploy, `.env` panelden | İleride “tek tık deploy” için ideal |
| **[CapRover](https://caprover.com/)** | Benzer PaaS, kendi sunucunda | Alternatif |
| **GitHub Actions** | Push olunca sunucuya SSH + deploy | Repoda workflow var; genişletilebilir |
| **VS Code Remote SSH** | Editörden dosya düzenleme, entegre terminal | `.env` ve dosyalar için terminal hissini azaltır |
| **FileZilla / WinSCP** | SFTP ile dosya yükleme | `.env` düzenlemek için; Docker build yine gerekir |

### Terminal olmadan tam deploy mümkün mü?

| Senaryo | Terminal gerekir mi? |
|---------|----------------------|
| İlk kurulum (Docker + clone + compose) | Evet, **veya** Coolify/CapRover kurulumunda bir kez |
| Günlük “siteyi güncelle” | Hayır — Coolify / GitHub Actions ile otomatik |
| Konteyner restart, log | Hayır — Portainer |
| `.env` (API key) | Panel (Coolify secrets) veya SFTP editör |
| Domain + SSL | Caddy çoğu zaman otomatik; ilk kurulumda 1–2 komut |

### Pratik öneri (senin proje için)

1. **Şimdi:** İlk deploy’u terminal ile bitir (bir kez).  
2. **Sonra:** İstersen sunucuya **Portainer** kur → konteynerleri web’den yönet.  
3. **İleride:** **Coolify** veya **GitHub Actions** → `git push` = otomatik deploy; terminali nadiren açarsın.

Portainer tek komutla (sunucuda, ilk kurulumdan sonra):

```bash
docker volume create portainer_data
docker run -d -p 9000:9000 --name=portainer --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

Tarayıcı: `http://SUNUCU_IP:9000` (firewall’da 9000 açman gerekir).

---

## Komut özeti (kopyala-yapıştır)

Sunucuya SSH ile girdikten sonra (`.env` içinde kendi key’in olmalı):

```bash
apt update && apt upgrade -y
apt install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sh
systemctl enable docker && systemctl start docker

cd /opt
git clone https://github.com/HasanErenAkgoz/My_Resume.git CV
cd CV
nano .env   # OPENAI_API_KEY vb.

sed -i 's/"8080:8080"/"80:8080"/' docker-compose.yml
docker compose up --build -d

ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw enable
```

---

## İlgili dosyalar

| Dosya | Açıklama |
|-------|----------|
| `docker-compose.yml` | Üç servisin tanımı |
| `deploy/nginx.conf` | Reverse proxy, SignalR yönlendirmesi |
| `.env.example` | Ortam değişkeni şablonu |
| `README.md` | Geliştirme ve Docker özeti |
| `docs/COOLIFY-TR.md` | Coolify ile panelden deploy (git push = canlı) |
| `.github/workflows/deploy.yml` | CI (build/test); tam sunucu deploy opsiyonel |

---

*Son güncelleme: Hetzner CX23, Ubuntu 26.04, IP örneği: 167.233.118.211*
