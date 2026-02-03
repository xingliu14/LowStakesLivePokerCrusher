'use client'

import { Recommendation, StrategyAdjustment } from '@/types/poker'
import ProbabilityBar from './ProbabilityBar'
import ActionButton from './ActionButton'
import AdjustmentIndicator from './AdjustmentIndicator'
import Card from '@/components/ui/Card'

interface RecommendationDisplayProps {
  base: Recommendation
  adjusted: Recommendation
  adjustments: StrategyAdjustment[]
  showAdjusted?: boolean
}

export default function RecommendationDisplay({
  base,
  adjusted,
  adjustments,
  showAdjusted = true
}: RecommendationDisplayProps) {
  const recommendation = showAdjusted ? adjusted : base
  const activeAdjustments = adjustments.filter(a => a.isActive)

  return (
    <Card variant="elevated" className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Recommended Action</h2>
        {recommendation.raiseSize && (
          <span className="text-sm text-white/60">
            Raise size: {recommendation.raiseSize}BB
          </span>
        )}
      </div>

      {/* Probability bars */}
      <div className="space-y-4">
        <ProbabilityBar
          label="Fold"
          percentage={recommendation.fold}
          color="bg-gray-500"
        />
        <ProbabilityBar
          label="Call"
          percentage={recommendation.call}
          color="bg-blue-500"
        />
        <ProbabilityBar
          label="Raise"
          percentage={recommendation.raise}
          color="bg-red-500"
        />
      </div>

      {/* Adjustment indicator */}
      {activeAdjustments.length > 0 && (
        <AdjustmentIndicator base={base} adjusted={adjusted} />
      )}

      {/* Action button */}
      <ActionButton recommendation={recommendation} />

      {/* Legend */}
      <div className="text-xs text-white/40 text-center">
        Click &quot;Action For Me&quot; to randomly select based on these probabilities
      </div>
    </Card>
  )
}
