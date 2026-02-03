import { Recommendation, ActionType } from '@/types/poker'

// Weighted random sampling to select an action based on recommendation probabilities
export function sampleAction(recommendation: Recommendation): ActionType {
  const random = Math.random() * 100

  if (random < recommendation.fold) {
    return 'fold'
  } else if (random < recommendation.fold + recommendation.call) {
    return 'call'
  } else {
    return 'raise'
  }
}

// Get a descriptive string for the selected action
export function getActionDescription(
  action: ActionType,
  recommendation: Recommendation
): string {
  switch (action) {
    case 'fold':
      return 'Fold'
    case 'call':
      return 'Call'
    case 'raise':
      if (recommendation.raiseSize) {
        return `Raise to ${recommendation.raiseSize}BB`
      }
      return 'Raise'
    default:
      return action
  }
}

// Animation helper: get intermediate values for probability bars
export function animateValue(
  start: number,
  end: number,
  duration: number,
  callback: (value: number) => void
): () => void {
  const startTime = performance.now()
  let animationFrame: number

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3)
    const value = start + (end - start) * eased

    callback(value)

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate)
    }
  }

  animationFrame = requestAnimationFrame(animate)

  // Return cleanup function
  return () => cancelAnimationFrame(animationFrame)
}

// Shuffle array (Fisher-Yates)
export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
