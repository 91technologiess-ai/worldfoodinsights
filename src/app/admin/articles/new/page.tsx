"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

const categories = [
  { id: "", name: "Select Category", slug: "" },
  { name: "World News", slug: "world-news" },
  { name: "Trending", slug: "food-trends" },
  { name: "Business", slug: "business" },
  { name: "My India", slug: "my-india" },
  { name: "Food Tech", slug: "food-tech" },
  { name: "Recipes", slug: "recipes" },
  { name: "Healthy Tips", slug: "healthy-tips" },
  { name: "Chef", slug: "chef" },
]

export default function NewArticlePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    category_slug: "",
    status: "draft",
    is_breaking: false,
    is_featured: false,
    meta_title: "",
    meta_description: "",
  })

  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setForm(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      meta_title: title,
    }))
  }

  const handleSave = async (status: string) => {
    if (!form.title) { setMessage("Title is required!"); return }
    if (!form.slug) { setMessage("Slug is required!"); return }
    setSaving(true)
    setMessage("")

    try {
      // Get category id
      let category_id = null
      if (form.category_slug) {
        const { data: cat } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", form.category_slug)
          .single()
        category_id = cat?.id
      }

      // Save article
      const { data: article, error } = await supabase
        .from("articles")
        .insert({
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt,
          content: form.content,
          featured_image: form.featured_image,
          category_id,
          status,
          is_breaking: form.is_breaking,
          is_featured: form.is_featured,
          published_at: status === "published" ? new Date().toISOString() : null,
        })
        .select()
        .single()

      if (error) throw error

      // Save SEO
      if (article && (form.meta_title || form.meta_description)) {
        await supabase.from("article_seo").insert({
          article_id: article.id,
          meta_title: form.meta_title || form.title,
          meta_description: form.meta_description || form.excerpt,
          og_title: form.meta_title || form.title,
          og_description: form.meta_description || form.excerpt,
          og_image: form.featured_image,
        })
      }

      setMessage(status === "published" ? "Article published!" : "Draft saved!")
      setTimeout(() => router.push("/admin/articles"), 1500)
    } catch (err: any) {
      setMessage("Error: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm">← Dashboard</Link>
          <span className="text-gray-600">/</span>
          <span className="font-semibold">New Article</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
          >
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {message && (
        <div className={`px-6 py-3 text-sm font-medium ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <input
                type="text"
                placeholder="Article Title..."
                value={form.title}
                onChange={handleTitleChange}
                className="w-full text-2xl font-bold border-0 outline-none text-gray-900 placeholder-gray-300"
              />
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-400">Slug:</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                  className="text-xs text-gray-500 border border-gray-200 rounded px-2 py-1 flex-1"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt / Summary</label>
              <textarea
                placeholder="Brief description of the article..."
                value={form.excerpt}
                onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-400 resize-none"
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">Article Content (HTML supported)</label>
              <textarea
                placeholder="Write your article content here... You can use HTML tags like <p>, <h2>, <strong>, <ul>, <li> etc."
                value={form.content}
                onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-400 resize-none font-mono"
              />
            </div>

            {/* SEO Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                🔍 SEO Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Title
                    <span className="text-gray-400 font-normal ml-2">({form.meta_title.length}/60)</span>
                  </label>
                  <input
                    type="text"
                    value={form.meta_title}
                    onChange={(e) => setForm(prev => ({ ...prev, meta_title: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-400"
                    maxLength={60}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                    <span className="text-gray-400 font-normal ml-2">({form.meta_description.length}/160)</span>
                  </label>
                  <textarea
                    value={form.meta_description}
                    onChange={(e) => setForm(prev => ({ ...prev, meta_description: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-400 resize-none"
                    maxLength={160}
                  />
                </div>
                {/* Google Preview */}
                <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                  <p className="text-xs text-gray-400 mb-2">Google Preview:</p>
                  <p className="text-blue-600 text-sm font-medium truncate">
                    {form.meta_title || form.title || "Article Title"}
                  </p>
                  <p className="text-green-700 text-xs">worldfoodinsights.com/{form.slug}</p>
                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                    {form.meta_description || form.excerpt || "Article description will appear here..."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">

            {/* Publish Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Publish Settings</h3>
              <div className="space-y-3">
                <select
                  value={form.status}
                  onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_breaking}
                    onChange={(e) => setForm(prev => ({ ...prev, is_breaking: e.target.checked }))}
                    className="w-4 h-4 accent-red-600"
                  />
                  <span className="text-sm text-gray-700">🔴 Breaking News</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-4 h-4 accent-red-600"
                  />
                  <span className="text-sm text-gray-700">⭐ Featured Article</span>
                </label>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <button
                  onClick={() => handleSave("draft")}
                  disabled={saving}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSave("published")}
                  disabled={saving}
                  className="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  Publish Now
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Category</h3>
              <select
                value={form.category_slug}
                onChange={(e) => setForm(prev => ({ ...prev, category_slug: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Featured Image</h3>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={form.featured_image}
                onChange={(e) => setForm(prev => ({ ...prev, featured_image: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-400"
              />
              {form.featured_image && (
                <img
                  src={form.featured_image}
                  alt="Preview"
                  className="mt-3 w-full h-32 object-cover rounded-lg"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}