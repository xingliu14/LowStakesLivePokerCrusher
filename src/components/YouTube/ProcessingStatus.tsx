'use client'

interface ProcessingStatusProps {
  status: 'idle' | 'fetching' | 'extracting' | 'done' | 'error'
  message?: string
}

export default function ProcessingStatus({ status, message }: ProcessingStatusProps) {
  const steps = [
    { key: 'fetching', label: 'Fetching transcript' },
    { key: 'extracting', label: 'Extracting strategies' },
    { key: 'done', label: 'Complete' }
  ]

  const currentIndex = steps.findIndex(s => s.key === status)

  if (status === 'idle') return null

  if (status === 'error') {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">Error</span>
        </div>
        {message && <p className="mt-2 text-sm text-red-300">{message}</p>}
      </div>
    )
  }

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = step.key === status
          const isComplete = index < currentIndex || status === 'done'

          return (
            <div key={step.key} className="flex items-center gap-3">
              {isComplete ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : isActive ? (
                <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-white/20" />
              )}
              <span className={`text-sm ${
                isComplete ? 'text-emerald-400' :
                isActive ? 'text-white' :
                'text-white/40'
              }`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {message && status === 'done' && (
        <p className="mt-4 text-sm text-white/70">{message}</p>
      )}
    </div>
  )
}
