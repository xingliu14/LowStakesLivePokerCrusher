// Card types
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A'

export interface Card {
  rank: Rank
  suit: Suit
}

// Position types
export type Position = 'UTG' | 'UTG+1' | 'UTG+2' | 'LJ' | 'HJ' | 'CO' | 'BTN' | 'SB' | 'BB'

// Action types
export type ActionType = 'fold' | 'check' | 'call' | 'bet' | 'raise' | 'all-in'

export interface PlayerAction {
  position: Position
  action: ActionType
  amount?: number // in big blinds
}

// Game state
export type Street = 'preflop' | 'flop' | 'turn' | 'river'

export interface Stakes {
  smallBlind: number
  bigBlind: number
  label: string
}

export interface GameState {
  stakes: Stakes
  myPosition: Position
  holeCards: [Card, Card] | [Card] | []
  street: Street
  boardCards: Card[]
  potSize: number // in big blinds
  effectiveStack: number // in big blinds
  actions: PlayerAction[] // actions that happened before us
}

// Strategy types
export type HandCategory =
  | 'premium'       // AA, KK, QQ, AKs, AKo
  | 'strong'        // JJ, TT, AQs, AQo, AJs, KQs
  | 'medium'        // 99-77, ATs-A9s, KJs, QJs, JTs, T9s, 98s, 87s, 76s
  | 'speculative'   // 66-22, A8s-A2s, KTs, suited connectors, suited one-gappers
  | 'weak'          // everything else

export type Situation =
  | 'RFI'           // Raise First In (no previous raises)
  | 'vs_limp'       // Facing limpers
  | 'vs_raise'      // Facing a raise
  | 'vs_3bet'       // Facing a 3-bet
  | 'vs_4bet'       // Facing a 4-bet
  | 'cbet'          // Continuation bet spot
  | 'facing_cbet'   // Facing a continuation bet
  | 'check_raise'   // Check-raise opportunity

export type BoardTexture = 'dry' | 'wet' | 'paired' | 'monotone'

export type PostflopHandStrength =
  | 'air'
  | 'weak_draw'
  | 'strong_draw'
  | 'weak_pair'
  | 'middle_pair'
  | 'top_pair_weak'
  | 'top_pair_good'
  | 'overpair'
  | 'two_pair'
  | 'set'
  | 'straight'
  | 'flush'
  | 'full_house'
  | 'quads'
  | 'straight_flush'

export interface Recommendation {
  fold: number    // percentage 0-100
  call: number    // percentage 0-100
  raise: number   // percentage 0-100
  raiseSize?: number // suggested raise size in BB or pot %
}

export interface StrategyAdjustment {
  source: string  // video title or description
  videoUrl: string
  position?: Position
  handCategory?: HandCategory
  situation?: Situation
  foldAdjust?: number   // e.g., +5 means add 5% to fold
  callAdjust?: number
  raiseAdjust?: number
  isActive: boolean
}

export interface BaseStrategy {
  id: number
  street: Street
  position: Position
  handCategory: HandCategory
  situation: Situation
  boardTexture?: BoardTexture
  stackDepthMin: number
  stackDepthMax: number
  fold: number
  call: number
  raise: number
  raiseSize: number
}
