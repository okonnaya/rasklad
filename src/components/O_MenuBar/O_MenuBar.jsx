import { useState } from 'react'
import './O_MenuBar.scss'
import classnames from 'classnames'
import A_MenuElement from '../A_MenuElement/A_MenuElement.jsx'
import M_SearchBar from '../M_SearchBar/M_SearchBar.jsx'
import A_MenuLogo from '../A_MenuLogo/A_MenuLogo.jsx'
import A_MenuMobileToggle from '../A_MenuMobileToggle/A_MenuMobileToggle.jsx'

const menu = [
  ['погадать', '/fortunetellings'],
  ['почитать', '/articles'],
  ['толкования карт', '/cards'],
  ['карта дня', '/fortunetellings/cardoftheday'],
  ['о нас', '/about']
]

export default function O_MenuBar() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [expanded, setExpanded] = useState(false)
  function submit() {
    if (query.trim().length >= 3)
      location.href = '/search?request=' + encodeURIComponent(query.trim())
  }
  return (
    <div className={classnames('O_MenuBar', { Expanded: expanded })}>
      <A_MenuMobileToggle
        onClick={() => setExpanded((value) => !value)}
        expanded={expanded}
      />
      <A_MenuLogo url="/" />
      <div
        id="site-navigation"
        className={classnames('M_MenuElements', { Shows: expanded })}
      >
        {menu
          .map(([text, url], index) => (
            <A_MenuElement
              key={url}
              text={text}
              url={url}
              wrapper={`W_MenuElement${index + 1}`}
            />
          ))
          .flatMap((element, index) =>
            index
              ? [
                  <div
                    key={`star-${index}`}
                    className="Q_MenuStar Black"
                    aria-hidden="true"
                  />,
                  element
                ]
              : [element]
          )}
      </div>
      <M_SearchBar
        isToggled={expanded}
        isFocused={focused}
        searchInputValue={query}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        handleSearchInput={setQuery}
        handleSearchSubmit={submit}
      />
    </div>
  )
}
