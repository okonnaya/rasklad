import './A_MenuMobileToggle.scss'
export default function A_MenuMobileToggle({ onClick, expanded }) {
  return (
    <button
      type="button"
      className="A_MenuMobileToggle"
      aria-label="Меню"
      aria-expanded={expanded}
      aria-controls="site-navigation"
      onClick={onClick}
    >
      <div />
      <div />
      <div />
    </button>
  )
}
