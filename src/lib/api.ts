import { supabase } from "./supabase"

export async function getArticles(limit = 10, offset = 0) {
  const { data, error } = await supabase
    .from("articles")
    .select(`*, authors(name, slug, avatar_url), categories(name, slug, color)`)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1)
  if (error) throw error
  return data
}

export async function getFeaturedArticles(limit = 5) {
  const { data, error } = await supabase
    .from("articles")
    .select(`*, authors(name, slug, avatar_url), categories(name, slug, color)`)
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function getBreakingNews() {
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, slug")
    .eq("status", "published")
    .eq("is_breaking", true)
    .order("published_at", { ascending: false })
    .limit(5)
  if (error) throw error
  return data
}

export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from("articles")
    .select(`*, authors(name, slug, avatar_url, bio), categories(name, slug, color), article_seo(*)`)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()
  if (error) throw error
  return data
}

export async function getArticlesByCategory(categorySlug: string, limit = 10) {
  const { data, error } = await supabase
    .from("articles")
    .select(`*, authors(name, slug, avatar_url), categories!inner(name, slug, color)`)
    .eq("status", "published")
    .eq("categories.slug", categorySlug)
    .order("published_at", { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name")
  if (error) throw error
  return data
}

export async function getThemeSettings() {
  const { data, error } = await supabase
    .from("theme_settings")
    .select("*")
    .single()
  if (error) return null
  return data
}

export async function getActiveAds(zoneKey: string) {
  const { data, error } = await supabase
    .from("ads")
    .select(`*, ad_zones!inner(zone_key)`)
    .eq("is_active", true)
    .eq("ad_zones.zone_key", zoneKey)
  if (error) return []
  return data
}

export async function incrementViews(articleId: string) {
  await supabase.rpc("increment_views", { article_id: articleId })
}
