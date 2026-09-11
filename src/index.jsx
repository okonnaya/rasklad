import './index.css'
import O_BlockOfTarotCards from './components/O_BlockOfTarotCards/O_BlockOfTarotCards.jsx'
import O_BlockOfArticles from './components/O_BlockOfArticles/O_BlockOfArticles.jsx'
import { getArticles, getTarotCatalog } from './airtableData.js'
import { sample } from './lib/content.cjs'
import { ready, renderInto } from './lib/dom.js'

ready(async () => {
  const cardCount = matchMedia('(min-width: 768px) and (max-width: 1279px)')
    .matches
    ? 3
    : 4
  const articleCount = matchMedia('(max-width: 1279px)').matches ? 2 : 3
  const [cards, articles] = await Promise.all([
    getTarotCatalog(),
    getArticles()
  ])
  renderInto(
    '.W_FortuneTellings',
    <div>
      <O_BlockOfTarotCards data={sample(cards, cardCount)} />
    </div>
  )
  renderInto(
    '.W_ArticleCardsIndex',
    <div>
      <O_BlockOfArticles data={sample(articles, articleCount)} />
    </div>
  )
})
