'use client'

import { Card, Street } from '@/types/poker'
import CardPicker from './CardPicker'

interface BoardCardsProps {
  street: Street
  cards: Card[]
  onChange: (cards: Card[]) => void
  holeCards: Card[]
}

export default function BoardCards({ street, cards, onChange, holeCards }: BoardCardsProps) {
  const getMaxCards = (): number => {
    switch (street) {
      case 'preflop':
        return 0
      case 'flop':
        return 3
      case 'turn':
        return 4
      case 'river':
        return 5
    }
  }

  const maxCards = getMaxCards()

  if (maxCards === 0) {
    return null
  }

  return (
    <CardPicker
      selectedCards={cards}
      onSelect={onChange}
      maxCards={maxCards}
      label={`Board Cards (${street})`}
      usedCards={holeCards}
    />
  )
}
