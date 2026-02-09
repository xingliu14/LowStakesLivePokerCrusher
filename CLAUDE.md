# CLAUDE.md - Low Stakes Live Poker Crusher

## Project Overview

Real-time poker strategy recommendations for low-stakes live games ($1/$2, $1/$3, $2/$5). Combines GTO base strategies with user-customizable adjustments learned from YouTube poker videos via AI transcript analysis.

## Architecture

### Two-Tier Strategy System
1. **Base Strategy:** GTO-inspired decision matrices organized by Position → Hand Category → Situation
2. **Learned Adjustments:** User-specific modifications extracted from YouTube videos, applied on top of base strategy

Strategy output format: `[fold%, call%, raise%]` - percentages must sum to 100.

## Poker Domain Knowledge

### Hand Categories
- **Premium:** AA, KK, QQ, AKs, AKo
- **Strong:** JJ, TT, AQs, AQo, AJs, KQs
- **Medium:** 99-77, ATs-A9s, suited connectors (JTs, T9s, etc.)
- **Speculative:** 66-22, A8s-A2s, suited connectors
- **Weak:** Everything else

### Situations
- **RFI:** Raise First In (no previous action)
- **vs_limp:** Facing limpers
- **vs_raise:** Facing a raise (3-bet opportunity)
- **vs_3bet:** Facing a 3-bet (4-bet opportunity)
- **vs_4bet:** Facing a 4-bet
- **cbet:** Continuation bet opportunity
- **facing_cbet:** Facing a continuation bet
- **check_raise:** Check-raise opportunity

### Board Textures
- **Dry:** Rainbow, disconnected (K♠ 7♥ 2♦)
- **Wet:** Connected or flush draws (T♠ 9♠ 7♥)
- **Paired:** Board pair (Q♥ Q♦ 5♣)
- **Monotone:** All same suit (A♠ 9♠ 4♠)

### Position Categories
- **Early:** UTG, UTG+1, UTG+2
- **Middle:** LJ (Lojack), HJ (Hijack)
- **Late:** CO (Cutoff), BTN (Button)
- **Blinds:** SB (Small Blind), BB (Big Blind)

### Stack Depth Considerations
- **Deep:** 100bb+ → Standard play
- **Medium:** 40-100bb → Slightly adjusted
- **Short:** 20-40bb → Aggressive adjustments
- **Very short:** <20bb → Push/fold strategy (not fully implemented)

### Live Game Adjustments
Live games typically feature looser, more passive play:
- More limping
- Less 3-betting
- More calling (less folding)
- Passive play (less aggression)

Strategy matrices and AI extraction prompts are tuned for this context.

## Key Design Decisions

### Strategy Engine (`src/lib/poker/strategy.ts`)
- Entry point: `getRecommendation()` returns both base and adjusted strategies
- All percentages must sum to 100 (normalization required)
- Stack depth matters: <30bb triggers short-stack adjustments
- Strategy matrices format: `Record<PositionCategory, Record<HandCategory, [fold%, call%, raise%]>>`

### AI Strategy Extraction (`src/lib/ai/extractStrategy.ts`)
- Uses OpenAI GPT-4o-mini with strict JSON output format
- Adjustment values clamped to -50 to +50 percentage points
- Extracts position-based, hand-specific, and situation-specific adjustments
- Validation critical for maintaining strategy integrity

### Data Persistence
- **localStorage:** Current implementation for learned strategies
- **Supabase:** Database schema exists but integration incomplete
- Hand history tracking not yet implemented

## Known Limitations

1. Hand history tracking not implemented (schema exists)
2. Supabase integration incomplete (using localStorage)
3. Authentication not implemented
4. Base strategies simplified (not solver-based GTO)
5. Postflop play basic (no hand strength evaluation or equity calculator)
6. Multi-way pots and ICM not fully considered
7. Tournament strategy not included

## Critical Rules

- All strategy percentages must sum to 100
- AI extraction must maintain strict JSON output format
- Stack depth and position are critical factors in all strategies
- Types defined in `src/types/poker.ts` are the source of truth
- Strategy matrices in `src/lib/poker/strategy.ts` drive all recommendations
