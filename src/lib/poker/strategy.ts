import {
  Position,
  HandCategory,
  Situation,
  Recommendation,
  GameState,
  Card,
  BoardTexture,
  StrategyAdjustment,
  PlayerAction
} from '@/types/poker'
import { categorizeHand } from './hands'
import { getPositionCategory, PositionCategory } from './positions'

// Base preflop RFI (Raise First In) strategy
// Format: [fold%, call%, raise%]
const PREFLOP_RFI: Record<PositionCategory, Record<HandCategory, [number, number, number]>> = {
  early: {
    premium: [0, 0, 100],
    strong: [0, 0, 100],
    medium: [20, 0, 80],
    speculative: [70, 0, 30],
    weak: [100, 0, 0]
  },
  middle: {
    premium: [0, 0, 100],
    strong: [0, 0, 100],
    medium: [0, 0, 100],
    speculative: [40, 0, 60],
    weak: [90, 0, 10]
  },
  late: {
    premium: [0, 0, 100],
    strong: [0, 0, 100],
    medium: [0, 0, 100],
    speculative: [10, 0, 90],
    weak: [60, 0, 40]
  },
  blinds: {
    premium: [0, 0, 100],
    strong: [0, 0, 100],
    medium: [0, 0, 100],
    speculative: [30, 0, 70],
    weak: [70, 0, 30]
  }
}

// Vs raise strategy (calling or 3-betting a raise)
const VS_RAISE: Record<PositionCategory, Record<HandCategory, [number, number, number]>> = {
  early: {
    premium: [0, 20, 80],
    strong: [10, 70, 20],
    medium: [40, 50, 10],
    speculative: [80, 15, 5],
    weak: [100, 0, 0]
  },
  middle: {
    premium: [0, 15, 85],
    strong: [5, 65, 30],
    medium: [30, 55, 15],
    speculative: [70, 20, 10],
    weak: [95, 5, 0]
  },
  late: {
    premium: [0, 10, 90],
    strong: [0, 50, 50],
    medium: [15, 60, 25],
    speculative: [50, 35, 15],
    weak: [85, 10, 5]
  },
  blinds: {
    premium: [0, 10, 90],
    strong: [0, 60, 40],
    medium: [20, 65, 15],
    speculative: [55, 35, 10],
    weak: [90, 8, 2]
  }
}

// Vs 3-bet strategy
const VS_3BET: Record<HandCategory, [number, number, number]> = {
  premium: [0, 20, 80], // 4-bet or call
  strong: [20, 60, 20],
  medium: [50, 40, 10],
  speculative: [80, 15, 5],
  weak: [100, 0, 0]
}

// Vs limpers (from late position / blinds)
const VS_LIMP: Record<PositionCategory, Record<HandCategory, [number, number, number]>> = {
  early: {
    premium: [0, 0, 100],
    strong: [0, 0, 100],
    medium: [10, 20, 70],
    speculative: [30, 40, 30],
    weak: [80, 15, 5]
  },
  middle: {
    premium: [0, 0, 100],
    strong: [0, 0, 100],
    medium: [0, 10, 90],
    speculative: [15, 35, 50],
    weak: [60, 25, 15]
  },
  late: {
    premium: [0, 0, 100],
    strong: [0, 0, 100],
    medium: [0, 5, 95],
    speculative: [5, 25, 70],
    weak: [40, 30, 30]
  },
  blinds: {
    premium: [0, 0, 100],
    strong: [0, 0, 100],
    medium: [0, 20, 80],
    speculative: [10, 40, 50],
    weak: [50, 35, 15]
  }
}

// C-bet strategy based on board texture
const CBET_STRATEGY: Record<BoardTexture, Record<HandCategory, [number, number, number]>> = {
  dry: {
    premium: [0, 0, 100],
    strong: [0, 10, 90],
    medium: [10, 20, 70],
    speculative: [30, 20, 50],
    weak: [40, 30, 30]
  },
  wet: {
    premium: [0, 5, 95],
    strong: [0, 25, 75],
    medium: [15, 35, 50],
    speculative: [40, 35, 25],
    weak: [60, 30, 10]
  },
  paired: {
    premium: [0, 10, 90],
    strong: [0, 20, 80],
    medium: [5, 30, 65],
    speculative: [25, 35, 40],
    weak: [45, 35, 20]
  },
  monotone: {
    premium: [0, 15, 85],
    strong: [5, 35, 60],
    medium: [20, 40, 40],
    speculative: [50, 35, 15],
    weak: [70, 25, 5]
  }
}

