"use client"

interface ShareButtonsProps {
  slug: string
  title: string
}

export default function ShareButtons({ slug, title }: ShareButtonsProps) {
  const url = "https://worldfoodinsights.com/" + slug

  function share(platform: string) {
    let shareUrl = ""
    if (platform === "twitter") {
      shareUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(title) + "&url=" + encodeURIComponent(url)
    } else if (platform === "facebook") {
      shareUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url)
    } else if (platform === "whatsapp") {
      shareUrl = "https://api.whatsapp.com/send?text=" + encodeURIComponent(title + " " + url)
    }
    window.open(shareUrl, "_blank")
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-500">Share:</span>
        <button
          onClick={() => share("twitter")}
          className="bg-sky-500 text-white text-xs px-3 py-1.5 rounded hover:bg-sky-600"
        >
          Twitter
        </button>
        <button
          onClick={() => share("facebook")}
          className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700"
        >
          Facebook
        </button>
        <button
          onClick={() => share("whatsapp")}
          className="bg-green-500 text-white text-xs px-3 py-1.5 rounded hover:bg-green-600"
        >
          WhatsApp
        </button>
      </div>
    </div>
  )
}
