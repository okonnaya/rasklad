import './M_ArticleCard.scss'
import { plainText } from '../../lib/content.cjs'
export default function M_ArticleCard({ link, title, description, image }) {
  return (
    <a href={link}>
      <div className="M_CardArticle">
        <div
          className="A_CardArticleImage"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="Q_CardArticlesImageGradient" />
        </div>
        <div className="A_Heading5">{plainText(title)}</div>
        <div className="A_Paragraph Center">{plainText(description)}</div>
      </div>
    </a>
  )
}
