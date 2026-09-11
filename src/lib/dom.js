import { createRoot } from 'react-dom/client'

const roots = new WeakMap()

export function ready(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true })
  } else callback()
}

export function renderInto(selector, element) {
  const container = document.querySelector(selector)
  if (!container) return
  if (!roots.has(container)) roots.set(container, createRoot(container))
  roots.get(container).render(element)
}
