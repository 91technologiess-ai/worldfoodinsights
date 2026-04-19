import Link from "next/link"
import Image from "next/image"
import { timeAgo, truncate } from "@/lib/utils"

interface ArticleCardProps {
  article: any
  size?: "small" | "medium" | "large"
}

export default function ArticleCard({ article, size = "medium" }: ArticleCardProps) {
  const isLarge = size === "large"
  const isSmall = size === "small"

  return (
    <article className={`group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 ${isLarge ? "md:flex" : ""}`}>
      <Link href={`/${article.slug}`} className={`block overflow-hidden ${isLarge ? "md:w-2/5 flex-shrink-0" : ""}`}>
        <div className={`relative overflow-hidden ${isLarge ? "h-48 md:h-full" : isSmall ? "h-32" : "h-44"}`}>
          {article.featured_image ? (
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
          {article.is_breaking && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
              BREAKING
            </span>
          )}
          {article.categories && (
            <span
              className="absolute bottom-2 left-2 text-white text-xs px-2 py-1 rounded font-medium"
              style={{ backgroundColor: article.categories.color || "#E63946" }}
            >
              {article.categories.name}
            </span>
          )}
        </div>
      </Link>

      <div className={`p-4 flex flex-col justify-between ${isLarge ? "md:w-3/5" : ""}`}>
        <div>
          <Link href={`/${article.slug}`}>
            <h2 className={`font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug mb-2 ${isLarge ? "text-xl md:text-2xl" : isSmall ? "text-sm" : "text-base"}`}>
              {isSmall ? truncate(article.title, 80) : article.title}
            </h2>
          </Link>
          {!isSmall && article.excerpt && (
            <p className="text-gray-500 text-sm leading-relaxed mb-3">
              {truncate(article.excerpt, isLarge ? 180 : 120)}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            {article.authors && (
              <Link href={`/author/${article.authors.slug}`} className="hover:text-red-500 font-medium">
                {article.authors.name}
              </Link>
            )}
          </div>
          <span>{timeAgo(article.published_at || article.created_at)}</span>
        </div>
      </div>
    </article>
  )
}
