'use client'

import { useState, useCallback } from 'react'
import { ActionType, Recommendation } from '@/types/poker'
import { sampleAction, getActionDescription } from '@/lib/poker/sampler'

interface ActionButtonProps {
  recommendation: Recommendation
  onAction?: (action: ActionType) => void
}

export default function ActionButton({ recommendation, onAction }: ActionButtonProps) {
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = useCallback(() => {
    setIsAnimating(true)
    setSelectedAction(null)

    // Animate through random actions before settling
    let count = 0
    const maxIterations = 15
    const interval = setInterval(() => {
      const tempAction = sampleAction(recommendation)
      setSelectedAction(tempAction)
      count++

      if (count >= maxIterations) {
        clearInterval(interval)
        const finalAction = sampleAction(recommendation)
        setSelectedAction(finalAction)
        setIsAnimating(false)
        onAction?.(finalAction)
      }
    }, 80)
  }, [recommendation, onAction])

  const getActionColor = (action: ActionType | null): string => {
    switch (action) {
      case 'fold':
        return 'bg-gray-600'
      case 'call':
        return 'bg-blue-600'
      case 'raise':
        return 'bg-red-600'
      default:
        return 'bg-emerald-600'
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleClick}
        disabled={isAnimating}
        className={`w-full py-4 rounded-xl text-white font-bold text-xl transition-all duration-200 shadow-lg ${
          isAnimating
            ? 'bg-yellow-500 animate-pulse'
            : selectedAction
            ? getActionColor(selectedAction)
            : 'bg-emerald-600 hover:bg-emerald-700'
        }`}
      >
        {isAnimating ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Deciding...
          </span>
        ) : selectedAction ? (
          <span>{getActionDescription(selectedAction, recommendation)}</span>
        ) : (
          <span>Action For Me</span>
        )}
      </button>

      {selectedAction && !isAnimating && (
        <button
          onClick={() => setSelectedAction(null)}
          className="w-full py-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          Reset
        </button>
      )}
    </div>
  )
}
