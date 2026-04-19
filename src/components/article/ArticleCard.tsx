import Link from "next/link"
import { timeAgo, truncate } from "@/lib/utils"

interface ArticleCardProps {
  article: any
  size?: "small" | "medium" | "large"
}

export default function ArticleCard({ article, size = "medium" }: ArticleCardProps) {
  const isLarge = size === "large"
  const isSmall = size === "small"

  if (isSmall) {
    return (
      <article className="flex gap-3 bg-white rounded-lg p-3 hover:shadow-sm transition-shadow border border-gray-100">
        <Link href={"/" + article.slug} className="flex-shrink-0">
          <div className="w-20 h-16 rounded-md overflow-hidden bg-gray-100">
            {article.featured_image ? (
              <img src={article.featured_image} alt={article.title}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-2xl">🍽️</div>
            )}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={"/" + article.slug}>
            <h3 className="text-sm font-semibold text-gray-900 leading-snug hover:text-red-600 transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>
          <p className="text-xs text-gray-400 mt-1">{timeAgo(article.published_at || article.created_at)}</p>
        </div>
      </article>
    )
  }

  if (isLarge) {
    return (
      <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
        <Link href={"/" + article.slug} className="block">
          <div className="relative h-64 md:h-80 overflow-hidden">
            {article.featured_image ? (
              <img src={article.featured_image} alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center text-6xl">🍽️</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {article.categories && (
              <span className="absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: article.categories.color }}>
                {article.categories.name}
              </span>
            )}
            {article.is_breaking && (
              <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
                BREAKING
              </span>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h2 className="text-xl md:text-2xl font-bold text-white leading-tight mb-2">
                {article.title}
              </h2>
              <div className="flex items-center gap-3 text-white/80 text-xs">
                {article.authors && <span className="font-medium">{article.authors.name}</span>}
                <span>{timeAgo(article.published_at || article.created_at)}</span>
              </div>
            </div>
          </div>
        </Link>
        {article.excerpt && (
          <div className="p-4">
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{article.excerpt}</p>
          </div>
        )}
      </article>
    )
  }

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group flex flex-col">
      <Link href={"/" + article.slug} className="block flex-shrink-0">
        <div className="relative h-48 overflow-hidden">
          {article.featured_image ? (
            <img src={article.featured_image} alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center text-4xl">🍽️</div>
          )}
          {article.categories && (
            <span className="absolute bottom-3 left-3 text-white text-xs font-bold px-2 py-1 rounded"
              style={{ backgroundColor: article.categories.color }}>
              {article.categories.name}
            </span>
          )}
          {article.is_breaking && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
              BREAKING
            </span>
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link href={"/" + article.slug}>
          <h2 className="font-bold text-gray-900 text-sm leading-snug mb-2 hover:text-red-600 transition-colors line-clamp-3 group-hover:text-red-600">
            {article.title}
          </h2>
        </Link>
        {article.excerpt && (
          <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2 flex-1">
            {truncate(article.excerpt, 100)}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-50">
          {article.authors && (
            <span className="font-medium text-gray-600 truncate max-w-[60%]">{article.authors.name}</span>
          )}
          <span className="flex-shrink-0">{timeAgo(article.published_at || article.created_at)}</span>
        </div>
      </div>
    </article>
  )
}