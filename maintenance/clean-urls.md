# Адреса без расширения

Публичные страницы используют `/cards`, `/cards/fool`, `/articles/waiteTarot` и другие адреса без `.html`. Файлы сборки остаются HTML: Nginx разрешает чистый адрес через `try_files`.

- Внутренние ссылки в HTML, меню и динамических карточках обновлены.
- Canonical, Open Graph URL и sitemap используют новые адреса.
- Старые запросы `.html` получают 301 с сохранением query string. `/index.html` перенаправляет на `/`.
- Файл Яндекс Вебмастера `yandex_8174516e8ad894de.html` доступен без перенаправления.
- Неизвестные страницы возвращают 404. Основные каталоги со слешем перенаправляются на адрес без слеша.
- `npm start` поддерживает новые адреса; простой файловый HTTP-сервер не умеет разрешать их без настройки маршрутизации.

Правила находятся в `deploy/nginx.conf`. Рекомендации: [постоянные серверные перенаправления Google](https://developers.google.com/search/docs/crawling-indexing/301-redirects), [try_files Nginx](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files).
