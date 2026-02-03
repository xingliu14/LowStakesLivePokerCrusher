'use client'

import { Position } from '@/types/poker'
import { POSITIONS, POSITION_NAMES } from '@/lib/poker/positions'

interface PositionSelectorProps {
  value: Position
  onChange: (position: Position) => void
  playerCount: number
}

// Get positions based on player count
function getPositionsForPlayerCount(count: number): Position[] {
  // Always include BTN, SB, BB
  // Then add positions based on count
  switch (count) {
    case 2:
      return ['BTN', 'BB'] // Heads up: BTN is also SB
    case 3:
      return ['BTN', 'SB', 'BB']
    case 4:
      return ['CO', 'BTN', 'SB', 'BB']
    case 5:
      return ['HJ', 'CO', 'BTN', 'SB', 'BB']
    case 6:
      return ['LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']
    case 7:
      return ['UTG', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']
    case 8:
      return ['UTG', 'UTG+1', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']
    case 9:
    default:
      return ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']
  }
}

export default function PositionSelector({ value, onChange, playerCount }: PositionSelectorProps) {
  const availablePositions = getPositionsForPlayerCount(playerCount)

  // Visual poker table layout - positions around the table
  const allTablePositions: { position: Position; x: number; y: number }[] = [
    { position: 'BTN', x: 85, y: 50 },
    { position: 'CO', x: 90, y: 25 },
    { position: 'HJ', x: 75, y: 8 },
    { position: 'LJ', x: 50, y: 5 },
    { position: 'UTG+2', x: 25, y: 8 },
    { position: 'UTG+1', x: 10, y: 25 },
    { position: 'UTG', x: 5, y: 50 },
    { position: 'BB', x: 25, y: 85 },
    { position: 'SB', x: 60, y: 85 },
  ]

  // Filter to only show positions for current player count
  const tablePositions = allTablePositions.filter(p => availablePositions.includes(p.position))

  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-2">
        Your Position
      </label>

      {/* Visual table */}
      <div className="relative w-full aspect-[2/1] max-w-md mx-auto mb-4">
        {/* Table felt */}
        <div className="absolute inset-[10%] bg-poker-felt rounded-[50%] border-4 border-amber-900/50 shadow-inner" />

        {/* Dealer button indicator - positioned inside table near BTN */}
        <div
          className="absolute w-5 h-5 bg-white rounded-full flex items-center justify-center text-[9px] font-bold text-gray-800 shadow-lg border border-gray-300"
          style={{ left: '72%', top: '55%' }}
        >
          D
        </div>

        {/* Position buttons */}
        {tablePositions.map(({ position, x, y }) => (
          <button
            key={position}
            onClick={() => onChange(position)}
            style={{ left: `${x}%`, top: `${y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full text-xs font-bold transition-all ${
              value === position
                ? 'bg-emerald-500 text-white ring-2 ring-white scale-110 z-10'
                : 'bg-white/20 text-white/80 hover:bg-white/30'
            }`}
            title={POSITION_NAMES[position]}
          >
            {position}
          </button>
        ))}
      </div>

      {/* List fallback for accessibility */}
      <div className="flex flex-wrap gap-2 justify-center">
        {availablePositions.map((position) => (
          <button
            key={position}
            onClick={() => onChange(position)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              value === position
                ? 'bg-emerald-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {position}
          </button>
        ))}
      </div>
    </div>
  )
}
