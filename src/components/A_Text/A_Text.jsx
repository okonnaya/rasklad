import { Fragment } from 'react'
import './A_Text.scss'
import { plainText } from '../../lib/content.cjs'
export default function A_Text({ texttype, text }) {
  const lines = plainText(text).split('\n')
  return (
    <div className="A_Text">
      <div className={texttype}>
        {lines.map((line, index) => (
          <Fragment key={index}>
            {index > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
