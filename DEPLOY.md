# КурьерХаб - Инструкция по деплою и настройке

## Содержание
1. [Подготовка сервера](#подготовка-сервера)
2. [Настройка переменных окружения](#настройка-переменных-окружения)
3. [Деплой на VPS](#деплой-на-vps)
4. [Настройка Nginx](#настройка-nginx)
5. [SSL сертификат](#ssl-сертификат)
6. [Яндекс Метрика - Цели](#яндекс-метрика---цели)
7. [Яндекс Директ - Настройка](#яндекс-директ---настройка)
8. [Яндекс Вебмастер](#яндекс-вебмастер)
9. [Telegram Bot](#telegram-bot)
10. [Безопасность](#безопасность)

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

# Безопасность админки (ОБЯЗАТЕЛЬНО ИЗМЕНИТЕ!)
ADMIN_SECRET=ваш_секретный_ключ_минимум_32_символа

# JWT секрет для сессий (ОБЯЗАТЕЛЬНО ИЗМЕНИТЕ!)
JWT_SECRET=ваш_jwt_секрет_минимум_32_символа

# Telegram Bot (создайте через @BotFather)
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

# Яндекс Метрика (опционально)
NEXT_PUBLIC_YANDEX_METRIKA_ID=109455099
```

### Генерация секретных ключей
```bash
# Для ADMIN_SECRET
openssl rand -base64 32

# Для JWT_SECRET
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
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' mc.yandex.ru mc.yandex.com; img-src 'self' data: mc.yandex.ru; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' mc.yandex.ru mc.yandex.com;" always;

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

## Яндекс Метрика - Цели

### Счётчик уже установлен: 109455099

### Цели для настройки в Яндекс Метрике (metrika.yandex.ru)

Перейдите: Настройка → Цели → Добавить цель

| № | Название цели | Идентификатор | Тип | Описание |
|---|---------------|---------------|-----|----------|
| 1 | Клик по Telegram | `messenger_telegram_click` | JavaScript-событие | Клик по кнопке Telegram |
| 2 | Клик по WhatsApp | `messenger_whatsapp_click` | JavaScript-событие | Клик по кнопке WhatsApp |
| 3 | Клик по Max | `messenger_max_click` | JavaScript-событие | Клик по кнопке Max |
| 4 | Начало диалога в чате | `chat_dialog_started` | JavaScript-событие | Пользователь отправил первое сообщение |
| 5 | Открытие чата | `chat_opened` | JavaScript-событие | Открытие виджета чата |
| 6 | Клик по телефону | `phone_click` | JavaScript-событие | Клик по номеру телефона |
| 7 | Расчёт стоимости | `calculator_submit` | JavaScript-событие | Нажатие "Рассчитать" в калькуляторе |
| 8 | Оформление заявки | `order_form_submit` | JavaScript-событие | Отправка формы заказа |
| 9 | Открытие вакансии | `vacancy_opened` | JavaScript-событие | Открытие карточки вакансии |
| 10 | Отклик на вакансию | `vacancy_apply` | JavaScript-событие | Нажатие "Откликнуться" |
| 11 | Посещение страницы вакансий | `vacancies_page_view` | JavaScript-событие | Переход на /vacancies |
| 12 | Посещение страницы городов | `cities_page_view` | JavaScript-событие | Переход на /cities |
| 13 | Посещение страницы О нас | `about_page_view` | JavaScript-событие | Переход на /about |
| 14 | Посещение страницы партнеров | `partners_page_view` | JavaScript-событие | Переход на /partners |

### Составные цели (воронки)

**Воронка "Заказ доставки":**
1. Посещение главной страницы
2. Расчёт стоимости (`calculator_submit`)
3. Оформление заявки (`order_form_submit`)

**Воронка "Трудоустройство":**
1. Посещение страницы вакансий (`vacancies_page_view`)
2. Открытие вакансии (`vacancy_opened`)
3. Отклик на вакансию (`vacancy_apply`)

---

## Яндекс Директ - Настройка

### Рекомендуемые рекламные кампании

#### 1. Поисковая кампания "Доставка грузов"
**Ключевые слова:**
- доставка грузов москва
- курьерская доставка по городу
- срочная доставка грузов
- доставка посылок по россии
- транспортная компания доставка
- междугородняя доставка грузов
- доставка документов курьером
- экспресс доставка грузов
- доставка товаров из магазина
- грузоперевозки по городу

**Минус-слова:**
- бесплатно
- своими руками
- самостоятельно
- скачать
- реферат
- курсовая

#### 2. Поисковая кампания "Работа курьером"
**Ключевые слова:**
- работа курьером москва
- вакансии курьер
- работа доставка
- курьер вакансии без опыта
- работа курьером на своем авто
- подработка курьером
- работа пешим курьером
- вакансии водитель курьер
- работа курьером ежедневные выплаты
- курьер на авто вакансии

#### 3. РСЯ кампания "Ретаргетинг"
**Сегменты аудитории:**
- Посетители сайта (не завершившие заявку)
- Посетители страницы калькулятора
- Посетители страницы вакансий

### UTM-метки для Директа

```
?utm_source=yandex&utm_medium=cpc&utm_campaign={campaign_id}&utm_content={ad_id}&utm_term={keyword}
```

### Настройка конверсий в Директе

1. Перейдите в Яндекс Директ → Настройки → Счётчики
2. Привяжите счётчик Метрики: 109455099
3. Выберите цели для оптимизации:
   - Основная: `order_form_submit` (Оформление заявки)
   - Дополнительная: `calculator_submit` (Расчёт стоимости)
   - Для вакансий: `vacancy_apply` (Отклик на вакансию)

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

- [ ] Установлены уникальные `ADMIN_SECRET` и `JWT_SECRET` (сгенерированы через `openssl rand -base64 32`)
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
- SQL Injection: параметризованные запросы + whitelist колонок
- XSS: заголовки безопасности в Nginx и Next.js
- CSRF: проверка Origin/Referer (рекомендуется добавить токены)

### Бэкап базы данных

```bash
# Ручной бэкап
cp /var/www/kurierhub/data/chat.db /backup/chat_$(date +%Y%m%d_%H%M%S).db

# Автоматический бэкап (cron)
# Добавьте в crontab -e:
0 3 * * * cp /var/www/kurierhub/data/chat.db /backup/chat_$(date +\%Y\%m\%d).db

# С Docker
docker cp kurierhub:/app/data/chat.db /backup/chat_$(date +%Y%m%d_%H%M%S).db
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

# Проверьте права на папку data
ls -la /var/www/kurierhub/data/
sudo chown -R www-data:www-data /var/www/kurierhub/data/
```

### Ошибка "better-sqlite3" при сборке

```bash
# Пересоберите native модули
npm rebuild better-sqlite3

# Или удалите и переустановите
rm -rf node_modules
pnpm install
```

### Ошибка доступа к админке

```bash
# Пересоздайте администратора
node scripts/create-admin.mjs newadmin НовыйПароль123! admin

# Проверьте базу данных
sqlite3 data/chat.db "SELECT id, username, role FROM admin_users;"
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
