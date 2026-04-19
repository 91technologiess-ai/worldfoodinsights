import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  articles: {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    featured_image: string
    author_id: string
    category_id: string
    status: string
    is_breaking: boolean
    is_featured: boolean
    views: number
    published_at: string
    created_at: string
    updated_at: string
  }
}