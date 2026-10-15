# Практическая работа №3 — Bootstrap 5, Bootstrap JS и JavaScript интерфейса

## Описание
Адаптивная панель на Bootstrap 5. Данные (показатели, строки, уведомления)
берутся из `data/dashboard.json` и `data/notifications.json` через fetch.

## Технологии
- HTML5 (семантическая разметка)
- Bootstrap 5.3 (CDN): CSS + bundle JS
- Собственный JavaScript (js/app.js)
- Собственный CSS (css/custom.css) — только поверх Bootstrap

## Структура
- `index.html` — разметка
- `css/custom.css` — свои стили
- `js/app.js` — собственный JS
- `data/dashboard.json`, `data/notifications.json` — источник данных
- `images/avatar.svg`, `images/chart.svg` — изображения

## Запуск
Проект статический. Достаточно открыть `index.html` в браузере.
**Важно:** fetch() не работает при открытии через `file://`.
Используйте локальный сервер:
```bash
python -m http.server 8000
# затем откройте http://localhost:8000