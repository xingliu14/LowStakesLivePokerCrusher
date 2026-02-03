'use client'

import { Stakes } from '@/types/poker'

interface StakeSelectorProps {
  value: Stakes
  onChange: (stakes: Stakes) => void
}

const PRESET_STAKES: Stakes[] = [
  { smallBlind: 1, bigBlind: 2, label: '$1/$2' },
  { smallBlind: 1, bigBlind: 3, label: '$1/$3' },
  { smallBlind: 2, bigBlind: 5, label: '$2/$5' },
]

export default function StakeSelector({ value, onChange }: StakeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-2">
        Stakes
      </label>
      <div className="flex flex-wrap gap-2">
        {PRESET_STAKES.map((stake) => (
          <button
            key={stake.label}
            onClick={() => onChange(stake)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              value.label === stake.label
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            {stake.label}
          </button>
        ))}
      </div>
    </div>
  )
}
