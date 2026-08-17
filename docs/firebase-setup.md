# Firebase для ALAS

Проект: `alas-cbc4d`.

## 1. Переменные окружения

Локально — `.env.local` (в `.gitignore`). На Vercel добавьте все `NEXT_PUBLIC_FIREBASE_*`, затем Redeploy.

Опционально для уведомлений владельцу:

```
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Как получить: [@BotFather](https://t.me/BotFather) → создать бота → токен. Написать боту `/start`, затем узнать `chat_id` через `https://api.telegram.org/bot<TOKEN>/getUpdates`.

Веб-`apiKey` попадает в браузер — так устроен Firebase Web SDK. Защита данных — через **Firestore Security Rules**.

## 2. Firestore + Rules

1. Console → Firestore → Create database (production).
2. Rules → содержимое `firestore.rules` → Publish.

## 3. Auth для `/admin`

1. Console → Authentication → Sign-in method → Email/Password → Enable.
2. Users → Add user (ваш email/пароль).
3. Откройте `https://ваш-домен/admin`.

Админка: заявки и статусы, цены, слоты Hero + дни в `slots`, публикация отзывов/кейсов. В `robots.txt` путь `/admin` закрыт.

## 4. Документы данных

### `settings/slots` — Hero «N из M»

```json
{
  "free": 3,
  "total": 14,
  "times": ["09:00", "11:00", "13:00", "15:00", "17:00"],
  "dayCount": 7
}
```

### Коллекция `slots` — дни в форме брони

Документ:

```json
{
  "date": "2026-08-20",
  "times": ["09:00", "11:00", "15:00"],
  "available": true
}
```

Если коллекция пуста — даты считаются локально на 7 дней вперёд.

### `settings/pricing` — тарифы (фолбэк: `src/lib/pricing.ts`)

```json
{
  "wet": 650,
  "general": 650,
  "postRepair": 800,
  "balconyFlat": 5000,
  "balconyStandardM2": 6,
  "alastauOptionPrice": null
}
```

### `bookings` — заявки с сайта

Пишет `POST /api/booking`. Параллельно клиент открывает WhatsApp; падение Firestore не блокирует бронь.

### `reviews` / `cases`

Публикуются из `/admin` (`published: true`). Опубликованные отзывы подхватывает блок соцдоказательств.

## 5. Критерии приёмки задачи 8

| Критерий | Статус |
| --- | --- |
| Заявка в Firestore | да, `/api/booking` |
| Уведомление владельцу | Telegram, если заданы env |
| WhatsApp при сбое Firestore | да, fire-and-forget |
| Слоты не из константы | `/api/slots` + фолбэк |
| Цены из settings | `/api/settings/pricing` + фолбэк |
| Админка | `/admin` + Auth |
