'use client'

import { Recommendation } from '@/types/poker'

interface AdjustmentIndicatorProps {
  base: Recommendation
  adjusted: Recommendation
}

export default function AdjustmentIndicator({ base, adjusted }: AdjustmentIndicatorProps) {
  const hasAdjustments =
    base.fold !== adjusted.fold ||
    base.call !== adjusted.call ||
    base.raise !== adjusted.raise

  if (!hasAdjustments) {
    return null
  }

  const getDiff = (baseVal: number, adjVal: number): string => {
    const diff = adjVal - baseVal
    if (diff === 0) return ''
    return diff > 0 ? `+${diff}` : `${diff}`
  }

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-sm">
      <div className="flex items-center gap-2 text-amber-400 mb-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">YouTube Adjustments Applied</span>
      </div>
      <div className="flex gap-4 text-white/70">
        {getDiff(base.fold, adjusted.fold) && (
          <span>Fold: <span className={adjusted.fold > base.fold ? 'text-red-400' : 'text-green-400'}>{getDiff(base.fold, adjusted.fold)}%</span></span>
        )}
        {getDiff(base.call, adjusted.call) && (
          <span>Call: <span className={adjusted.call > base.call ? 'text-green-400' : 'text-red-400'}>{getDiff(base.call, adjusted.call)}%</span></span>
        )}
        {getDiff(base.raise, adjusted.raise) && (
          <span>Raise: <span className={adjusted.raise > base.raise ? 'text-green-400' : 'text-red-400'}>{getDiff(base.raise, adjusted.raise)}%</span></span>
        )}
      </div>
    </div>
  )
}
