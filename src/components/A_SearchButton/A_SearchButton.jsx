import './A_SearchButton.scss'
export default function A_SearchButton({ handleClick }) {
  return (
    <button
      type="button"
      className="A_SearchButton"
      aria-label="Найти"
      onClick={handleClick}
    />
  )
}
