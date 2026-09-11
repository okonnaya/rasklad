// Public pages and their entry points. Card pages are generated from the content catalogue.
module.exports = {
  'index.html': ['index', 'menu', 'mouseeventcard'],
  'pages/page.html': ['page', 'menu'],
  'articles.html': ['articles', 'menu'],
  'search.html': ['search', 'menu'],
  'fortunetellings/family.html': ['fortunetelling', 'menu', 'reading'],
  'fortunetellings/love.html': ['fortunetelling', 'menu', 'reading'],
  'fortunetellings/future.html': ['fortunetelling', 'menu', 'reading'],
  'fortunetellings/cardoftheday.html': [
    'fortunetelling',
    'menu',
    'cardoftheday'
  ],
  'fortunetellings.html': ['fortunetelling', 'menu', 'fortuneTellings'],
  'platform.html': ['menu'],
  'about.html': ['menu', 'mouseeventcard', 'about'],
  'styleguide.html': ['styleguide', 'menu'],
  'cards.html': ['menu', 'articles', 'cards'],
  'articlescompilations/lovecompilation.html': ['menu', 'articles'],
  'articles/waiteTarot.html': ['articles', 'menu'],
  'articles/foursInTarot.html': ['articles', 'menu'],
  'articles/yourFirstTarotCards.html': ['articles', 'menu']
}
