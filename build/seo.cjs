const HtmlWebpackPlugin = require('html-webpack-plugin')
const { plainText } = require('../src/lib/content.cjs')
const cards = require('../src/data/tarotCards.json')
const articles = require('../src/data/articles.json')
const origin = 'https://raskladik.com'
const excluded = new Set([
  'search.html',
  'platform.html',
  'styleguide.html',
  'pages/page.html'
])
const pages = {
  'index.html': [
    'Расклад — карты таро, онлайн-расклады и статьи',
    'Медиа о таро: значения 78 карт, карта дня, онлайн-расклады и статьи о выборе колоды и культуре таро.'
  ],
  'cards.html': [
    'Значения карт таро: все 78 карт',
    'Справочник старших и младших арканов таро. Толкования карт в отношениях и работе, основные значения и советы.'
  ],
  'articles.html': [
    'Статьи о таро и выборе колоды',
    'Знакомимся с таро: как выбрать первую колоду, что такое таро Уэйта и как читать символы карт.'
  ],
  'fortunetellings.html': [
    'Онлайн-расклады на картах таро',
    'Выберите расклад таро: на любовь, семью или будущее. Вытяните карты и прочитайте их толкования.'
  ],
  'fortunetellings/cardoftheday.html': [
    'Карта дня таро онлайн',
    'Вытяните карту дня и прочитайте её значение, совет и подсказки для размышления о сегодняшнем дне.'
  ],
  'fortunetellings/family.html': [
    'Расклад таро на семью',
    'Онлайн-расклад на семью: вытяните карты таро и познакомьтесь с их значениями.'
  ],
  'fortunetellings/love.html': [
    'Расклад таро на любовь',
    'Онлайн-расклад на любовь и отношения: вытяните карты таро и прочитайте их толкования.'
  ],
  'fortunetellings/future.html': [
    'Расклад таро на будущее',
    'Онлайн-расклад на будущее: вытяните карты таро и прочитайте их значения и советы.'
  ],
  'about.html': [
    'О проекте «Расклад»',
    'Расклад — медиа о таро. Познакомьтесь с проектом, его идеей и авторами.'
  ],
  'articlescompilations/lovecompilation.html': [
    'Статьи о таро и отношениях',
    'Подборка материалов о таро и любви: романтические отношения, значения карт и вдохновение.'
  ],
  'search.html': [
    'Поиск по сайту',
    'Поиск карт таро, статей и раскладов в медиа «Расклад».'
  ],
  'platform.html': [
    'Платформа проекта',
    'Платформа и концепция медиа «Расклад».'
  ],
  'styleguide.html': [
    'Стиль проекта',
    'Руководство по визуальному стилю медиа «Расклад».'
  ],
  'pages/page.html': ['Страница проекта', 'Служебная страница медиа «Расклад».']
}
for (const card of cards) {
  const name = plainText(`${card.line1} ${card.line2 || ''}`).trim()
  pages[`cards/${card.htmlname}.html`] = [
    `${name[0].toUpperCase() + name.slice(1)} — значение карты таро`,
    `${name[0].toUpperCase() + name.slice(1)} в таро: основное значение, толкование в любви и работе, карта дня и совет.`
  ]
}
for (const article of articles) {
  const title = plainText(article.title)
  pages[`articles/${article.htmlPage}.html`] = [
    title[0].toUpperCase() + title.slice(1),
    plainText(article.description)
  ]
}
const escape = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
const url = (name) => origin + '/' + (name === 'index.html' ? '' : name)
class SeoPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('SeoPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap(
        'SeoPlugin',
        (data) => {
          const name = data.outputName
          if (!pages[name]) throw new Error(`Missing SEO metadata: ${name}`)
          const [baseTitle, description] = pages[name]
          const title =
            name === 'index.html' ? baseTitle : `${baseTitle} | Расклад`
          const canonical = url(name)
          data.html = data.html
            .replace(/<title>[\s\S]*?<\/title>/gi, '')
            .replace(
              /<meta\b[^>]*(?:name|property)=["'](?:title|description|og:[^"']+|twitter:[^"']+|robots)["'][^>]*>/gi,
              ''
            )
          const tags = `<title>${escape(title)}</title>
<meta name="description" content="${escape(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="${name.startsWith('articles/') ? 'article' : 'website'}">
<meta property="og:site_name" content="Расклад">
<meta property="og:locale" content="ru_RU">
<meta property="og:image" content="${origin}/share/metatags.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escape(title)}">
<meta name="twitter:description" content="${escape(description)}">
<meta name="twitter:image" content="${origin}/share/metatags.jpg">
${excluded.has(name) ? '<meta name="robots" content="noindex,follow">' : ''}`
          data.html = data.html.replace('</head>', tags + '</head>')
          return data
        }
      )
      compilation.hooks.processAssets.tap(
        {
          name: 'SeoPlugin',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
        },
        () => {
          const sitemap =
            '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
            Object.keys(pages)
              .filter((name) => !excluded.has(name))
              .sort()
              .map((name) => `<url><loc>${url(name)}</loc></url>`)
              .join('\n') +
            '\n</urlset>\n'
          compilation.emitAsset(
            'sitemap.xml',
            new compiler.webpack.sources.RawSource(sitemap)
          )
          compilation.emitAsset(
            'robots.txt',
            new compiler.webpack.sources.RawSource(
              `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
            )
          )
        }
      )
    })
  }
}
module.exports = SeoPlugin
