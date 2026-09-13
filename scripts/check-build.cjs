const fs = require('node:fs')
const path = require('node:path')
const zlib = require('node:zlib')
const assert = require('node:assert/strict')
const root = path.resolve(__dirname, '../docs')
const files = fs.readdirSync(root, { recursive: true })
const pages = files.filter(
  (file) => file.endsWith('.html') && file !== 'yandex_8174516e8ad894de.html'
)
const failures = []
const brokenLinks = []
const report = {}
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8')
  const scripts = []
  for (const match of html.matchAll(
    /<(script|img|link|a)\b[^>]*?\b(src|href)="([^"]+)"[^>]*>/g
  )) {
    const [, tag, , ref] = match
    if (/^(?:https?:|data:|mailto:|tel:|#|javascript:)/.test(ref)) continue
    const url = new URL(ref.replace(/&amp;/g, '&'), `https://local/${page}`)
    if (tag === 'a')
      assert.ok(
        !url.pathname.endsWith('.html'),
        `${page}: legacy page link ${ref}`
      )
    let local = path.join(root, decodeURIComponent(url.pathname))
    if (tag === 'a' && !path.extname(url.pathname) && url.pathname !== '/') {
      local += '.html'
    }
    if (url.pathname.endsWith('/')) local = path.join(local, 'index.html')
    if (!fs.existsSync(local))
      (tag === 'a' ? brokenLinks : failures).push(`${page}: ${ref}`)
    else if (tag === 'script') scripts.push(local)
  }
  let bytes = 0,
    gzip = 0
  for (const file of new Set(scripts)) {
    const data = fs.readFileSync(file)
    bytes += data.length
    gzip += zlib.gzipSync(data).length
  }
  report[page] = { bytes, gzip, scripts: scripts.length }
  if (html.includes('O_Footer')) {
    for (const label of ['hse adc', 'настя м.', 'карина р.', 'маша в.'])
      assert.ok(html.includes(label), `${page}: footer missing ${label}`)
    assert.ok(!html.includes('code.jquery.com'), `${page}: unused jQuery`)
  }
}
assert.equal(pages.length, 97, 'Public HTML routes must be preserved')
for (const file of files.filter((file) => file.endsWith('.css'))) {
  const css = fs.readFileSync(path.join(root, file), 'utf8')
  for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    if (/^(?:data:|https?:|#)/.test(match[1])) continue
    const url = new URL(match[1], `https://local/${file}`)
    if (!fs.existsSync(path.join(root, decodeURIComponent(url.pathname)))) {
      failures.push(`${file}: ${match[1]}`)
    }
  }
}
assert.deepEqual(failures, [], 'Missing page resources')
fs.writeFileSync(
  path.resolve(__dirname, '../maintenance/bundle-sizes.json'),
  JSON.stringify(report, null, 2) + '\n'
)
console.log(
  `Verified ${pages.length} pages and their script/image/stylesheet references.`
)
assert.deepEqual(brokenLinks, [], 'Missing internal link destinations')
for (const page of [
  'index.html',
  'cards.html',
  'search.html',
  'cards/fool.html'
])
  console.log(page, report[page])