// Facing c-bet strategy
const FACING_CBET: Record<BoardTexture, Record<HandCategory, [number, number, number]>> = {
  dry: {
    premium: [0, 40, 60],
    strong: [10, 70, 20],
    medium: [35, 55, 10],
    speculative: [60, 35, 5],
    weak: [90, 8, 2]
  },
  wet: {
    premium: [0, 35, 65],
    strong: [5, 65, 30],
    medium: [25, 60, 15],
    speculative: [50, 40, 10],
    weak: [85, 12, 3]
  },
  paired: {
    premium: [0, 45, 55],
    strong: [10, 70, 20],
    medium: [40, 50, 10],
    speculative: [65, 30, 5],
    weak: [92, 6, 2]
  },
  monotone: {
    premium: [0, 30, 70],
    strong: [0, 55, 45],
    medium: [20, 60, 20],
    speculative: [45, 45, 10],
    weak: [80, 15, 5]
  }
}

// Determine the situation based on actions
export function determineSituation(actions: PlayerAction[], myPosition: Position): Situation {
  const hasRaise = actions.some(a => a.action === 'raise' || a.action === 'bet')
  const has3Bet = actions.filter(a => a.action === 'raise').length >= 2
  const has4Bet = actions.filter(a => a.action === 'raise').length >= 3
  const hasLimp = actions.some(a => a.action === 'call' && !hasRaise)

  if (has4Bet) return 'vs_4bet'
  if (has3Bet) return 'vs_3bet'
  if (hasRaise) return 'vs_raise'
  if (hasLimp) return 'vs_limp'
  return 'RFI'
}

// Get preflop recommendation
export function getPreflopRecommendation(
  holeCards: [Card, Card],
  position: Position,
  situation: Situation,
  stackDepth: number
): Recommendation {
  const handCategory = categorizeHand(holeCards)
  const positionCategory = getPositionCategory(position)

  let strategy: [number, number, number]

  switch (situation) {
    case 'RFI':
      strategy = PREFLOP_RFI[positionCategory][handCategory]
      break
    case 'vs_limp':
      strategy = VS_LIMP[positionCategory][handCategory]
      break
    case 'vs_raise':
      strategy = VS_RAISE[positionCategory][handCategory]
      break
    case 'vs_3bet':
      strategy = VS_3BET[handCategory]
      break
    case 'vs_4bet':
      // Very tight vs 4-bet
      if (handCategory === 'premium') {
        strategy = [0, 30, 70]
      } else if (handCategory === 'strong') {
        strategy = [50, 40, 10]
      } else {
        strategy = [100, 0, 0]
      }
      break
    default:
      strategy = [50, 25, 25]
  }

  // Stack depth adjustments
  if (stackDepth < 30) {
    // Short stack: more all-in/fold
    if (handCategory === 'premium' || handCategory === 'strong') {
      strategy = [strategy[0] * 0.5, strategy[1] * 0.3, strategy[2] + strategy[1] * 0.7 + strategy[0] * 0.5]
    }
  }

  // Normalize to ensure total is 100
  const total = strategy[0] + strategy[1] + strategy[2]

  return {
    fold: Math.round(strategy[0] / total * 100),
    call: Math.round(strategy[1] / total * 100),
    raise: Math.round(strategy[2] / total * 100),
    raiseSize: getRaiseSize(situation, stackDepth)
  }
}

// Get postflop recommendation
export function getPostflopRecommendation(
  handCategory: HandCategory,
  boardTexture: BoardTexture,
  situation: Situation,
  position: Position
): Recommendation {
  let strategy: [number, number, number]

  if (situation === 'cbet') {
    strategy = CBET_STRATEGY[boardTexture][handCategory]
  } else if (situation === 'facing_cbet') {
    strategy = FACING_CBET[boardTexture][handCategory]
  } else {
    // Default postflop play
    strategy = [40, 40, 20]
  }

  const total = strategy[0] + strategy[1] + strategy[2]

  return {
    fold: Math.round(strategy[0] / total * 100),
    call: Math.round(strategy[1] / total * 100),
    raise: Math.round(strategy[2] / total * 100),
    raiseSize: situation === 'cbet' ? 50 : 100 // % of pot
  }
}

