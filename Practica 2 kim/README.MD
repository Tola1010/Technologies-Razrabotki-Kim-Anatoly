# Практическая работа №2 — CSS, адаптивная вёрстка и SCSS

## Описание
Адаптивный каталог на HTML и SCSS. Фильтры слева, карточки справа,
на мобильном фильтры переносятся наверх. Данные из `data/catalog.csv`,
цвета и размеры — из `data/theme.json`.

## Технологии
- HTML5 (семантическая разметка)
- CSS Grid + Flexbox
- SCSS (переменные, вложенность, миксины, partial-файлы)

## Структура
- index.html — разметка
- scss/ — исходники SCSS
  - styles.scss — главный файл
  - _variables.scss — переменные
  - _mixins.scss — миксины
  - _base.scss — базовые стили
  - _layout.scss — Grid-сетка
  - _components.scss — карточки, кнопки, фильтры
- css/styles.css — скомпилированный CSS
- data/ — catalog.csv, theme.json
- images/ — SVG

## Установка
1. Установить Node.js
2. Установить Sass:
   ```bash
   npm install -g sass