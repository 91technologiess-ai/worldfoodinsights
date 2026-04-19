"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function AdsManagerPage() {
  const [zones, setZones] = useState<any[]>([])
  const [ads, setAds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [newAd, setNewAd] = useState({
    zone_id: "",
    name: "",
    ad_type: "adsense",
    ad_code: "",
    image_url: "",
    link_url: "",
    is_active: true,
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [{ data: zonesData }, { data: adsData }] = await Promise.all([
      supabase.from("ad_zones").select("*").order("name"),
      supabase.from("ads").select("*, ad_zones(name, zone_key)").order("created_at", { ascending: false }),
    ])
    setZones(zonesData || [])
    setAds(adsData || [])
    setLoading(false)
  }

  async function saveAd() {
    if (!newAd.name || !newAd.zone_id) {
      setMessage("Ad name and zone are required!")
      return
    }
    const { error } = await supabase.from("ads").insert(newAd)
    if (error) {
      setMessage("Error: " + error.message)
    } else {
      setMessage("Ad saved successfully!")
      setNewAd({ zone_id: "", name: "", ad_type: "adsense", ad_code: "", image_url: "", link_url: "", is_active: true })
      loadData()
    }
  }

  async function toggleAd(id: string, current: boolean) {
    await supabase.from("ads").update({ is_active: !current }).eq("id", id)
    loadData()
  }

  async function deleteAd(id: string) {
    if (!confirm("Delete this ad?")) return
    await supabase.from("ads").delete().eq("id", id)
    loadData()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm">
            Back to Dashboard
          </Link>
          <span className="text-gray-600">/</span>
          <span className="font-semibold">Ad Manager</span>
        </div>
      </div>

      {message && (
        <div className={`px-6 py-3 text-sm font-medium ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Add New Ad</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ad Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Google AdSense Header"
                    value={newAd.name}
                    onChange={(e) => setNewAd(p => ({ ...p, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ad Zone</label>
                  <select
                    value={newAd.zone_id}
                    onChange={(e) => setNewAd(p => ({ ...p, zone_id: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none"
                  >
                    <option value="">Select Zone</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name} ({zone.width}x{zone.height})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ad Type</label>
                  <select
                    value={newAd.ad_type}
                    onChange={(e) => setNewAd(p => ({ ...p, ad_type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none"
                  >
                    <option value="adsense">Google AdSense</option>
                    <option value="custom">Custom HTML</option>
                    <option value="image">Image Banner</option>
                  </select>
                </div>

                {newAd.ad_type === "adsense" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">AdSense Code</label>
                    <textarea
                      placeholder="Paste your Google AdSense script here..."
                      value={newAd.ad_code}
                      onChange={(e) => setNewAd(p => ({ ...p, ad_code: e.target.value }))}
                      rows={5}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs font-mono outline-none focus:border-yellow-400 resize-none"
                    />
                  </div>
                )}

                {newAd.ad_type === "custom" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Custom HTML</label>
                    <textarea
                      placeholder="Your custom ad HTML here..."
                      value={newAd.ad_code}
                      onChange={(e) => setNewAd(p => ({ ...p, ad_code: e.target.value }))}
                      rows={5}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs font-mono outline-none focus:border-yellow-400 resize-none"
                    />
                  </div>
                )}

                {newAd.ad_type === "image" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
                      <input
                        type="url"
                        placeholder="https://example.com/banner.jpg"
                        value={newAd.image_url}
                        onChange={(e) => setNewAd(p => ({ ...p, image_url: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-yellow-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Click URL</label>
                      <input
                        type="url"
                        placeholder="https://advertiser-website.com"
                        value={newAd.link_url}
                        onChange={(e) => setNewAd(p => ({ ...p, link_url: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={saveAd}
                  className="w-full bg-yellow-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-yellow-600"
                >
                  Save Ad
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
              <h3 className="font-bold text-gray-900 mb-3">Ad Zones</h3>
              <div className="space-y-2">
                {zones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{zone.name}</p>
                      <p className="text-xs text-gray-400">{zone.width}x{zone.height}px</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${zone.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {zone.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">All Ads</h3>
                <p className="text-sm text-gray-400">Manage your active and inactive ads</p>
              </div>

              {loading ? (
                <div className="p-12 text-center text-gray-400">Loading...</div>
              ) : ads.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-5xl mb-4">💰</div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No ads yet</h3>
                  <p className="text-gray-400 text-sm">Add your first ad using the form on the left</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {ads.map((ad) => (
                    <div key={ad.id} className="p-4 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 text-sm">{ad.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                            ad.ad_type === "adsense"
                              ? "bg-blue-100 text-blue-700"
                              : ad.ad_type === "image"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {ad.ad_type}
                          </span>
                        </div>
                        {ad.ad_zones && (
                          <p className="text-xs text-gray-400">Zone: {ad.ad_zones.name}</p>
                        )}
                        {ad.image_url && (
                          <img src={ad.image_url} alt="" className="mt-2 h-12 rounded object-cover" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => toggleAd(ad.id, ad.is_active)}
                          className={`text-xs px-3 py-1.5 rounded font-medium ${
                            ad.is_active
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {ad.is_active ? "Active" : "Inactive"}
                        </button>
                        <button
                          onClick={() => deleteAd(ad.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}