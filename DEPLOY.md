# КурьерХаб - Инструкция по деплою и настройке

## Содержание
1. [Подготовка сервера](#подготовка-сервера)
2. [Настройка переменных окружения](#настройка-переменных-окружения)
3. [Деплой на VPS](#деплой-на-vps)
4. [Настройка Nginx](#настройка-nginx)
5. [SSL сертификат](#ssl-сертификат)
6. [Яндекс Вебмастер](#яндекс-вебмастер)
7. [Telegram Bot](#telegram-bot)
8. [Безопасность](#безопасность)

---

## Подготовка сервера

### Минимальные требования
- Ubuntu 22.04 LTS / Debian 12
- 2 GB RAM
- 20 GB SSD
- Node.js 20.x LTS

### Установка Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Установка PM2
```bash
sudo npm install -g pm2
```

### Установка pnpm
```bash
npm install -g pnpm
```

### Установка и настройка PostgreSQL
```bash
# Установка
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# Создание базы и пользователя
sudo -u postgres psql <<'SQL'
CREATE DATABASE elwork;
CREATE USER elwork_user WITH ENCRYPTED PASSWORD 'СменитеПароль';
GRANT ALL PRIVILEGES ON DATABASE elwork TO elwork_user;
SQL
```

Схема таблиц создаётся приложением автоматически при первом запросе
(идемпотентно, через `CREATE TABLE IF NOT EXISTS`). Строку подключения
укажите в `DATABASE_URL` (см. ниже). Локальному Postgres на той же VPS
SSL обычно не нужен — оставьте `DATABASE_SSL=false`.

---

## Настройка переменных окружения

Скопируйте файл `.env.example` и заполните значения:

```bash
cp .env.example .env
nano .env
```

### Содержимое `.env`:
```bash
# Основные настройки
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://kurierhub.ru

# База данных PostgreSQL (ОБЯЗАТЕЛЬНО)
DATABASE_URL=postgres://user:password@localhost:5432/elwork
DATABASE_SSL=false

# Безопасность админки (ОБЯЗАТЕЛЬНО ИЗМЕНИТЕ!)
ADMIN_SECRET=ваш_секретный_ключ_минимум_32_символа

# Telegram Bot (создайте через @BotFather)
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

> Сессии админки хранятся в таблице `sessions` в PostgreSQL (не JWT),
> поэтому отдельный секрет для сессий не нужен.

### Генерация секретных ключей
```bash
# Для ADMIN_SECRET
openssl rand -base64 32
```

> **ВАЖНО:** Никогда не используйте значения по умолчанию в продакшене!

---

## Деплой на VPS

### Вариант 1: Стандартный деплой (PM2)

#### 1. Клонируйте проект
```bash
cd /var/www
git clone https://github.com/your-repo/kurierhub.git
cd kurierhub
```

#### 2. Настройте окружение
```bash
cp .env.example .env
nano .env  # Заполните все переменные
```

#### 3. Установите зависимости
```bash
pnpm install --frozen-lockfile
```

#### 4. Создайте администратора
```bash
# Формат: node scripts/create-admin.mjs <username> <password> [role]
# Роли: admin (полный доступ), operator (ограниченный)
node scripts/create-admin.mjs admin ВашСложныйПароль123! admin
```

#### 5. Соберите проект
```bash
pnpm build
```

#### 6. Запустите через PM2
```bash
pm2 start npm --name "kurierhub" -- start
pm2 save
pm2 startup  # Автозапуск при перезагрузке сервера
```

#### 7. Проверьте статус
```bash
pm2 status
pm2 logs kurierhub
```

---

### Вариант 2: Docker деплой (рекомендуется)

#### Создайте `Dockerfile` в корне проекта:
```dockerfile
FROM node:20-alpine AS base

# Установка зависимостей для сборки native модулей
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Установка pnpm
RUN npm install -g pnpm

# Копирование файлов зависимостей
COPY package.json pnpm-lock.yaml ./

# Установка зависимостей
RUN pnpm install --frozen-lockfile

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN pnpm build

# Production образ
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Создание пользователя без root прав
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копирование собранного приложения
COPY --from=base /app/public ./public
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static

# Создание директории для базы данных
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### Создайте `docker-compose.yml`:
```yaml
version: '3.8'

services:
  kurierhub:
    build: .
    container_name: kurierhub
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    volumes:
      - ./data:/app/data  # Персистентность базы данных
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

#### Запуск Docker:
```bash
# Сборка и запуск
docker-compose up -d --build

# Просмотр логов
docker-compose logs -f kurierhub

# Создание администратора в контейнере
docker-compose exec kurierhub node scripts/create-admin.mjs admin ВашПароль admin

# Перезапуск
docker-compose restart

# Остановка
docker-compose down
```

---

### Вариант 3: Systemd сервис (без PM2)

#### Создайте `/etc/systemd/system/kurierhub.service`:
```ini
[Unit]
Description=КурьерХаб Next.js Application
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/kurierhub
ExecStart=/usr/bin/node /var/www/kurierhub/.next/standalone/server.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=kurierhub
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=/var/www/kurierhub/.env

[Install]
WantedBy=multi-user.target
```

#### Активация сервиса:
```bash
# Перезагрузка systemd
sudo systemctl daemon-reload

# Запуск сервиса
sudo systemctl start kurierhub

# Автозапуск при загрузке
sudo systemctl enable kurierhub

# Проверка статуса
sudo systemctl status kurierhub

# Просмотр логов
sudo journalctl -u kurierhub -f
```

> **Примечание:** Для standalone режима добавьте в `next.config.mjs`:
> ```js
> output: 'standalone',
> ```

---

## Настройка Nginx

### Установка
```bash
sudo apt install nginx
```

### Конфигурация `/etc/nginx/sites-available/kurierhub`
```nginx
server {
    listen 80;
    server_name kurierhub.ru www.kurierhub.ru;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name kurierhub.ru www.kurierhub.ru;

    # SSL сертификаты (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/kurierhub.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kurierhub.ru/privkey.pem;

    # Безопасность
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # Заголовки безопасности
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://charter-panel.com https://*.charter-panel.com; img-src 'self' data: blob: https://charter-panel.com https://*.charter-panel.com; style-src 'self' 'unsafe-inline' https://charter-panel.com https://*.charter-panel.com; font-src 'self' data: https://charter-panel.com https://*.charter-panel.com; connect-src 'self' https://charter-panel.com https://*.charter-panel.com wss://charter-panel.com wss://*.charter-panel.com; frame-src 'self' https://charter-panel.com https://*.charter-panel.com; worker-src 'self' blob:; frame-ancestors 'self';" always;

    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;

    # Кеширование статики
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /images {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Проксирование на Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Активация сайта
```bash
sudo ln -s /etc/nginx/sites-available/kurierhub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## SSL сертификат

### Установка Certbot
```bash
sudo apt install certbot python3-certbot-nginx
```

### Получение сертификата
```bash
sudo certbot --nginx -d kurierhub.ru -d www.kurierhub.ru
```

### Автообновление
```bash
sudo certbot renew --dry-run
```

---

## Яндекс Вебмастер

### Подтверждение сайта
Сайт уже подтверждён через мета-тег: `ef2c4b2a095dfe2e`

### Действия в Вебмастере (webmaster.yandex.ru)

1. **Добавьте сайт:** kurierhub.ru
2. **Подтвердите права** (мета-тег уже добавлен)
3. **Отправьте sitemap:** https://kurierhub.ru/sitemap.xml
4. **Настройте регион:** Россия
5. **Укажите главное зеркало:** https://kurierhub.ru (с www редиректом)

### Важные страницы для индексации
- https://kurierhub.ru/
- https://kurierhub.ru/vacancies
- https://kurierhub.ru/cities
- https://kurierhub.ru/about
- https://kurierhub.ru/tracking
- https://kurierhub.ru/support
- https://kurierhub.ru/partners

---

## Telegram Bot

### Создание бота
1. Напишите @BotFather в Telegram
2. Отправьте `/newbot`
3. Введите имя: `КурьерХаб Поддержка`
4. Введите username: `kurierhub_support_bot`
5. Скопируйте токен в `.env`

### Настройка Webhook
После деплоя выполните:
```bash
curl -X POST "https://kurierhub.ru/api/telegram/set-webhook?secret=ваш_ADMIN_SECRET"
```

### Добавление менеджеров
Через админку `/admin` или API:
```bash
curl -X POST "https://kurierhub.ru/api/admin/managers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ваш_токен" \
  -d '{"name":"Иван","telegram_id":"123456789","is_active":true}'
```

---

## Безопасность

### Чек-лист перед запуском

- [ ] Установлен уникальный `ADMIN_SECRET` (сгенерирован через `openssl rand -base64 32`). Отдельный JWT-секрет не нужен — сессии хранятся в БД
- [ ] Сайт открывается строго по HTTPS (иначе secure-cookie сессии не сохраняется и админка «разлогинивается» при обновлении)
- [ ] Создан администратор через `scripts/create-admin.mjs` (пароли хэшируются bcrypt)
- [ ] Настроен HTTPS (SSL сертификат Let's Encrypt)
- [ ] Настроены заголовки безопасности в Nginx
- [ ] Файл `.env` добавлен в `.gitignore` и не в Git репозитории
- [ ] Админка защищена паролем (bcrypt хэширование, сессии в БД)
- [ ] Rate limiting включен для всех API endpoints
- [ ] Логи настроены и ротируются
- [ ] Папка `/data` (база данных) имеет правильные права доступа
- [ ] Регулярные бэкапы базы данных настроены

### Архитектура безопасности

**Аутентификация:**
- Пароли хэшируются bcrypt с cost factor 12
- Сессии хранятся в базе данных (не только в cookies)
- Токены сессий генерируются криптографически (32 bytes)
- Автоматическое истечение сессий через 24 часа

**Защита от атак:**
- Rate limiting: 5 попыток входа в минуту
- SQL Injection: параметризованные запросы (pg)
- XSS: заголовки безопасности в Nginx и Next.js
- CSRF: проверка Origin/Referer (рекомендуется добавить токены)

### Бэкап базы данных (PostgreSQL)

```bash
# Ручной бэкап (pg_dump использует переменные из DATABASE_URL)
pg_dump "$DATABASE_URL" -Fc -f /backup/elwork_$(date +%Y%m%d_%H%M%S).dump

# Автоматический бэкап (cron). Добавьте в crontab -e:
0 3 * * * pg_dump "postgres://user:password@localhost:5432/elwork" -Fc -f /backup/elwork_$(date +\%Y\%m\%d).dump

# Восстановление
pg_restore -d "$DATABASE_URL" --clean /backup/elwork_YYYYMMDD.dump
```

### Мониторинг

```bash
# Логи PM2
pm2 logs kurierhub --lines 100

# Статус приложения
pm2 monit

# Перезапуск при обновлении
pm2 restart kurierhub
```

### Обновление проекта

```bash
cd /var/www/kurierhub
git pull origin main
pnpm install --frozen-lockfile
pnpm build
pm2 restart kurierhub

# Или с Docker:
docker-compose down
docker-compose up -d --build
```

---

## Troubleshooting (Решение проблем)

### Приложение не запускается

```bash
# Проверьте логи
pm2 logs kurierhub --lines 100
# или
docker-compose logs -f kurierhub

# Проверьте порт
sudo lsof -i :3000

# Проверьте доступность БД
psql "$DATABASE_URL" -c "SELECT 1;"

# Проверьте health-эндпойнт (он реально пингует БД)
curl -s http://localhost:3000/api/health
```

### Ошибка подключения к PostgreSQL

```bash
# Проверьте, что переменная окружения задана и доступна процессу
echo "$DATABASE_URL"

# Проверьте, что Postgres запущен и принимает подключения
sudo systemctl status postgresql
psql "$DATABASE_URL" -c "SELECT version();"
```

### Ошибка доступа к админке

```bash
# Пересоздайте администратора (требуется DATABASE_URL в окружении)
DATABASE_URL="postgres://user:password@localhost:5432/elwork" \
  node scripts/create-admin.mjs newadmin НовыйПароль123! admin

# Проверьте базу данных
psql "$DATABASE_URL" -c "SELECT id, username, role FROM admin_users;"
```

### SSL сертификат не обновляется

```bash
# Принудительное обновление
sudo certbot renew --force-renewal

# Проверьте автообновление
sudo certbot renew --dry-run
```

---

## Структура проекта

```
kurierhub/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── admin/             # Админ-панель
│   ├── about/             # О компании
│   ├── cities/            # География
│   ├── partners/          # Партнерам
│   ├── support/           # Поддержка
│   ├── tracking/          # Отслеживание
│   ├── vacancies/         # Вакансии
│   ├── layout.tsx         # Корневой layout с SEO
│   ├── page.tsx           # Главная страница
│   └── sitemap.ts         # Генерация sitemap
├── components/            # React компоненты
├── lib/                   # Утилиты и конфиг
├── public/                # Статика
│   ├── manifest.json      # PWA манифест
│   └── robots.txt         # Для поисковиков
├── .env.example           # Пример переменных
├── next.config.mjs        # Конфиг Next.js
└── package.json           # Зависимости
```

---

## Контакты для поддержки

При возникновении проблем:
- Telegram: @kurierhub_support
- Email: support@kurierhub.ru
- Телефон: +7 (495) 123-45-67