// Get suggested raise size
function getRaiseSize(situation: Situation, stackDepth: number): number {
  switch (situation) {
    case 'RFI':
      return 3 // 3BB open
    case 'vs_limp':
      return 4 // 4BB iso-raise
    case 'vs_raise':
      return 9 // 3x 3-bet
    case 'vs_3bet':
      return 22 // 2.5x 4-bet
    default:
      return 3
  }
}

// Apply learned strategy adjustments
export function applyAdjustments(
  base: Recommendation,
  adjustments: StrategyAdjustment[],
  handCategory: HandCategory,
  position: Position,
  situation: Situation
): Recommendation {
  let fold = base.fold
  let call = base.call
  let raise = base.raise

  for (const adj of adjustments) {
    if (!adj.isActive) continue

    // Check if adjustment applies to this situation
    const matchesHand = !adj.handCategory || adj.handCategory === handCategory
    const matchesPosition = !adj.position || adj.position === position
    const matchesSituation = !adj.situation || adj.situation === situation

    if (matchesHand && matchesPosition && matchesSituation) {
      fold += adj.foldAdjust || 0
      call += adj.callAdjust || 0
      raise += adj.raiseAdjust || 0
    }
  }

  // Clamp and normalize
  fold = Math.max(0, Math.min(100, fold))
  call = Math.max(0, Math.min(100, call))
  raise = Math.max(0, Math.min(100, raise))

  const total = fold + call + raise
  if (total === 0) {
    return { fold: 34, call: 33, raise: 33 }
  }

  return {
    fold: Math.round(fold / total * 100),
    call: Math.round(call / total * 100),
    raise: Math.round(raise / total * 100),
    raiseSize: base.raiseSize
  }
}

// Get full recommendation based on game state
export function getRecommendation(
  gameState: GameState,
  adjustments: StrategyAdjustment[] = []
): { base: Recommendation; adjusted: Recommendation } {
  if (gameState.holeCards.length !== 2) {
    return {
      base: { fold: 33, call: 33, raise: 34 },
      adjusted: { fold: 33, call: 33, raise: 34 }
    }
  }

  const holeCards = gameState.holeCards as [Card, Card]
  const handCategory = categorizeHand(holeCards)
  const situation = determineSituation(gameState.actions, gameState.myPosition)

  let base: Recommendation

  if (gameState.street === 'preflop') {
    base = getPreflopRecommendation(
      holeCards,
      gameState.myPosition,
      situation,
      gameState.effectiveStack
    )
  } else {
    // For postflop, we need board texture
    const boardTexture = analyzeBoardTexture(gameState.boardCards)
    base = getPostflopRecommendation(
      handCategory,
      boardTexture,
      situation,
      gameState.myPosition
    )
  }

  const adjusted = applyAdjustments(
    base,
    adjustments,
    handCategory,
    gameState.myPosition,
    situation
  )

  return { base, adjusted }
}

// Analyze board texture
export function analyzeBoardTexture(boardCards: Card[]): BoardTexture {
  if (boardCards.length < 3) return 'dry'

  const suits = boardCards.map(c => c.suit)
  const uniqueSuits = new Set(suits).size

  // Check for monotone (all same suit)
  if (uniqueSuits === 1) return 'monotone'

  // Check for paired board
  const ranks = boardCards.map(c => c.rank)
  const rankCounts = ranks.reduce((acc, r) => {
    acc[r] = (acc[r] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (Object.values(rankCounts).some(c => c >= 2)) return 'paired'

  // Check for flush draw possibility (3 of same suit)
  const suitCounts = suits.reduce((acc, s) => {
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (Object.values(suitCounts).some(c => c >= 3)) return 'wet'

  // Check for straight draw connectivity
  // This is simplified - a wet board has connected cards
  const rankValues = boardCards.map(c => {
    const order = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
    return order.indexOf(c.rank)
  }).sort((a, b) => a - b)

  const maxGap = Math.max(
    rankValues[1] - rankValues[0],
    rankValues[2] - rankValues[1]
  )

  if (maxGap <= 2) return 'wet'

  return 'dry'
}
