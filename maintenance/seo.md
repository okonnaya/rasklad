# Базовая SEO-настройка

- Метаданные 95 страниц создаются в `build/seo.cjs` во время сборки: уникальные title и description, canonical на HTTPS-домене raskladik.com, Open Graph и Twitter.
- Заголовки карт и статей берутся из каталога проекта. Canonical главной — `/`, без `index.html` и параметров запроса.
- `sitemap.xml` содержит 91 индексируемую страницу, без старых адресов-перенаправлений.
- Поиск, платформа, стайлгайд и учебная страница получают `noindex,follow`. Robots.txt не блокирует обход этих страниц, чтобы поисковики могли прочитать noindex.
- Проверка `scripts/check_seo.py` включена в `npm run check:build`: единственность метатегов, уникальность title, соответствие canonical и sitemap, наличие картинки для превью.

Настройка не отправляет сайт в Google Search Console или Яндекс Вебмастер. Добавить sitemap в кабинеты можно отдельно. Толкования карт по-прежнему отображаются JavaScript; серверный рендеринг в минимальную настройку не входит.

Основания: [заголовки Google Search](https://developers.google.com/search/docs/appearance/title-link), [canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
