# CLAUDE.md - Low Stakes Live Poker Crusher

## Project Overview

This is a Next.js web application that provides real-time poker strategy recommendations for low-stakes live poker games. The app combines GTO (Game Theory Optimal) base strategies with user-customizable adjustments learned from YouTube poker strategy videos.

**Key Features:**
- Real-time poker hand analysis and strategy recommendations
- Position-aware, situation-based strategy suggestions
- YouTube video transcript analysis to extract custom strategy adjustments
- AI-powered strategy extraction using OpenAI GPT-4o-mini
- Preflop and postflop decision support
- User-specific learned strategies stored in Supabase

**Target Audience:** Low-stakes live poker players ($1/$2, $1/$3, $2/$5) looking to improve their game.

## Tech Stack

### Frontend
- **Framework:** Next.js 14.2.0 (App Router)
- **UI:** React 18.2.0 with TypeScript
- **Styling:** Tailwind CSS 3.4.0
- **State Management:** React hooks with custom hooks for game state

### Backend & Services
- **Database:** Supabase (PostgreSQL with Row Level Security)
- **Authentication:** Supabase Auth
- **AI/ML:** OpenAI API (gpt-4o-mini for strategy extraction)
- **YouTube Integration:** youtube-transcript 1.2.1

### Development
- **Language:** TypeScript 5.2.0
- **Linting:** ESLint with Next.js config
- **Build:** Next.js build system

## Project Structure

