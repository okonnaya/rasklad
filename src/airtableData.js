// The browser reads exported SQLite content; no Airtable request is made here.
import articles from './data/articles.json'
import fortuneTellings from './data/fortuneTellings.json'
import tarotCatalog from './data/tarotCatalog.json'
import { contentLink } from './lib/content.cjs'

// Restrict the asset context to images, excluding all content JSON files.
const images = require.context('./data', false, /\.(png|jpe?g|gif|webp|svg)$/i)
const prepare = (items) =>
  items.map((item) => ({
    ...item,
    link: contentLink(item),
    image: images(`./${item.image}`),
    color: item.color || 'pink',
    texttype: item.texttype || 'Emoji'
  }))

export const getArticles = () => Promise.resolve(prepare(articles))
export const getFortuneTellings = () =>
  Promise.resolve(prepare(fortuneTellings))
export const getTarotCatalog = () => Promise.resolve(prepare(tarotCatalog))
export const getTarotCards = async () => {
  const { default: tarotCards } = await import('./data/tarotCards.json')
  return prepare(tarotCards)
}
export const getSearchData = async () =>
  (
    await Promise.all([getArticles(), getFortuneTellings(), getTarotCatalog()])
  ).flat()
