'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface VideoInputProps {
  onSubmit: (url: string) => void
  isLoading: boolean
}

export default function VideoInput({ onSubmit, isLoading }: VideoInputProps) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onSubmit(url.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          YouTube Video URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        disabled={!url.trim() || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          'Learn From Video'
        )}
      </Button>

      <p className="text-xs text-white/50 text-center">
        Paste a YouTube URL to extract poker strategy adjustments from the video
      </p>
    </form>
  )
}
