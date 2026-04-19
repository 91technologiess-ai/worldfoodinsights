"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

interface NewsItem {
  id: string
  title: string
  slug: string
}

export default function BreakingNewsTicker({ items }: { items: NewsItem[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!items?.length) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [items])

  if (!items?.length) return null

  return (
    <div className="bg-red-600 text-white py-2 px-4 flex items-center gap-3 overflow-hidden">
      <span className="bg-white text-red-600 text-xs font-bold px-2 py-1 rounded whitespace-nowrap animate-pulse">
        BREAKING
      </span>
      <div className="flex-1 overflow-hidden">
        <Link
          href={`/${items[current]?.slug}`}
          className="text-sm hover:underline truncate block transition-all duration-500"
        >
          {items[current]?.title}
        </Link>
      </div>
    </div>
  )
}
