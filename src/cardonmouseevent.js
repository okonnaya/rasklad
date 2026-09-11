function initCanvas() {
  const canvas = document.getElementById('canvas')
  const image = document.getElementById('mousecard')
  const context = canvas?.getContext('2d')
  if (
    !context ||
    !image ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  )
    return
  const resize = () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
  }
  resize()
  window.addEventListener('resize', resize)
  let frame = null
  canvas.addEventListener('mousemove', (event) => {
    if (frame !== null || !image.complete || !image.naturalWidth) return
    const { offsetX, offsetY } = event
    frame = requestAnimationFrame(() => {
      context.drawImage(
        image,
        offsetX - canvas.width / 100,
        offsetY - canvas.height / 100,
        50,
        70
      )
      context.drawImage(
        image,
        canvas.width - offsetX - canvas.width / 100,
        offsetY - canvas.height / 100,
        50,
        70
      )
      frame = null
    })
  })
}
if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', initCanvas, { once: true })
else initCanvas()
