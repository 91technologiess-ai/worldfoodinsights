export interface Article {
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
  authors?: Author
  categories?: Category
}

export interface Author {
  id: string
  name: string
  slug: string
  email: string
  bio: string
  avatar_url: string
  role: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  color: string
}

export interface ThemeSettings {
  id: string
  site_name: string
  site_tagline: string
  logo_url: string
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  text_color: string
  header_bg: string
  footer_bg: string
  font_heading: string
  font_body: string
}

export interface AdZone {
  id: string
  name: string
  zone_key: string
  is_active: boolean
}

export interface Ad {
  id: string
  zone_id: string
  name: string
  ad_type: string
  ad_code: string
  image_url: string
  link_url: string
  is_active: boolean
}
