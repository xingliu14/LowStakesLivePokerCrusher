'use client'

interface StackInputProps {
  value: number
  onChange: (stack: number) => void
}

const PRESET_STACKS = [50, 100, 150, 200]

export default function StackInput({ value, onChange }: StackInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-2">
        Effective Stack (BB)
      </label>

      {/* Preset buttons */}
      <div className="flex gap-2 mb-2">
        {PRESET_STACKS.map(stack => (
          <button
            key={stack}
            onClick={() => onChange(stack)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              value === stack
                ? 'bg-emerald-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {stack}BB
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 100))}
          min={1}
          max={1000}
          className="w-24 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <span className="text-white/50 text-sm">big blinds</span>
      </div>

      {/* Stack depth indicator */}
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              value < 40 ? 'bg-red-500' :
              value < 80 ? 'bg-yellow-500' :
              'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, (value / 200) * 100)}%` }}
          />
        </div>
        <span className="text-xs text-white/50">
          {value < 40 ? 'Short' : value < 80 ? 'Medium' : 'Deep'}
        </span>
      </div>
    </div>
  )
}
