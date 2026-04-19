import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-red-500 font-bold text-xl">WFI</span>
          <span className="font-semibold">Admin Panel</span>
        </div>
        <Link href="/" className="text-sm text-gray-400 hover:text-white">
          View Site →
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-8">Manage your World Food Insights website</p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Articles", value: "0", color: "bg-blue-500" },
            { label: "Published", value: "0", color: "bg-green-500" },
            { label: "Drafts", value: "0", color: "bg-yellow-500" },
            { label: "Categories", value: "8", color: "bg-purple-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm">
              <div className={`w-10 h-10 ${stat.color} rounded-lg mb-3`} />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Articles",
              description: "Write, edit and publish news articles",
              href: "/admin/articles",
              icon: "📰",
              color: "border-blue-500",
              actions: ["New Article", "All Articles"],
              actionLinks: ["/admin/articles/new", "/admin/articles"],
            },
            {
              title: "SEO Manager",
              description: "Manage meta tags, sitemaps and schema",
              href: "/admin/seo",
              icon: "🔍",
              color: "border-green-500",
              actions: ["Manage SEO"],
              actionLinks: ["/admin/seo"],
            },
            {
              title: "Ad Manager",
              description: "Control ad zones, AdSense and custom ads",
              href: "/admin/ads",
              icon: "💰",
              color: "border-yellow-500",
              actions: ["Manage Ads"],
              actionLinks: ["/admin/ads"],
            },
            {
              title: "Theme Studio",
              description: "Change colors, fonts and site appearance",
              href: "/admin/theme",
              icon: "🎨",
              color: "border-purple-500",
              actions: ["Customize Theme"],
              actionLinks: ["/admin/theme"],
            },
            {
              title: "Media Library",
              description: "Upload and manage images and files",
              href: "/admin/media",
              icon: "🖼️",
              color: "border-pink-500",
              actions: ["Upload Media"],
              actionLinks: ["/admin/media"],
            },
            {
              title: "Migration Tool",
              description: "Import articles from indianfoodtimes.com",
              href: "/admin/migration",
              icon: "🔄",
              color: "border-orange-500",
              actions: ["Start Migration"],
              actionLinks: ["/admin/migration"],
            },
          ].map((module) => (
            <div
              key={module.title}
              className={`bg-white rounded-xl p-6 shadow-sm border-t-4 ${module.color} hover:shadow-md transition-shadow`}
            >
              <div className="text-3xl mb-3">{module.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{module.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{module.description}</p>
              <div className="flex gap-2 flex-wrap">
                {module.actions.map((action, i) => (
                  <Link
                    key={action}
                    href={module.actionLinks[i]}
                    className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {action}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/articles/new"
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              + Write New Article
            </Link>
            <Link
              href="/admin/theme"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              🎨 Change Theme Colors
            </Link>
            <Link
              href="/admin/ads"
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
            >
              💰 Manage Ads
            </Link>
            <Link
              href="/"
              target="_blank"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              👁 Preview Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}