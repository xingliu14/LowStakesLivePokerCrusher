'use client'

import { useMemo } from 'react'
import { GameState, Recommendation, StrategyAdjustment } from '@/types/poker'
import { getRecommendation } from '@/lib/poker/strategy'

export function useStrategy(
  gameState: GameState,
  adjustments: StrategyAdjustment[] = []
) {
  const { base, adjusted } = useMemo(() => {
    return getRecommendation(gameState, adjustments)
  }, [gameState, adjustments])

  const hasValidHand = gameState.holeCards.length === 2

  return {
    base,
    adjusted,
    hasValidHand
  }
}
