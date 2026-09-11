import './fool.css'
import { getTarotCards } from './airtableData.js'
import O_TarotCardInfo_CardOfTheDay from './components/O_TarotCardInfo_CardOfTheDay/O_TarotCardInfo_CardOfTheDay.jsx'
import { sample } from './lib/content.cjs'
import { ready, renderInto } from './lib/dom.js'

ready(async () => {
  const button = document.querySelector('.A_AccentButtonTarotTellings')
  const result = document.querySelector('.O_ContentFortuneTelling')
  if (!button || !result) return
  const [card] = sample(await getTarotCards(), 1)
  if (!card) return
  renderInto(
    '.CardContainer_CardOfTheDay',
    <O_TarotCardInfo_CardOfTheDay tarotCard={card} {...card} />
  )
  button.addEventListener(
    'click',
    () => {
      button.classList.add('NotShowing')
      result.classList.remove('NotShowing')
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'Click', {
          event_category: 'Button',
          event_label: 'CardOfTheDay'
        })
      }
    },
    { once: true }
  )
})
