import { getArticleBySlug, getArticles } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import AdZone from "@/components/ui/AdZone"
import Link from "next/link"

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug).catch(() => null)
  if (!article) return { title: "Not Found" }
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.featured_image ? [{ url: article.featured_image }] : [],
      type: "article",
      publishedTime: article.published_at,
    },
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug).catch(() => null)
  if (!article) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.featured_image ? [article.featured_image] : [],
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: article.authors ? [{ "@type": "Person", name: article.authors.name }] : [],
    publisher: {
      "@type": "Organization",
      name: "World Food Insights",
      logo: { "@type": "ImageObject", url: "https://worldfoodinsights.com/logo.png" }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://worldfoodinsights.com/" + article.slug
    }
  }

  const twitterUrl = "https://twitter.com/intent/tweet?text=" +
    encodeURIComponent(article.title) +
    "&url=" +
    encodeURIComponent("https://worldfoodinsights.com/" + article.slug)

  const facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=" +
    encodeURIComponent("https://worldfoodinsights.com/" + article.slug)

  const whatsappUrl = "https://api.whatsapp.com/send?text=" +
    encodeURIComponent(article.title + " https://worldfoodinsights.com/" + article.slug)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <article className="lg:col-span-3">

          {/* Breadcrumb */}
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

          {/* Category badge */}
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

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {article.title}
          </h1>

          {/* Meta */}
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

          {/* Featured image */}
          {article.featured_image && (
            <div className="mb-6 rounded-xl overflow-hidden">
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-lg text-gray-600 leading-relaxed mb-6 font-medium border-l-4 border-red-500 pl-4 italic">
              {article.excerpt}
            </p>
          )}

          {/* In-article ad */}
          <AdZone zone="in_article" className="my-6" />

          {/* Content */}
          <div
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content || "" }}
          />

          {/* Share buttons */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-500">Share:</span>
              
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-500 text-white text-xs px-3 py-1.5 rounded hover:bg-sky-600"
              >
                Twitter
              </a>
              
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700"
              >
                Facebook
              </a>
              
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white text-xs px-3 py-1.5 rounded hover:bg-green-600"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </article>

        {/* Sidebar */}
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