```
/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Main game interface (home page)
│   │   ├── layout.tsx         # Root layout
│   │   ├── learn/             # YouTube video learning page
│   │   │   └── page.tsx
│   │   ├── settings/          # User settings page
│   │   │   └── page.tsx
│   │   └── api/               # API routes
│   │       └── youtube/
│   │           └── transcript/
│   │               └── route.ts
│   │
│   ├── components/            # React components
│   │   ├── ui/               # Basic UI components (Button, Card, Modal)
│   │   ├── GameSetup/        # Game state input components
│   │   ├── Strategy/         # Strategy display components
│   │   └── YouTube/          # YouTube learning components
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useStrategy.ts    # Strategy calculation hook
│   │   ├── useLocalStorage.ts
│   │   └── useGameState.ts   # (imported but not in file list)
│   │
│   ├── lib/                  # Core business logic
│   │   ├── poker/           # Poker-specific logic
│   │   │   ├── strategy.ts  # Strategy calculation engine
│   │   │   ├── hands.ts     # Hand categorization
│   │   │   ├── positions.ts # Position utilities
│   │   │   └── sampler.ts   # Randomization for GTO play
│   │   ├── ai/
│   │   │   └── extractStrategy.ts  # AI strategy extraction
│   │   ├── youtube/
│   │   │   └── transcript.ts       # YouTube transcript fetching
│   │   └── supabase/
│   │       └── client.ts           # Supabase client
│   │
│   └── types/
│       └── poker.ts          # TypeScript type definitions
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Database schema
│
├── .env.example              # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Core Concepts

### 1. Game State (`GameState`)
The central data structure representing the current poker situation:
- **Stakes:** Big blind/small blind amounts
- **Position:** Player's table position (UTG, CO, BTN, etc.)
- **Cards:** Hole cards and board cards
- **Street:** Current betting round (preflop, flop, turn, river)
- **Stack:** Effective stack size in big blinds
- **Actions:** Previous player actions in the hand

### 2. Strategy System
The app uses a two-tier strategy system:

**Base Strategy:**
- Preloaded GTO-inspired decision matrices
- Organized by: Position → Hand Category → Situation
- Returns probability distributions [fold%, call%, raise%]

**Learned Adjustments:**
- User-specific modifications extracted from YouTube videos
- Applied on top of base strategy
- Can be toggled on/off individually

### 3. Hand Categories
Hands are classified into 5 categories:
- **Premium:** AA, KK, QQ, AKs, AKo
- **Strong:** JJ, TT, AQs, AQo, AJs, KQs
- **Medium:** 99-77, ATs-A9s, suited connectors (JTs, T9s, etc.)
- **Speculative:** 66-22, A8s-A2s, suited connectors
- **Weak:** Everything else

### 4. Situations
Different action scenarios:
- **RFI:** Raise First In (no previous action)
- **vs_limp:** Facing limpers
- **vs_raise:** Facing a raise
- **vs_3bet:** Facing a 3-bet
- **vs_4bet:** Facing a 4-bet
- **cbet:** Continuation bet opportunity
- **facing_cbet:** Facing a continuation bet
- **check_raise:** Check-raise opportunity

### 5. Board Textures (Postflop)
- **Dry:** Rainbow, disconnected (e.g., K♠ 7♥ 2♦)
- **Wet:** Connected or flush draws possible (e.g., T♠ 9♠ 7♥)
- **Paired:** Board contains a pair (e.g., Q♥ Q♦ 5♣)
- **Monotone:** All same suit (e.g., A♠ 9♠ 4♠)

## Key Files Deep Dive

### `src/types/poker.ts`
**The type system foundation.** All poker-related types are defined here:
- Card types (Rank, Suit, Card)
- Position types
- Action types
- Game state
- Strategy types (HandCategory, Situation, BoardTexture)
- Recommendation format
- StrategyAdjustment interface

### `src/lib/poker/strategy.ts`
**The strategy engine.** Contains:
- Base strategy matrices (PREFLOP_RFI, VS_RAISE, VS_3BET, etc.)
- `determineSituation()`: Analyzes player actions to determine the situation
- `getPreflopRecommendation()`: Returns preflop strategy
- `getPostflopRecommendation()`: Returns postflop strategy
- `applyAdjustments()`: Applies learned adjustments to base strategy
- `getRecommendation()`: Main entry point that combines everything
- `analyzeBoardTexture()`: Classifies board texture
- Stack depth adjustments for short stacks (<30bb)

**Strategy Matrices Format:**
```typescript
Record<PositionCategory, Record<HandCategory, [fold%, call%, raise%]>>
```

### `src/lib/poker/hands.ts`
Hand categorization logic:
- `categorizeHand()`: Classifies a two-card hand into a HandCategory
- `getHandNotation()`: Converts cards to standard poker notation (e.g., "AKs", "22")
- Pair detection, suited detection, connector detection

### `src/lib/poker/positions.ts`
Position utilities:
- `getPositionCategory()`: Maps specific positions to categories (early/middle/late/blinds)
- Position ordering for action sequences
- Available positions based on player count

### `src/lib/ai/extractStrategy.ts`
**AI Strategy Extraction:**
- Uses OpenAI GPT-4o-mini to analyze YouTube transcripts
- Extracts specific strategy adjustments (position, hand, situation, action adjustments)
- Validates and clamps adjustment values (-50 to +50 percentage points)
- Returns structured `StrategyAdjustment` objects

**Prompt Engineering:**
The system prompt instructs the AI to extract:
1. Position-based adjustments
2. Hand-specific adjustments
3. Situation-specific adjustments

Output format is strict JSON with validation.

### `src/app/page.tsx`
**Main game interface:**
- Two-column layout (game setup left, recommendations right)
- Real-time strategy updates as user inputs change
- Uses `useGameState()` for managing game state
- Uses `useStrategy()` for calculating recommendations
- Toggle for showing base vs adjusted strategy

### `supabase/migrations/001_initial_schema.sql`
**Database schema:**
1. **profiles:** User profiles with optional encrypted OpenAI key
2. **base_strategies:** Preloaded strategy charts (public read-only)
3. **learned_strategies:** User's extracted YouTube strategies
4. **hand_history:** Optional hand tracking (not yet implemented)

All tables have Row Level Security (RLS) policies.

## Data Flow

### Strategy Recommendation Flow
1. User inputs game state (cards, position, actions, etc.)
2. `useGameState()` hook manages state updates
3. `useStrategy()` hook calculates recommendations:
   - Calls `getRecommendation()` from strategy.ts
   - Passes in game state and learned adjustments
4. Strategy engine:
   - Categorizes hand with `categorizeHand()`
   - Determines situation with `determineSituation()`
   - Looks up base strategy from appropriate matrix
   - Applies learned adjustments with `applyAdjustments()`
5. Returns both base and adjusted recommendations
6. UI displays probability bars and suggested actions

### YouTube Learning Flow
1. User pastes YouTube URL on /learn page
2. Frontend calls `/api/youtube/transcript` route
3. API fetches transcript using youtube-transcript library
4. API calls OpenAI to extract strategies using `extractStrategyFromTranscript()`
5. Structured adjustments are returned
6. User can save adjustments to Supabase (when implemented) or localStorage
7. Adjustments are applied in real-time to strategy recommendations

## Important Patterns & Conventions

### State Management
- Custom hooks for state encapsulation (useGameState, useStrategy)
- Local storage for persisting learned strategies
- Supabase for long-term persistence (not fully implemented)

### Component Organization
- UI components are purely presentational
- Business logic lives in /lib/poker
- Hooks bridge components and business logic
- Components organized by feature (GameSetup, Strategy, YouTube)

### Type Safety
- Strict TypeScript with comprehensive type definitions
- All poker entities have explicit types
- No use of `any` or type assertions without validation

### Naming Conventions
- Components: PascalCase (e.g., `CardPicker.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useStrategy.ts`)
- Types: PascalCase (e.g., `GameState`, `Position`)
- Constants: UPPER_SNAKE_CASE (e.g., `PREFLOP_RFI`)
- Functions: camelCase (e.g., `getPreflopRecommendation`)

### File Organization
- One component per file
- Related types imported from `@/types/poker`
- Utilities organized by domain (poker/, ai/, youtube/)
- Index files for clean imports from component directories

## Environment Variables

Required environment variables (see `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `OPENAI_API_KEY`: OpenAI API key (server-side or user-provided)

