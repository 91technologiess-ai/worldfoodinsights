"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchArticles()
  }, [filter])

  async function fetchArticles() {
    setLoading(true)
    let query = supabase
      .from("articles")
      .select("*, categories(name, color)")
      .order("created_at", { ascending: false })

    if (filter !== "all") {
      query = query.eq("status", filter)
    }

    const { data } = await query
    setArticles(data || [])
    setLoading(false)
  }

  async function deleteArticle(id: string) {
    if (!confirm("Are you sure you want to delete this article?")) return
    await supabase.from("articles").delete().eq("id", id)
    fetchArticles()
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "published" ? "draft" : "published"
    await supabase.from("articles").update({
      status: newStatus,
      published_at: newStatus === "published" ? new Date().toISOString() : null
    }).eq("id", id)
    fetchArticles()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm">← Dashboard</Link>
          <span className="text-gray-600">/</span>
          <span className="font-semibold">All Articles</span>
        </div>
        <Link
          href="/admin/articles/new"
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
        >
          + New Article
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {["all", "published", "draft"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading articles...</div>
          ) : articles.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">📰</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No articles yet</h3>
              <p className="text-gray-400 mb-4">Start by writing your first article</p>
              <Link
                href="/admin/articles/new"
                className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-red-700"
              >
                Write First Article
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Article</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        {article.featured_image && (
                          <img
                            src={article.featured_image}
                            alt=""
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm leading-snug line-clamp-2">
                            {article.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">/{article.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {article.categories && (
                        <span
                          className="text-white text-xs px-2 py-1 rounded font-medium"
                          style={{ backgroundColor: article.categories.color }}
                        >
                          {article.categories.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(article.id, article.status)}
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          article.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {article.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {formatDate(article.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/${article.slug}`}
                          target="_blank"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => deleteArticle(article.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}