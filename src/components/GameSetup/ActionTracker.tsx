'use client'

import { useState } from 'react'
import { Position, PlayerAction, ActionType } from '@/types/poker'
import { POSITIONS } from '@/lib/poker/positions'
import Button from '@/components/ui/Button'

interface ActionTrackerProps {
  actions: PlayerAction[]
  onChange: (actions: PlayerAction[]) => void
  myPosition: Position
  playerCount: number
}

// Get positions based on player count
function getPositionsForPlayerCount(count: number): Position[] {
  switch (count) {
    case 2:
      return ['BTN', 'BB']
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

export default function ActionTracker({ actions, onChange, myPosition, playerCount }: ActionTrackerProps) {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [raiseAmount, setRaiseAmount] = useState('')

  // Get positions that act before us (preflop), filtered by player count
  const availablePositions = getPositionsForPlayerCount(playerCount)
  const myPositionIndex = availablePositions.indexOf(myPosition)
  const positionsBeforeMe = myPositionIndex > 0 ? availablePositions.slice(0, myPositionIndex) : []

  const addAction = (position: Position, action: ActionType, amount?: number) => {
    const newAction: PlayerAction = { position, action }
    if (amount !== undefined && amount > 0) {
      newAction.amount = amount
    }

    // Remove any existing action from this position
    const filteredActions = actions.filter(a => a.position !== position)
    onChange([...filteredActions, newAction])
    setSelectedPosition(null)
    setRaiseAmount('')
  }

  const removeAction = (position: Position) => {
    onChange(actions.filter(a => a.position !== position))
  }

  const clearAll = () => {
    onChange([])
  }

  const getActionForPosition = (position: Position) => {
    return actions.find(a => a.position === position)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-white/70">
          Action Before You
        </label>
        {actions.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Position list */}
      <div className="space-y-2">
        {positionsBeforeMe.map(position => {
          const action = getActionForPosition(position)
          const isSelected = selectedPosition === position

          return (
            <div
              key={position}
              className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
            >
              <span className="w-16 text-sm font-medium text-white/70">
                {position}
              </span>

              {action ? (
                // Show recorded action
                <div className="flex items-center gap-2 flex-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    action.action === 'fold' ? 'bg-gray-600 text-gray-200' :
                    action.action === 'call' ? 'bg-blue-600 text-white' :
                    action.action === 'raise' ? 'bg-red-600 text-white' :
                    'bg-yellow-600 text-white'
                  }`}>
                    {action.action}
                    {action.amount && ` ${action.amount}BB`}
                  </span>
                  <button
                    onClick={() => removeAction(position)}
                    className="ml-auto text-white/40 hover:text-white/70"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : isSelected ? (
                // Show action buttons
                <div className="flex items-center gap-2 flex-1 flex-wrap">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addAction(position, 'fold')}
                  >
                    Fold
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => addAction(position, 'call')}
                  >
                    Limp/Call
                  </Button>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={raiseAmount}
                      onChange={(e) => setRaiseAmount(e.target.value)}
                      placeholder="BB"
                      className="w-16 px-2 py-1 bg-white/10 rounded text-white text-sm"
                    />
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => addAction(position, 'raise', parseFloat(raiseAmount) || undefined)}
                    >
                      Raise
                    </Button>
                  </div>
                  <button
                    onClick={() => setSelectedPosition(null)}
                    className="ml-auto text-white/40 hover:text-white/70"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                // Show "Add action" button
                <button
                  onClick={() => setSelectedPosition(position)}
                  className="text-sm text-white/50 hover:text-white/70"
                >
                  + Add action
                </button>
              )}
            </div>
          )
        })}

        {positionsBeforeMe.length === 0 && (
          <p className="text-sm text-white/50 italic">
            You&apos;re first to act (UTG)
          </p>
        )}
      </div>

      {/* Quick action summary */}
      {actions.length > 0 && (
        <div className="mt-3 p-2 bg-white/5 rounded-lg">
          <p className="text-xs text-white/50 mb-1">Summary:</p>
          <p className="text-sm text-white/80">
            {actions
              .filter(a => a.action !== 'fold')
              .map(a => `${a.position}: ${a.action}${a.amount ? ` ${a.amount}BB` : ''}`)
              .join(' → ') || 'All folded to you'}
          </p>
        </div>
      )}
    </div>
  )
}
