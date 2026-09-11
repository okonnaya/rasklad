import './O_BlockOfTarotCards.scss'
import M_TarotCard from '../M_TarotCard/M_TarotCard.jsx'
export default function O_BlockOfTarotCards({ data }) {
  return (
    <div className="O_BlockOfTarotCards">
      {data.map((card) => (
        <M_TarotCard key={card.id} {...card} />
      ))}
    </div>
  )
}
