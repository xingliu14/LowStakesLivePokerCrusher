'use client'

interface PotSizeProps {
  value: number
  onChange: (pot: number) => void
}

export default function PotSize({ value, onChange }: PotSizeProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-2">
        Pot Size (BB)
      </label>

      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(0, parseFloat(e.target.value) || 0))}
          min={0}
          step={0.5}
          className="w-24 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <span className="text-white/50 text-sm">big blinds</span>
      </div>

      {/* Quick pot sizes */}
      <div className="flex gap-2 mt-2">
        {[6, 12, 20, 40].map(pot => (
          <button
            key={pot}
            onClick={() => onChange(pot)}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              value === pot
                ? 'bg-emerald-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {pot}BB
          </button>
        ))}
      </div>
    </div>
  )
}
