import { StrategyAdjustment, Position, HandCategory, Situation } from '@/types/poker'

interface ExtractionResult {
  adjustments: Omit<StrategyAdjustment, 'source' | 'videoUrl' | 'isActive'>[]
  summary: string
  error?: string
}

const EXTRACTION_PROMPT = `You are a poker strategy analyzer. Given a transcript from a poker strategy video, extract specific strategic adjustments that modify standard play.

Focus on extracting:
1. Position-based adjustments (e.g., "play tighter from UTG", "widen your range on the button")
2. Hand-specific adjustments (e.g., "3-bet suited connectors more", "fold small pairs to 4-bets")
3. Situation-specific adjustments (e.g., "c-bet more on dry boards", "check-raise more vs aggressive players")

Output format - respond ONLY with valid JSON:
{
  "summary": "Brief 1-2 sentence summary of the video's main strategic advice",
  "adjustments": [
    {
      "description": "What the adjustment is about",
      "position": "UTG" | "UTG+1" | "UTG+2" | "LJ" | "HJ" | "CO" | "BTN" | "SB" | "BB" | null,
      "handCategory": "premium" | "strong" | "medium" | "speculative" | "weak" | null,
      "situation": "RFI" | "vs_limp" | "vs_raise" | "vs_3bet" | "vs_4bet" | "cbet" | "facing_cbet" | null,
      "foldAdjust": number (-50 to +50) or null,
      "callAdjust": number (-50 to +50) or null,
      "raiseAdjust": number (-50 to +50) or null
    }
  ]
}

Rules:
- Only extract clear, actionable adjustments
- Use null for fields that don't apply
- Adjustments are in percentage points (e.g., +10 means add 10% to that action)
- foldAdjust + callAdjust + raiseAdjust should roughly balance to 0
- Maximum 10 adjustments per video
- If no clear adjustments can be extracted, return empty adjustments array

Hand categories:
- premium: AA, KK, QQ, AK
- strong: JJ, TT, AQ, AJs, KQs
- medium: 99-77, medium suited connectors
- speculative: small pairs, suited aces, suited connectors
- weak: everything else

Situations:
- RFI: Raise First In (no previous raises)
- vs_limp: Facing limpers
- vs_raise: Facing a raise
- vs_3bet: Facing a 3-bet
- vs_4bet: Facing a 4-bet
- cbet: Continuation bet opportunity
- facing_cbet: Facing a continuation bet`

export async function extractStrategyFromTranscript(
  transcript: string,
  apiKey: string
): Promise<ExtractionResult> {
  if (!apiKey) {
    return {
      adjustments: [],
      summary: '',
      error: 'No API key provided'
    }
  }

  // Truncate very long transcripts
  const maxLength = 15000
  const truncatedTranscript = transcript.length > maxLength
    ? transcript.slice(0, maxLength) + '... [truncated]'
    : transcript

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: EXTRACTION_PROMPT
          },
          {
            role: 'user',
            content: `Extract poker strategy adjustments from this video transcript:\n\n${truncatedTranscript}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        adjustments: [],
        summary: '',
        error: error.error?.message || 'OpenAI API error'
      }
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      return {
        adjustments: [],
        summary: '',
        error: 'No response from AI'
      }
    }

    // Parse JSON response
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const parsed = JSON.parse(jsonMatch[0])

      // Validate adjustments
      const validAdjustments = (parsed.adjustments || [])
        .filter((adj: Record<string, unknown>) => {
          // Must have at least one adjustment value
          return adj.foldAdjust !== null || adj.callAdjust !== null || adj.raiseAdjust !== null
        })
        .map((adj: Record<string, unknown>) => ({
          description: String(adj.description || ''),
          position: validatePosition(adj.position as string | null),
          handCategory: validateHandCategory(adj.handCategory as string | null),
          situation: validateSituation(adj.situation as string | null),
          foldAdjust: clampAdjustment(adj.foldAdjust as number | null),
          callAdjust: clampAdjustment(adj.callAdjust as number | null),
          raiseAdjust: clampAdjustment(adj.raiseAdjust as number | null)
        }))

      return {
        adjustments: validAdjustments,
        summary: parsed.summary || ''
      }
    } catch (parseError) {
      return {
        adjustments: [],
        summary: '',
        error: 'Failed to parse AI response'
      }
    }
  } catch (error) {
    return {
      adjustments: [],
      summary: '',
      error: 'Network error while contacting OpenAI'
    }
  }
}

function validatePosition(pos: string | null): Position | undefined {
  const valid: Position[] = ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']
  return pos && valid.includes(pos as Position) ? pos as Position : undefined
}

function validateHandCategory(cat: string | null): HandCategory | undefined {
  const valid: HandCategory[] = ['premium', 'strong', 'medium', 'speculative', 'weak']
  return cat && valid.includes(cat as HandCategory) ? cat as HandCategory : undefined
}

function validateSituation(sit: string | null): Situation | undefined {
  const valid: Situation[] = ['RFI', 'vs_limp', 'vs_raise', 'vs_3bet', 'vs_4bet', 'cbet', 'facing_cbet']
  return sit && valid.includes(sit as Situation) ? sit as Situation : undefined
}

function clampAdjustment(value: number | null): number | undefined {
  if (value === null || value === undefined) return undefined
  return Math.max(-50, Math.min(50, value))
}
