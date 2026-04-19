"use client"
interface AdZoneProps {
  zone: string
  className?: string
}

export default function AdZone({ zone, className = "" }: AdZoneProps) {
  return (
    <div className={`ad-zone ad-zone-${zone} ${className}`} data-zone={zone}>
      <div className="bg-gray-50 border border-dashed border-gray-200 rounded flex items-center justify-center text-xs text-gray-400 min-h-[90px]">
        Advertisement
      </div>
    </div>
  )
}
