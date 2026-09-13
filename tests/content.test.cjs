const test = require('node:test')
const assert = require('node:assert/strict')
const {
  plainText,
  searchContent,
  sample,
  contentLink
} = require('../src/lib/content.cjs')
const cards = require('../src/data/tarotCards.json')
const articles = require('../src/data/articles.json')
const tellings = require('../src/data/fortuneTellings.json')

test('search works with actual records missing optional similarWords', () => {
  const result = searchContent([...cards, ...articles, ...tellings], 'ДУРАК')
  assert.ok(result.some((card) => card.htmlname === 'fool'))
})
test('search normalizes Cyrillic, nonbreaking spaces, entities and missing fields', () => {
  assert.deepEqual(
    searchContent(
      [{ id: 'article1', title: 'Четвёрки&nbsp;в колоде' }],
      'четверки в'
    ),
    [{ id: 'article1', title: 'Четвёрки&nbsp;в колоде' }]
  )
  assert.deepEqual(searchContent([{ id: 'empty' }], 'карта'), [])
  assert.deepEqual(searchContent(cards, '  '), [])
})
test('content text retains line breaks without rendering HTML', () => {
  assert.equal(plainText('а&nbsp;б<br>в &amp; г'), 'а\u00a0б\nв & г')
})
test('random cards do not repeat or modify the catalogue and handle small lists', () => {
  const original = [1, 2, 3]
  assert.deepEqual(
    sample(original, 5, () => 0),
    [1, 2, 3]
  )
  assert.deepEqual(original, [1, 2, 3])
  assert.deepEqual(sample([], 3), [])
  assert.equal(new Set(sample(cards, 78)).size, 78)
})
test('all generated card links target existing source pages', () => {
  const fs = require('node:fs')
  const path = require('node:path')
  for (const item of [...cards, ...articles, ...tellings]) {
    const link = contentLink(item)
    assert.ok(!link.endsWith('.html'))
    assert.ok(
      fs.existsSync(path.join(__dirname, '../src', link + '.html')),
      `${item.id}: ${link}`
    )
  }
})
