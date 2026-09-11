import './A_MenuLogo.scss'
import logo from '../../images/A_Logo.svg'
export default function A_MenuLogo({ url }) {
  return (
    <a className="A_MenuLogo" href={url} aria-label="Расклад — на главную">
      <img src={logo} alt="Расклад" />
    </a>
  )
}
