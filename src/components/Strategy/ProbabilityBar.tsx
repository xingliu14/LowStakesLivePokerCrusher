'use client'

interface ProbabilityBarProps {
  label: string
  percentage: number
  color: string
  showLabel?: boolean
}

export default function ProbabilityBar({
  label,
  percentage,
  color,
  showLabel = true
}: ProbabilityBarProps) {
  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-white/70">{label}</span>
          <span className="text-white font-medium">{percentage}%</span>
        </div>
      )}
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
