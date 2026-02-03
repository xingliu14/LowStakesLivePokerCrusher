'use client'

import { useState } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { useStrategy } from '@/hooks/useStrategy'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { StrategyAdjustment, Card as CardType } from '@/types/poker'
import { categorizeHand, getHandNotation } from '@/lib/poker/hands'
import { determineSituation } from '@/lib/poker/strategy'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import StakeSelector from '@/components/GameSetup/StakeSelector'
import PlayerCountSelector from '@/components/GameSetup/PlayerCountSelector'
import PositionSelector from '@/components/GameSetup/PositionSelector'
import CardPicker from '@/components/GameSetup/CardPicker'
import ActionTracker from '@/components/GameSetup/ActionTracker'
import StackInput from '@/components/GameSetup/StackInput'
import StreetSelector from '@/components/GameSetup/StreetSelector'
import BoardCards from '@/components/GameSetup/BoardCards'
import PotSize from '@/components/GameSetup/PotSize'
import RecommendationDisplay from '@/components/Strategy/RecommendationDisplay'

export default function Home() {
  const {
    gameState,
    playerCount,
    setStakes,
    setPosition,
    setHoleCards,
    setStreet,
    setBoardCards,
    setPotSize,
    setEffectiveStack,
    setActions,
    setPlayerCount,
    resetGame
  } = useGameState()

  const [adjustments] = useLocalStorage<StrategyAdjustment[]>('learnedStrategies', [])
  const [showAdjusted, setShowAdjusted] = useState(true)

  const { base, adjusted, hasValidHand } = useStrategy(gameState, adjustments)

  // Get situation description for display
  const situation = determineSituation(gameState.actions, gameState.myPosition)
  const handCategory = hasValidHand
    ? categorizeHand(gameState.holeCards as [CardType, CardType])
    : null
  const handNotation = hasValidHand
    ? getHandNotation(gameState.holeCards as [CardType, CardType])
    : null

  const activeAdjustments = adjustments.filter(a => a.isActive)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left column: Game Setup */}
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Game Setup</h2>
            <Button variant="ghost" size="sm" onClick={resetGame}>
              Reset
            </Button>
          </div>

          <div className="space-y-6">
            <StakeSelector value={gameState.stakes} onChange={setStakes} />
            <PlayerCountSelector value={playerCount} onChange={setPlayerCount} />
            <PositionSelector value={gameState.myPosition} onChange={setPosition} playerCount={playerCount} />
            <StackInput value={gameState.effectiveStack} onChange={setEffectiveStack} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Your Hand</h2>
          <div className="space-y-6">
            <CardPicker
              selectedCards={gameState.holeCards}
              onSelect={setHoleCards}
              maxCards={2}
              label="Hole Cards"
              usedCards={gameState.boardCards}
            />

            <StreetSelector value={gameState.street} onChange={setStreet} />

            {gameState.street !== 'preflop' && (
              <>
                <BoardCards
                  street={gameState.street}
                  cards={gameState.boardCards}
                  onChange={setBoardCards}
                  holeCards={gameState.holeCards}
                />
                <PotSize value={gameState.potSize} onChange={setPotSize} />
              </>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Action</h2>
          <ActionTracker
            actions={gameState.actions}
            onChange={setActions}
            myPosition={gameState.myPosition}
            playerCount={playerCount}
          />
        </Card>
      </div>

      {/* Right column: Strategy Recommendation */}
      <div className="space-y-6">
        {/* Hand info */}
        {hasValidHand && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white/60 text-sm">Your Hand:</span>
                <span className="ml-2 text-white font-bold text-lg">{handNotation}</span>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-white/60 text-sm">Category:</span>
                  <span className="ml-2 text-white capitalize">{handCategory}</span>
                </div>
                <div>
                  <span className="text-white/60 text-sm">Situation:</span>
                  <span className="ml-2 text-white">{situation.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Recommendation */}
        {hasValidHand ? (
          <>
            <RecommendationDisplay
              base={base}
              adjusted={adjusted}
              adjustments={adjustments}
              showAdjusted={showAdjusted}
            />

            {/* Toggle for showing adjusted vs base */}
            {activeAdjustments.length > 0 && (
              <Card className="p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAdjusted}
                    onChange={(e) => setShowAdjusted(e.target.checked)}
                    className="w-5 h-5 rounded border-white/30 bg-white/10 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-white/80">Apply YouTube learned adjustments</span>
                  <span className="text-sm text-white/50">
                    ({activeAdjustments.length} active)
                  </span>
                </label>
              </Card>
            )}
          </>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-white/40 space-y-4">
              <svg className="w-16 h-16 mx-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <p className="text-lg">Select your hole cards to get a recommendation</p>
              <p className="text-sm">Pick two cards from the card picker on the left</p>
            </div>
          </Card>
        )}

        {/* Quick tips */}
        <Card className="p-4">
          <h3 className="text-sm font-medium text-white/70 mb-2">Quick Tips</h3>
          <ul className="text-sm text-white/50 space-y-1">
            <li>- Position is key: play tighter from early position</li>
            <li>- Use &quot;Action For Me&quot; to randomize your play</li>
            <li>- Adjust for opponents by learning from YouTube videos</li>
            <li>- Stack depth affects optimal strategy</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
