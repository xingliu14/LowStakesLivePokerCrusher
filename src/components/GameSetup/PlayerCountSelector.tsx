'use client'

interface PlayerCountSelectorProps {
  value: number
  onChange: (count: number) => void
}

const PLAYER_COUNTS = [2, 3, 4, 5, 6, 7, 8, 9]

export default function PlayerCountSelector({ value, onChange }: PlayerCountSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-2">
        Players at Table
      </label>
      <div className="flex flex-wrap gap-2">
        {PLAYER_COUNTS.map((count) => (
          <button
            key={count}
            onClick={() => onChange(count)}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
              value === count
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            {count}
          </button>
        ))}
      </div>
      <p className="text-xs text-white/50 mt-1">
        {value === 2 ? 'Heads up' : value <= 6 ? 'Short-handed' : 'Full ring'}
      </p>
    </div>
  )
}
