"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

const defaultTheme = {
  site_name: "World Food Insights",
  site_tagline: "Your Daily Food News",
  primary_color: "#E63946",
  secondary_color: "#2B2D42",
  accent_color: "#F4A261",
  background_color: "#F8F9FA",
  text_color: "#2B2D42",
  header_bg: "#1A1A2E",
  footer_bg: "#1A1A2E",
  font_heading: "Merriweather",
  font_body: "Inter",
}

export default function ThemeStudioPage() {
  const [theme, setTheme] = useState(defaultTheme)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadTheme()
  }, [])

  async function loadTheme() {
    const { data } = await supabase.from("theme_settings").select("*").single()
    if (data) setTheme({ ...defaultTheme, ...data })
  }

  async function saveTheme() {
    setSaving(true)
    setMessage("")
    const { error } = await supabase
      .from("theme_settings")
      .update({ ...theme, updated_at: new Date().toISOString() })
      .neq("id", "")
    if (error) {
      setMessage("Error saving: " + error.message)
    } else {
      setMessage("Theme saved successfully! Changes will appear on site.")
    }
    setSaving(false)
  }

  const colorFields = [
    { key: "primary_color", label: "Primary Color", hint: "Main brand color — buttons, links, accents" },
    { key: "secondary_color", label: "Secondary Color", hint: "Secondary elements" },
    { key: "accent_color", label: "Accent Color", hint: "Highlights and call-to-action elements" },
    { key: "background_color", label: "Background Color", hint: "Main page background" },
    { key: "text_color", label: "Text Color", hint: "Main body text color" },
    { key: "header_bg", label: "Header Background", hint: "Navigation bar background" },
    { key: "footer_bg", label: "Footer Background", hint: "Footer section background" },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm">← Dashboard</Link>
          <span className="text-gray-600">/</span>
          <span className="font-semibold">Theme Studio</span>
        </div>
        <button
          onClick={saveTheme}
          disabled={saving}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "💾 Save Theme"}
        </button>
      </div>

      {message && (
        <div className={`px-6 py-3 text-sm font-medium ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Settings Panel */}
          <div className="space-y-6">

            {/* Site Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Site Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                  <input
                    type="text"
                    value={theme.site_name}
                    onChange={(e) => setTheme(prev => ({ ...prev, site_name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={theme.site_tagline}
                    onChange={(e) => setTheme(prev => ({ ...prev, site_tagline: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">🎨 Colors</h3>
              <div className="space-y-4">
                {colorFields.map((field) => (
                  <div key={field.key} className="flex items-center gap-4">
                    <input
                      type="color"
                      value={(theme as any)[field.key]}
                      onChange={(e) => setTheme(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">{field.label}</label>
                        <input
                          type="text"
                          value={(theme as any)[field.key]}
                          onChange={(e) => setTheme(prev => ({ ...prev, [field.key]: e.target.value }))}
                          className="text-xs border border-gray-200 rounded px-2 py-1 w-24 font-mono"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{field.hint}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fonts */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">🔤 Typography</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heading Font</label>
                  <select
                    value={theme.font_heading}
                    onChange={(e) => setTheme(prev => ({ ...prev, font_heading: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none"
                  >
                    <option>Merriweather</option>
                    <option>Georgia</option>
                    <option>Playfair Display</option>
                    <option>Lora</option>
                    <option>Roboto Slab</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body Font</label>
                  <select
                    value={theme.font_body}
                    onChange={(e) => setTheme(prev => ({ ...prev, font_body: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none"
                  >
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                    <option>Lato</option>
                    <option>Source Sans Pro</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-4">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Live Preview</h3>
                <p className="text-xs text-gray-400">Updates as you change settings</p>
              </div>

              {/* Preview Header */}
              <div className="p-4" style={{ backgroundColor: theme.header_bg }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg" style={{ color: theme.primary_color }}>WFI</span>
                    <div>
                      <div className="text-white text-sm font-bold">{theme.site_name}</div>
                      <div className="text-gray-400 text-xs">{theme.site_tagline}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {["News", "Recipes", "Business"].map(item => (
                      <span key={item} className="text-xs text-gray-300 hover:text-white cursor-pointer">{item}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview Body */}
              <div className="p-4" style={{ backgroundColor: theme.background_color }}>
                <div
                  className="text-xs font-bold px-2 py-1 rounded inline-block text-white mb-3"
                  style={{ backgroundColor: theme.primary_color }}
                >
                  BREAKING NEWS
                </div>
                <h2 className="font-bold text-base mb-1" style={{ color: theme.text_color }}>
                  Sample Food News Headline Here
                </h2>
                <p className="text-xs mb-3" style={{ color: theme.text_color, opacity: 0.6 }}>
                  This is a preview of how your article cards will look with the selected theme colors and typography settings.
                </p>
                <div className="flex gap-2">
                  <button
                    className="text-xs px-3 py-1.5 rounded text-white"
                    style={{ backgroundColor: theme.primary_color }}
                  >
                    Read More
                  </button>
                  <button
                    className="text-xs px-3 py-1.5 rounded text-white"
                    style={{ backgroundColor: theme.accent_color }}
                  >
                    {theme.font_heading}
                  </button>
                </div>
              </div>

              {/* Preview Footer */}
              <div className="p-3" style={{ backgroundColor: theme.footer_bg }}>
                <p className="text-xs text-gray-400 text-center">© 2026 {theme.site_name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}