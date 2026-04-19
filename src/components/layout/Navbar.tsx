"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Search } from "lucide-react"

const categories = [
  { name: "World News", slug: "world-news" },
  { name: "Trending", slug: "food-trends" },
  { name: "Business", slug: "business" },
  { name: "My India", slug: "my-india" },
  { name: "Food Tech", slug: "food-tech" },
  { name: "Recipes", slug: "recipes" },
  { name: "Healthy Tips", slug: "healthy-tips" },
  { name: "Chef", slug: "chef" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}>
      {/* Top bar */}
      <div className="bg-red-600 text-white text-xs py-1 px-4 flex justify-between items-center">
        <span>World Food Insights — Your Daily Food News</span>
        <div className="flex gap-4">
          <Link href="/advertise" className="hover:underline">Advertise</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </div>
      </div>

      {/* Main navbar */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-red-500">WFI</span>
            <div className="hidden sm:block">
              <div className="text-lg font-bold leading-tight">World Food Insights</div>
              <div className="text-xs text-gray-400">Your Daily Food News</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-3 py-2 text-sm hover:bg-red-600 rounded transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/search" className="p-2 hover:bg-gray-700 rounded-full transition-colors">
              <Search size={18} />
            </Link>
            <button
              className="lg:hidden p-2 hover:bg-gray-700 rounded-full"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden bg-gray-800 border-t border-gray-700">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="block px-4 py-3 text-sm hover:bg-gray-700 border-b border-gray-700"
                onClick={() => setIsOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
