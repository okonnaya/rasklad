import O_BlockOfTarotCards from './components/O_BlockOfTarotCards/O_BlockOfTarotCards.jsx'
import { getTarotCatalog } from './airtableData.js'
import { ready, renderInto } from './lib/dom.js'

ready(async () => {
  const cards = await getTarotCatalog()
  for (const [selector, arcana] of Object.entries({
    '.Major': 'major',
    '.Swords': 'swords',
    '.Cups': 'cups',
    '.Wands': 'wands',
    '.Pentacles': 'pentacles'
  })) {
    renderInto(
      selector,
      <div>
        <O_BlockOfTarotCards
          data={cards.filter((card) => card.arcana === arcana)}
        />
      </div>
    )
  }
})
