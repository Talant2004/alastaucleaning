# Аналитика ALAS — чек-лист целей

Скрипты подключаются только если заданы env-переменные.
На Vercel: Project → Settings → Environment Variables → Redeploy.

## Переменные

| Переменная | Пример | Куда |
| --- | --- | --- |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Google Analytics 4 → Админ → Потоки данных |
| `NEXT_PUBLIC_YM_ID` | `12345678` | metrika.yandex.ru → счётчик |

## Цели в Яндекс.Метрике

Тип: **JavaScript-событие**. Идентификатор цели = имя события:

1. `whatsapp_click` — клик по WhatsApp (параметр `source`: header, hero, fab, mobile_bar, estimate, calc_fallback, alastau, faq, footer, final_cta)
2. `phone_click` — клик по телефону
3. `calc_start` — первое взаимодействие с калькулятором
4. `calc_extras_add` — добавление допа
5. `alastau_toggle` — тумблер обряда
6. `booking_submit` — подтверждение брони

В init уже включены: вебвизор, карта кликов, точный показатель отказов.

## Проверка

1. Открыть сайт с env.
2. Chrome DevTools → Network: запросы к `google-analytics` / `mc.yandex.ru`.
3. GA4 → Configure → DebugView (или расширение Google Analytics Debugger).
4. Метрика → Отчёты → Конверсии: после клика по WhatsApp должна появиться цель `whatsapp_click`.
