import './O_BlockOfArticles.scss'
import M_ArticleCard from '../M_ArticleCard/M_ArticleCard.jsx'
export default function O_BlockOfArticles({ data }) {
  return (
    <div className="O_BlockOfArticles">
      {data.map((article) => (
        <M_ArticleCard key={article.id} {...article} />
      ))}
    </div>
  )
}