## Key Algorithms

### Hand Categorization
Located in `src/lib/poker/hands.ts`:
1. Check for pairs (categorize by rank)
2. Check if suited
3. Check for Broadway cards (T, J, Q, K, A)
4. Check for connectedness (sequential ranks)
5. Apply categorization rules based on rank + suited + connected

### Board Texture Analysis
Located in `src/lib/poker/strategy.ts` (`analyzeBoardTexture()`):
1. Count unique suits → if 1, it's monotone
2. Count rank frequencies → if any pair, it's paired
3. Check for flush draw potential (3 of same suit)
4. Check for straight draw potential (connected ranks)
5. Default to dry if none of the above

### Situation Determination
Located in `src/lib/poker/strategy.ts` (`determineSituation()`):
1. Count raises in action history
2. Check for limps (calls without raises)
3. Map to appropriate situation:
   - 0 raises, 0 limps → RFI
   - 0 raises, has limps → vs_limp
   - 1 raise → vs_raise
   - 2 raises → vs_3bet
   - 3+ raises → vs_4bet

## Strategy Matrices

The app includes pre-computed strategy matrices for common situations:
- `PREFLOP_RFI`: Raise-first-in strategy by position and hand
- `VS_RAISE`: 3-betting and calling vs raises
- `VS_3BET`: 4-betting and calling vs 3-bets
- `VS_LIMP`: Isolation raising vs limpers
- `CBET_STRATEGY`: Continuation betting by board texture
- `FACING_CBET`: Responding to continuation bets

Each matrix is organized as:
```
Position Category → Hand Category → [Fold%, Call%, Raise%]
```

## Development Guidelines

### When Adding New Features

1. **New poker concepts:**
   - Add types to `src/types/poker.ts`
   - Add logic to appropriate file in `src/lib/poker/`
   - Update strategy matrices if needed

2. **New UI components:**
   - Create in appropriate subdirectory of `src/components/`
   - Follow existing component patterns
   - Use Tailwind for styling
   - Keep presentational (logic in hooks/lib)

3. **New strategy adjustments:**
   - Update AI extraction prompt in `extractStrategy.ts`
   - Add fields to `StrategyAdjustment` type
   - Update validation functions
   - Update database schema if persisting

4. **New pages:**
   - Create in `src/app/` following App Router conventions
   - Use layout.tsx for shared UI elements
   - Follow existing page structure patterns

### Testing Strategy Recommendations

To verify strategy logic:
1. Check matrices in `strategy.ts` for expected percentages
2. Test hand categorization with various hand types
3. Verify situation detection with different action sequences
4. Confirm adjustments are properly applied and normalized
5. Test edge cases (short stacks, 4-bet scenarios, etc.)

## Known Limitations & TODOs

Based on the current codebase:
1. Hand history tracking not implemented (schema exists)
2. Supabase integration for learned strategies not complete (using localStorage)
3. Authentication system not implemented
4. Base strategies are simplified (not true solver-based GTO)
5. Postflop play is basic (no hand strength evaluation)
6. No equity calculator integration
7. Multi-way pots not fully considered
8. ICM situations not accounted for
9. Tournament-specific strategy not included

## Poker-Specific Notes

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
The app is designed for live games, which typically feature:
- Looser play (more limping)
- Less 3-betting
- More calling (less folding)
- Passive play (less aggression)

This is reflected in the strategy matrices and suggested in YouTube learning prompts.

## Future Claude Reference

When working on this codebase:
1. Always refer to `src/types/poker.ts` for type definitions
2. Strategy changes should update matrices in `src/lib/poker/strategy.ts`
3. Hand categorization logic is in `src/lib/poker/hands.ts`
4. The main recommendation engine is `getRecommendation()` in strategy.ts
5. AI extraction logic should maintain strict JSON output format
6. All percentages in recommendations should sum to 100 (normalization required)
7. Stack depth and position are critical factors in all strategies
8. Board texture significantly impacts postflop play

## Quick Reference: Common Tasks

**Add a new position:**
1. Add to `Position` type in poker.ts
2. Update `getPositionCategory()` in positions.ts
3. Test with various hand scenarios

**Modify a strategy matrix:**
1. Locate matrix in strategy.ts (e.g., `PREFLOP_RFI`)
2. Update percentages (ensure they sum to 100)
3. Consider position/hand category interactions

**Add new board texture:**
1. Add to `BoardTexture` type
2. Update `analyzeBoardTexture()` logic
3. Add to `CBET_STRATEGY` and `FACING_CBET` matrices

**Enhance AI extraction:**
1. Update `EXTRACTION_PROMPT` in extractStrategy.ts
2. Update validation functions
3. Test with sample transcripts

---

**Last Updated:** 2026-02-03
**Project Status:** Early development, core functionality working
**Primary Developer:** xingliu
