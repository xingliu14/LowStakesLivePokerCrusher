'use client'

import { useState, useCallback } from 'react'
import { Card, Rank, Suit } from '@/types/poker'
import { getSuitSymbol, getSuitColor } from '@/lib/poker/hands'
import Modal from '@/components/ui/Modal'

interface CardPickerProps {
  selectedCards: Card[]
  onSelect: (cards: Card[]) => void
  maxCards: number
  label: string
  usedCards?: Card[] // Cards that can't be selected (already used elsewhere)
}

const RANKS: Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs']

export default function CardPicker({
  selectedCards,
  onSelect,
  maxCards,
  label,
  usedCards = []
}: CardPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const isCardSelected = useCallback((rank: Rank, suit: Suit) => {
    return selectedCards.some(c => c.rank === rank && c.suit === suit)
  }, [selectedCards])

  const isCardUsed = useCallback((rank: Rank, suit: Suit) => {
    return usedCards.some(c => c.rank === rank && c.suit === suit)
  }, [usedCards])

  const toggleCard = useCallback((rank: Rank, suit: Suit) => {
    const card: Card = { rank, suit }

    if (isCardSelected(rank, suit)) {
      // Remove card
      onSelect(selectedCards.filter(c => !(c.rank === rank && c.suit === suit)))
    } else if (selectedCards.length < maxCards) {
      // Add card
      onSelect([...selectedCards, card])
    }
  }, [selectedCards, maxCards, onSelect, isCardSelected])

  const clearAll = () => {
    onSelect([])
  }

  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-2">
        {label}
      </label>

      {/* Selected cards display */}
      <div
        onClick={() => setIsOpen(true)}
        className="flex gap-2 p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors min-h-[72px]"
      >
        {selectedCards.length === 0 ? (
          <span className="text-white/40 text-sm">Click to select cards...</span>
        ) : (
          selectedCards.map((card, i) => (
            <div
              key={i}
              className="w-12 h-16 bg-white rounded-lg flex flex-col items-center justify-center shadow-lg card-shadow"
            >
              <span className={`text-lg font-bold ${getSuitColor(card.suit)}`}>
                {card.rank}
              </span>
              <span className={`text-xl ${getSuitColor(card.suit)}`}>
                {getSuitSymbol(card.suit)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Card picker modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Select ${label} (${selectedCards.length}/${maxCards})`}
      >
        <div className="space-y-4">
          {/* Clear button */}
          {selectedCards.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Clear all
            </button>
          )}

          {/* Card grid */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-8"></th>
                  {SUITS.map(suit => (
                    <th key={suit} className="p-1 text-center">
                      <span className={`text-2xl ${suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-gray-200'}`}>
                        {getSuitSymbol(suit)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RANKS.map(rank => (
                  <tr key={rank}>
                    <td className="text-white/70 font-bold text-center pr-2">
                      {rank}
                    </td>
                    {SUITS.map(suit => {
                      const selected = isCardSelected(rank, suit)
                      const used = isCardUsed(rank, suit)

                      return (
                        <td key={`${rank}${suit}`} className="p-1">
                          <button
                            onClick={() => !used && toggleCard(rank, suit)}
                            disabled={used || (!selected && selectedCards.length >= maxCards)}
                            className={`w-10 h-12 rounded-md flex flex-col items-center justify-center text-sm transition-all ${
                              selected
                                ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                                : used
                                ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                                : selectedCards.length >= maxCards
                                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                                : 'bg-white hover:bg-gray-100 text-gray-800'
                            }`}
                          >
                            <span className={`font-bold ${selected ? '' : getSuitColor(suit)}`}>
                              {rank}
                            </span>
                            <span className={selected ? '' : getSuitColor(suit)}>
                              {getSuitSymbol(suit)}
                            </span>
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Done button */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </Modal>
    </div>
  )
}
