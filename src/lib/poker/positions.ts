import { Position } from '@/types/poker'

// Full table (9-handed) positions in order
export const POSITIONS: Position[] = ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']

// Position descriptions
export const POSITION_NAMES: Record<Position, string> = {
  'UTG': 'Under the Gun',
  'UTG+1': 'Under the Gun +1',
  'UTG+2': 'Under the Gun +2',
  'LJ': 'Lojack',
  'HJ': 'Hijack',
  'CO': 'Cutoff',
  'BTN': 'Button',
  'SB': 'Small Blind',
  'BB': 'Big Blind'
}

// Position categories for strategy purposes
export type PositionCategory = 'early' | 'middle' | 'late' | 'blinds'

export function getPositionCategory(position: Position): PositionCategory {
  switch (position) {
    case 'UTG':
    case 'UTG+1':
    case 'UTG+2':
      return 'early'
    case 'LJ':
    case 'HJ':
      return 'middle'
    case 'CO':
    case 'BTN':
      return 'late'
    case 'SB':
    case 'BB':
      return 'blinds'
  }
}

// Get positions that act before a given position
export function getPositionsBefore(position: Position): Position[] {
  const index = POSITIONS.indexOf(position)
  return POSITIONS.slice(0, index)
}

// Get positions that act after a given position
export function getPositionsAfter(position: Position): Position[] {
  const index = POSITIONS.indexOf(position)
  return POSITIONS.slice(index + 1)
}

// Is this position in late position (CO or BTN)?
export function isLatePosition(position: Position): boolean {
  return position === 'CO' || position === 'BTN'
}

// Is this position in the blinds?
export function isBlind(position: Position): boolean {
  return position === 'SB' || position === 'BB'
}

// How many positions are left to act after this one (preflop)?
export function playersLeftToAct(position: Position): number {
  const index = POSITIONS.indexOf(position)
  // BB acts last preflop, so subtract 1 for SB and count remaining
  if (position === 'SB') return 1
  if (position === 'BB') return 0
  // Others: count positions from current to BB
  return POSITIONS.length - 1 - index
}
