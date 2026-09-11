import './A_TarotCardImage.scss'
export default function A_TarotCardImage({ image, alt = '' }) {
  return (
    <img
      src={image}
      className="A_TarotCardImage"
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  )
}
