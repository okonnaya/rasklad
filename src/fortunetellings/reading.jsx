import { getTarotCatalog } from '../airtableData.js'
import M_FortuneTellingReading from '../components/M_FortuneTellingReading/M_FortuneTellingReading.jsx'
import O_ThreeCards from '../components/O_ThreeCards/O_ThreeCards.jsx'
import { sample } from '../lib/content.cjs'
import { ready, renderInto } from '../lib/dom.js'

// Preserve the existing editorial copy shared by these three pages.
const telling =
  'сессия всегда сопряжена с трудностями. здесь ты можешь получить своё экспресс-гадание. просто нажми на кнопку и получи расклад с кратким описанием. помни, что главное — чтобы расклад тебе откликался. сессия всегда сопряжена с трудностями. здесь ты можешь получить своё экспресс-гадание. просто нажми на кнопку и получи расклад с кратким описанием. помни, что главное — чтобы расклад тебе откликался. сессия всегда сопряжена с трудностями. здесь ты можешь получить своё экспресс-гадание. просто нажми на кнопку и получи расклад с кратким описанием. помни, что главное — чтобы расклад тебе откликался'

ready(async () => {
  renderInto(
    '.W_FortuneTellingResult',
    <M_FortuneTellingReading telling={telling} />
  )
  const cards = sample(await getTarotCatalog(), 3)
  renderInto(
    '.W_ContentTarotReading',
    <div>
      <O_ThreeCards data={cards} />
    </div>
  )
})
