import { getArticleBySlug } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import AdZone from "@/components/ui/AdZone"
import Link from "next/link"
import ShareButtons from "@/components/article/ShareButtons"

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug).catch(() => null)
  if (!article) return { title: "Not Found" }
  return {
    title: article.title,
    description: article.excerpt,
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug).catch(() => null)
  if (!article) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <article className="lg:col-span-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-red-600">Home</Link>
            <span>/</span>
            {article.categories && (
              <>
                <Link href={"/category/" + article.categories.slug} className="hover:text-red-600">
                  {article.categories.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-400 truncate">{article.title}</span>
          </nav>

          {article.categories && (
            <Link href={"/category/" + article.categories.slug}>
              <span
                className="inline-block text-white text-xs font-bold px-3 py-1 rounded mb-4"
                style={{ backgroundColor: article.categories.color }}
              >
                {article.categories.name}
              </span>
            </Link>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
            {article.authors && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">
                  {article.authors.name.charAt(0)}
                </div>
                <span className="font-medium">{article.authors.name}</span>
              </div>
            )}
            <span>{formatDate(article.published_at || article.created_at)}</span>
            <span>{article.views || 0} views</span>
          </div>

          {article.featured_image && (
            <div className="mb-6 rounded-xl overflow-hidden">
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          {article.excerpt && (
            <p className="text-lg text-gray-600 leading-relaxed mb-6 font-medium border-l-4 border-red-500 pl-4 italic">
              {article.excerpt}
            </p>
          )}

          <AdZone zone="in_article" className="my-6" />

          <div
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content || "" }}
          />

          <ShareButtons slug={article.slug} title={article.title} />
        </article>

        <aside className="lg:col-span-1 space-y-6">
          <AdZone zone="sidebar_top" />
          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <h3 className="font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              Categories
            </h3>
            <ul className="space-y-1">
              {["World News","Trending","Business","My India","Food Tech","Recipes","Healthy Tips","Chef"].map((cat) => (
                <li key={cat}>
                  <Link
                    href={"/category/" + cat.toLowerCase().replace(" ", "-")}
                    className="block text-sm text-gray-600 hover:text-red-600 py-1"
                  >
                    {cat}
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
