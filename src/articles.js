import './articles.css'

function initFilter() {
  const container = document.getElementById('W_AllArticleCards')
  if (!container) return
  const filters = [...document.querySelectorAll('.A_Heading3[data-type]')]
  for (const filter of filters) {
    filter.addEventListener('click', () => {
      filters.forEach((item) =>
        item.classList.toggle('Underlined', item === filter)
      )
      for (const card of container.children) {
        card.classList.toggle(
          'NotShowing',
          !(card.dataset.category || '').includes(filter.dataset.type)
        )
      }
    })
  }
}

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', initFilter, { once: true })
else initFilter()
