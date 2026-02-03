'use client'

import { StrategyAdjustment } from '@/types/poker'
import Card from '@/components/ui/Card'

interface LearnedStrategiesProps {
  strategies: StrategyAdjustment[]
  onToggle: (index: number) => void
  onDelete: (index: number) => void
}

export default function LearnedStrategies({
  strategies,
  onToggle,
  onDelete
}: LearnedStrategiesProps) {
  if (strategies.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-white/40 space-y-2">
          <svg className="w-12 h-12 mx-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p>No learned strategies yet</p>
          <p className="text-sm">Add a YouTube video to extract poker strategies</p>
        </div>
      </Card>
    )
  }

  // Group by video URL
  const grouped = strategies.reduce((acc, strategy, index) => {
    const key = strategy.videoUrl
    if (!acc[key]) {
      acc[key] = {
        source: strategy.source,
        url: strategy.videoUrl,
        strategies: []
      }
    }
    acc[key].strategies.push({ ...strategy, originalIndex: index })
    return acc
  }, {} as Record<string, { source: string; url: string; strategies: (StrategyAdjustment & { originalIndex: number })[] }>)

  return (
    <div className="space-y-4">
      {Object.values(grouped).map((group) => (
        <Card key={group.url} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-medium text-white">{group.source}</h3>
              <a
                href={group.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-400 hover:text-emerald-300"
              >
                View video
              </a>
            </div>
          </div>

          <div className="space-y-2">
            {group.strategies.map((strategy) => (
              <div
                key={strategy.originalIndex}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  strategy.isActive ? 'bg-white/5' : 'bg-white/5 opacity-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={strategy.isActive}
                  onChange={() => onToggle(strategy.originalIndex)}
                  className="w-4 h-4 rounded border-white/30 bg-white/10 text-emerald-500 focus:ring-emerald-500"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    {strategy.position && (
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded">
                        {strategy.position}
                      </span>
                    )}
                    {strategy.handCategory && (
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded">
                        {strategy.handCategory}
                      </span>
                    )}
                    {strategy.situation && (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs rounded">
                        {strategy.situation.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3 text-xs text-white/60">
                    {strategy.foldAdjust !== undefined && (
                      <span className={strategy.foldAdjust > 0 ? 'text-red-400' : 'text-green-400'}>
                        Fold: {strategy.foldAdjust > 0 ? '+' : ''}{strategy.foldAdjust}%
                      </span>
                    )}
                    {strategy.callAdjust !== undefined && (
                      <span className={strategy.callAdjust > 0 ? 'text-green-400' : 'text-red-400'}>
                        Call: {strategy.callAdjust > 0 ? '+' : ''}{strategy.callAdjust}%
                      </span>
                    )}
                    {strategy.raiseAdjust !== undefined && (
                      <span className={strategy.raiseAdjust > 0 ? 'text-green-400' : 'text-red-400'}>
                        Raise: {strategy.raiseAdjust > 0 ? '+' : ''}{strategy.raiseAdjust}%
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onDelete(strategy.originalIndex)}
                  className="p-1 text-white/30 hover:text-red-400 transition-colors"
                  title="Delete adjustment"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
