import { getArticlesByCategory, getCategories } from "@/lib/api"
import ArticleCard from "@/components/article/ArticleCard"
import AdZone from "@/components/ui/AdZone"
import Link from "next/link"
import { notFound } from "next/navigation"

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const categories = await getCategories().catch(() => [])
  const category = categories?.find((c: any) => c.slug === params.slug)
  if (!category) return { title: "Category Not Found" }
  return {
    title: `${category.name} - World Food Insights`,
    description: category.description || `Latest ${category.name} news and updates`,
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categories = await getCategories().catch(() => [])
  const category = categories?.find((c: any) => c.slug === params.slug)
  if (!category) notFound()

  const articles = await getArticlesByCategory(params.slug, 20).catch(() => [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category Header */}
      <div
        className="rounded-xl p-8 mb-8 text-white"
        style={{ backgroundColor: category.color || "#E63946" }}
      >
        <nav className="flex items-center gap-2 text-sm text-white/70 mb-3">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span>{category.name}</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-white/80 text-lg">{category.description}</p>
        )}
        <p className="text-white/60 text-sm mt-2">{articles?.length || 0} articles</p>
      </div>

      <AdZone zone="header" className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Articles Grid */}
        <div className="lg:col-span-3">
          {articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {articles.map((article: any) => (
                <ArticleCard key={article.id} article={article} size="medium" />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold mb-2">No articles yet</h3>
              <p className="text-sm">Check back soon for {category.name} updates</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <AdZone zone="sidebar_top" />
          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <h3 className="font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              All Categories
            </h3>
            <ul className="space-y-1">
              {categories?.map((cat: any) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className={`flex items-center gap-2 text-sm py-1.5 transition-colors ${
                      cat.slug === params.slug
                        ? "text-red-600 font-medium"
                        : "text-gray-600 hover:text-red-600"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <AdZone zone="sidebar_bottom" />
        </aside>
      </div>
    </div>
  )
}