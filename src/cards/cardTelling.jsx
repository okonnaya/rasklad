import '../fool.css'
import { getTarotCards } from '../airtableData.js'
import O_TarotCardInfo from '../components/O_TarotCardInfo/O_TarotCardInfo.jsx'
import { ready, renderInto } from '../lib/dom.js'

ready(async () => {
  const filename = location.pathname
    .split('/')
    .pop()
    .replace(/\.html$/, '')
  const card = (await getTarotCards()).find(
    (item) => item.htmlname === filename
  )
  if (card)
    renderInto('.CardContainer', <O_TarotCardInfo tarotCard={card} {...card} />)
})
