import { getArticles, getFeaturedArticles, getBreakingNews, getCategories } from "@/lib/api"
import ArticleCard from "@/components/article/ArticleCard"
import BreakingNewsTicker from "@/components/layout/BreakingNewsTicker"
import AdZone from "@/components/ui/AdZone"
import Link from "next/link"

export const revalidate = 60

export default async function HomePage() {
  const [articles, featured, breaking, categories] = await Promise.allSettled([
    getArticles(12),
    getFeaturedArticles(5),
    getBreakingNews(),
    getCategories(),
  ])

  const articlesData = articles.status === "fulfilled" ? articles.value || [] : []
  const featuredData = featured.status === "fulfilled" ? featured.value || [] : []
  const breakingData = breaking.status === "fulfilled" ? breaking.value || [] : []
  const categoriesData = categories.status === "fulfilled" ? categories.value || [] : []

  const heroArticle = featuredData[0] || articlesData[0]
  const sideArticles = featuredData.slice(1, 4) || articlesData.slice(1, 4)
  const latestArticles = articlesData.slice(0, 12)

  return (
    <div>
      {breakingData.length > 0 && <BreakingNewsTicker items={breakingData} />}

      <AdZone zone="header" className="max-w-7xl mx-auto px-4 py-3" />

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Hero Section */}
        {heroArticle && (
          <section className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ArticleCard article={heroArticle} size="large" />
              </div>
              <div className="flex flex-col gap-4">
                {sideArticles.map((article: any) => (
                  <ArticleCard key={article.id} article={article} size="small" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category Pills */}
        {categoriesData.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-8">
            {categoriesData.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="px-4 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: cat.color }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Latest News Grid + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-red-600">
              Latest News
            </h2>
            {latestArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {latestArticles.map((article: any) => (
                  <ArticleCard key={article.id} article={article} size="medium" />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold mb-2">No articles yet</h3>
                <p className="text-sm">Start publishing from the admin panel</p>
                <Link href="/admin" className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                  Go to Admin
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <AdZone zone="sidebar_top" />
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Categories</h3>
              <ul className="space-y-2">
                {categoriesData.map((cat: any) => (
                  <li key={cat.id}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors py-1"
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <AdZone zone="sidebar_bottom" />
          </div>
        </div>
      </div>

      <AdZone zone="footer" className="max-w-7xl mx-auto px-4 pb-6" />
    </div>
  )
}
