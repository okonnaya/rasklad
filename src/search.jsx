import './search.css'
import O_BlockOfTarotCards from './components/O_BlockOfTarotCards/O_BlockOfTarotCards.jsx'
import O_BlockOfArticles from './components/O_BlockOfArticles/O_BlockOfArticles.jsx'
import { getSearchData } from './airtableData.js'
import { normalizeSearch, searchContent } from './lib/content.cjs'
import { ready, renderInto } from './lib/dom.js'

ready(async () => {
  const input = document.querySelector('.M_Search .A_SearchInput')
  const button = document.querySelector('.M_Search .Q_SearchIcon')
  if (!input || !button) return
  const content = await getSearchData()
  const query = new URL(location.href).searchParams.get('request') || ''
  input.value = query

  function render(query) {
    const matches = searchContent(content, query)
    const groups = [
      [
        'article',
        '.W_FoundArticlesSection',
        '.C_FoundArticleCards',
        O_BlockOfArticles
      ],
      [
        'tarotCard',
        '.W_FoundTarotCardsSection',
        '.C_FoundTarotCards',
        O_BlockOfTarotCards
      ],
      [
        'fortuneTelling',
        '.W_FoundFortuneTellingsSection',
        '.C_FoundFortuneTellings',
        O_BlockOfTarotCards
      ]
    ]
    for (const [prefix, section, selector, Component] of groups) {
      const rows = matches.filter((item) => item.id.startsWith(prefix))
      document.querySelector(section).style.display = rows.length
        ? 'flex'
        : 'none'
      renderInto(selector, <Component data={rows} />)
    }
    document.querySelector('.M_NothingFound').style.display =
      query.trim() && !matches.length ? 'flex' : 'none'
  }

  function updateButton() {
    button.disabled = normalizeSearch(input.value).length < 3
    button.classList.toggle('disabled', button.disabled)
  }

  function submit() {
    updateButton()
    if (button.disabled) return
    const url = new URL(location.href)
    url.searchParams.set('request', input.value.trim())
    history.pushState(null, '', url)
    render(input.value)
  }

  input.addEventListener('input', updateButton)
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') submit()
  })
  button.addEventListener('click', submit)
  window.addEventListener('popstate', () => {
    input.value = new URL(location.href).searchParams.get('request') || ''
    updateButton()
    render(input.value)
  })
  updateButton()
  render(query)
})
