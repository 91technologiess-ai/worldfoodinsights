import type { Metadata } from "next"
import { Inter, Merriweather } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-merriweather",
})

export const metadata: Metadata = {
  title: {
    default: "World Food Insights - Latest Food News & Insights",
    template: "%s | World Food Insights",
  },
  description: "Your trusted source for the latest food news, recipes, industry updates, and culinary insights from India and around the world.",
  keywords: ["food news", "indian food", "recipes", "food industry", "food startups", "food tech"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://worldfoodinsights.com",
    siteName: "World Food Insights",
  },
  twitter: {
    card: "summary_large_image",
    site: "@worldfoodinsights",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable} font-sans bg-gray-50 text-gray-900 antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
