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
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top utility bar */}
      <div className="bg-[#1d3557] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="hidden sm:block text-gray-300">India's #1 Food News Platform</span>
          <div className="flex gap-4 ml-auto">
            <Link href="/advertise" className="hover:text-red-400 transition-colors">Advertise</Link>
            <Link href="/contact" className="hover:text-red-400 transition-colors">Contact</Link>
            <Link href="/admin" className="hover:text-red-400 transition-colors">Admin</Link>
          </div>
        </div>
      </div>

      {/* Logo bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-red-600 text-white font-black text-xl px-3 py-1.5 rounded">
              WFI
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-black text-gray-900 leading-tight">World Food Insights</div>
              <div className="text-xs text-gray-500 font-medium">India's Food News Authority</div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full text-sm text-gray-600 transition-colors"
            >
              <Search size={16} />
              <span className="hidden sm:block">Search</span>
            </Link>
            <button
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div className={`bg-red-600 text-white transition-shadow ${scrolled ? "shadow-lg" : ""}`}>
        <div className="max-w-7xl mx-auto px-4">
          <nav className="hidden lg:flex items-center overflow-x-auto">
            <Link href="/" className="px-4 py-3 text-sm font-bold whitespace-nowrap hover:bg-red-700 transition-colors border-r border-red-500">
              Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={"/category/" + cat.slug}
                className="px-4 py-3 text-sm font-medium whitespace-nowrap hover:bg-red-700 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <Link
              href="/"
              className="block py-3 text-sm font-bold text-gray-900 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={"/category/" + cat.slug}
                className="block py-3 text-sm text-gray-700 border-b border-gray-100 hover:text-red-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}