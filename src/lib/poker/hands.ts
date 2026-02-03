import { Card, Rank, HandCategory } from '@/types/poker'

const RANK_ORDER: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']

export function getRankValue(rank: Rank): number {
  return RANK_ORDER.indexOf(rank)
}

export function isPair(cards: [Card, Card]): boolean {
  return cards[0].rank === cards[1].rank
}

export function isSuited(cards: [Card, Card]): boolean {
  return cards[0].suit === cards[1].suit
}

export function isConnector(cards: [Card, Card]): boolean {
  const diff = Math.abs(getRankValue(cards[0].rank) - getRankValue(cards[1].rank))
  // Handle A-2 as connector
  if (
    (cards[0].rank === 'A' && cards[1].rank === '2') ||
    (cards[0].rank === '2' && cards[1].rank === 'A')
  ) {
    return true
  }
  return diff === 1
}

export function isOneGapper(cards: [Card, Card]): boolean {
  const diff = Math.abs(getRankValue(cards[0].rank) - getRankValue(cards[1].rank))
  return diff === 2
}

export function getHighCard(cards: [Card, Card]): Rank {
  const v0 = getRankValue(cards[0].rank)
  const v1 = getRankValue(cards[1].rank)
  return v0 > v1 ? cards[0].rank : cards[1].rank
}

export function getLowCard(cards: [Card, Card]): Rank {
  const v0 = getRankValue(cards[0].rank)
  const v1 = getRankValue(cards[1].rank)
  return v0 < v1 ? cards[0].rank : cards[1].rank
}

// Convert hole cards to a standard notation (e.g., "AKs", "QQ", "T9o")
export function getHandNotation(cards: [Card, Card]): string {
  const high = getHighCard(cards)
  const low = getLowCard(cards)

  if (isPair(cards)) {
    return `${high}${high}`
  }

  const suffix = isSuited(cards) ? 's' : 'o'
  return `${high}${low}${suffix}`
}

// Categorize a hand into strategy categories
export function categorizeHand(cards: [Card, Card]): HandCategory {
  const notation = getHandNotation(cards)
  const high = getHighCard(cards)
  const low = getLowCard(cards)
  const suited = isSuited(cards)
  const pair = isPair(cards)

  // Premium: AA, KK, QQ, AKs, AKo
  if (pair && ['A', 'K', 'Q'].includes(high)) {
    return 'premium'
  }
  if (high === 'A' && low === 'K') {
    return 'premium'
  }

  // Strong: JJ, TT, AQs, AQo, AJs, KQs
  if (pair && ['J', 'T'].includes(high)) {
    return 'strong'
  }
  if (high === 'A' && low === 'Q') {
    return 'strong'
  }
  if (high === 'A' && low === 'J' && suited) {
    return 'strong'
  }
  if (high === 'K' && low === 'Q' && suited) {
    return 'strong'
  }

  // Medium: 99-77, ATs-A9s, KJs, QJs, JTs, T9s, 98s, 87s, 76s
  if (pair && getRankValue(high) >= getRankValue('7') && getRankValue(high) <= getRankValue('9')) {
    return 'medium'
  }
  if (high === 'A' && suited && getRankValue(low) >= getRankValue('9') && getRankValue(low) <= getRankValue('T')) {
    return 'medium'
  }
  // Broadway suited connectors
  const broadwaySuitedConnectors = ['KJs', 'QJs', 'JTs']
  if (suited && broadwaySuitedConnectors.includes(notation)) {
    return 'medium'
  }
  // Medium suited connectors
  const mediumSuitedConnectors = ['T9s', '98s', '87s', '76s']
  if (mediumSuitedConnectors.includes(notation)) {
    return 'medium'
  }

  // Speculative: 66-22, A8s-A2s, suited connectors, suited one-gappers
  if (pair && getRankValue(high) >= getRankValue('2') && getRankValue(high) <= getRankValue('6')) {
    return 'speculative'
  }
  if (high === 'A' && suited && getRankValue(low) <= getRankValue('8')) {
    return 'speculative'
  }
  // Lower suited connectors
  if (suited && isConnector(cards) && getRankValue(high) <= getRankValue('7')) {
    return 'speculative'
  }
  // Suited one-gappers with reasonable high cards
  if (suited && isOneGapper(cards) && getRankValue(high) >= getRankValue('9')) {
    return 'speculative'
  }
  // KTs, QTs, etc.
  if (suited && high === 'K' && getRankValue(low) >= getRankValue('T')) {
    return 'speculative'
  }

  // Everything else is weak
  return 'weak'
}

// Get all 52 cards
export function getDeck(): Card[] {
  const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades']
  const cards: Card[] = []

  for (const suit of suits) {
    for (const rank of RANK_ORDER) {
      cards.push({ rank, suit })
    }
  }

  return cards
}

// Display helpers
export function getSuitSymbol(suit: Card['suit']): string {
  const symbols = {
    hearts: '\u2665',
    diamonds: '\u2666',
    clubs: '\u2663',
    spades: '\u2660'
  }
  return symbols[suit]
}

export function getSuitColor(suit: Card['suit']): string {
  return suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-gray-900'
}

export function formatCard(card: Card): string {
  return `${card.rank}${getSuitSymbol(card.suit)}`
}
