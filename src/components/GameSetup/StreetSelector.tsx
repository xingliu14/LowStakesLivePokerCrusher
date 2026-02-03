'use client'

import { Street } from '@/types/poker'

interface StreetSelectorProps {
  value: Street
  onChange: (street: Street) => void
}

const STREETS: { value: Street; label: string }[] = [
  { value: 'preflop', label: 'Preflop' },
  { value: 'flop', label: 'Flop' },
  { value: 'turn', label: 'Turn' },
  { value: 'river', label: 'River' },
]

export default function StreetSelector({ value, onChange }: StreetSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-2">
        Street
      </label>
      <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
        {STREETS.map(street => (
          <button
            key={street.value}
            onClick={() => onChange(street.value)}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              value === street.value
                ? 'bg-emerald-600 text-white shadow'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {street.label}
          </button>
        ))}
      </div>
    </div>
  )
}
