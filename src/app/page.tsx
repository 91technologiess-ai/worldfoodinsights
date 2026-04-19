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
  const sideArticles = (featuredData.slice(1, 4).length > 0 ? featuredData.slice(1, 4) : articlesData.slice(1, 4)) as any[]
  const latestArticles = articlesData as any[]

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f4f4f4" }}>
      {breakingData.length > 0 && <BreakingNewsTicker items={breakingData as any[]} />}

      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdZone zone="header" className="mb-4" />

        {/* Hero Section */}
        {heroArticle && (
          <section className="mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <ArticleCard article={heroArticle} size="large" />
              </div>
              <div className="flex flex-col gap-3">
                {sideArticles.map((article: any) => (
                  <ArticleCard key={article.id} article={article} size="small" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category Pills */}
        {categoriesData.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {(categoriesData as any[]).map((cat: any) => (
              <Link
                key={cat.id}
                href={"/category/" + cat.slug}
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-white hover:opacity-80 transition-opacity"
                style={{ backgroundColor: cat.color }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Main Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Articles Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-gray-900 border-l-4 border-red-600 pl-3">
                Latest News
              </h2>
            </div>

            {latestArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {latestArticles.map((article: any) => (
                  <ArticleCard key={article.id} article={article} size="medium" />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No articles yet</h3>
                <p className="text-gray-500 text-sm mb-4">Start publishing from the admin panel</p>
                <Link href="/admin" className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 font-medium text-sm">
                  Go to Admin
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <AdZone zone="sidebar_top" />

            {/* Categories Widget */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="bg-red-600 px-4 py-3">
                <h3 className="font-bold text-white text-sm uppercase tracking-wide">Browse Categories</h3>
              </div>
              <ul className="divide-y divide-gray-50">
                {(categoriesData as any[]).map((cat: any) => (
                  <li key={cat.id}>
                    <Link
                      href={"/category/" + cat.slug}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                    >
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm text-gray-700 group-hover:text-red-600 font-medium transition-colors">
                        {cat.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <AdZone zone="sidebar_bottom" />
          </div>
        </div>

        <AdZone zone="footer" className="mt-6" />
      </div>
    </div>
  )
}