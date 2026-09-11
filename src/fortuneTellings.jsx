import O_BlockOfTarotCards from './components/O_BlockOfTarotCards/O_BlockOfTarotCards.jsx'
import { getFortuneTellings } from './airtableData.js'
import { ready, renderInto } from './lib/dom.js'

ready(async () => {
  const data = await getFortuneTellings()
  renderInto(
    '.W_FortuneTellings',
    <div>
      <O_BlockOfTarotCards
        data={data.filter((item) => item.id === 'fortuneTelling3')}
      />
    </div>
  )
})
