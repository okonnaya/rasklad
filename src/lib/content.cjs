const ENTITIES = {
  nbsp: '\u00a0',
  amp: '&',
  quot: '"',
  apos: "'",
  lt: '<',
  gt: '>'
}

function plainText(value = '') {
  return String(value ?? '')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(
      /&(#x[\da-f]+|#\d+|nbsp|amp|quot|apos|lt|gt);/gi,
      (match, entity) => {
        if (entity[0] !== '#') return ENTITIES[entity.toLowerCase()] ?? match
        const code =
          entity[1].toLowerCase() === 'x'
            ? parseInt(entity.slice(2), 16)
            : Number(entity.slice(1))
        return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match
      }
    )
}

function normalizeSearch(value) {
  return plainText(value)
    .toLocaleLowerCase('ru')
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function searchContent(items, query) {
  const terms = normalizeSearch(query)
  if (terms.length < 3) return []
  return items.filter((item) => {
    const text = normalizeSearch(
      ['title', 'description', 'line1', 'line2', 'name', 'similarWords']
        .map((field) => item[field] ?? '')
        .join(' ')
    )
    return terms.split(' ').every((term) => text.includes(term))
  })
}

function sample(items, count, random = Math.random) {
  const pool = [...items]
  const result = []
  for (
    let i = 0;
    i < Math.min(Math.max(0, Math.floor(count)), items.length);
    i++
  ) {
    result.push(pool.splice(Math.floor(random() * pool.length), 1)[0])
  }
  return result
}

function contentLink(item) {
  if (item.id.startsWith('article')) return `/articles/${item.htmlPage}`
  if (item.id.startsWith('tarotCard')) return `/cards/${item.htmlname}`
  // Airtable's 'work' record has no corresponding published page yet.
  const pages = new Set(['love', 'family', 'future', 'cardoftheday'])
  return pages.has(item.htmlPage)
    ? `/fortunetellings/${item.htmlPage}`
    : '/fortunetellings'
}

module.exports = {
  plainText,
  normalizeSearch,
  searchContent,
  sample,
  contentLink
}
