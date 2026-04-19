import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-red-500">WFI</span>
              <span className="text-white text-lg font-bold">World Food Insights</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Your trusted source for the latest food news, recipes, industry updates, 
              and culinary insights from India and around the world.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {["World News","Trending","Business","Recipes","Food Tech","Healthy Tips"].map((cat) => (
                <li key={cat}>
                  <Link href={`/category/${cat.toLowerCase().replace(" ", "-")}`} className="hover:text-red-400 transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              {[["About Us","/about"],["Contact","/contact"],["Advertise","/advertise"],["Privacy Policy","/privacy"],["Terms of Use","/terms"]].map(([name, href]) => (
                <li key={name}>
                  <Link href={href} className="hover:text-red-400 transition-colors">{name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© 2026 World Food Insights. All rights reserved.</p>
          <p className="text-sm">Built with passion for food journalism</p>
        </div>
      </div>
    </footer>
  )
}
