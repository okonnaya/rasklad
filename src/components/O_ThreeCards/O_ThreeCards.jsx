import { Fragment } from 'react'
import './O_ThreeCards.scss'
import M_TarotCard from '../M_TarotCard/M_TarotCard.jsx'
export default function O_ThreeCards({ data }) {
  return (
    <div className="O_ThreeCards">
      {data.slice(0, 3).map((card, index) => (
        <Fragment key={card.id}>
          {index > 0 && (
            <div className="Q_MenuStar Black Big" aria-hidden="true" />
          )}
          <M_TarotCard {...card} />
        </Fragment>
      ))}
    </div>
  )
}
