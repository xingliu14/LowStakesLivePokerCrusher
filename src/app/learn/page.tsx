'use client'

import { useState, useCallback } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { StrategyAdjustment } from '@/types/poker'
import { fetchTranscript } from '@/lib/youtube/transcript'
import { extractStrategyFromTranscript } from '@/lib/ai/extractStrategy'

import Card from '@/components/ui/Card'
import VideoInput from '@/components/YouTube/VideoInput'
import ProcessingStatus from '@/components/YouTube/ProcessingStatus'
import LearnedStrategies from '@/components/YouTube/LearnedStrategies'

type ProcessingStatus = 'idle' | 'fetching' | 'extracting' | 'done' | 'error'

export default function LearnPage() {
  const [apiKey] = useLocalStorage('openai_api_key', '')
  const [strategies, setStrategies] = useLocalStorage<StrategyAdjustment[]>('learnedStrategies', [])

  const [status, setStatus] = useState<ProcessingStatus>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = useCallback(async (url: string) => {
    if (!apiKey) {
      setStatus('error')
      setMessage('Please add your OpenAI API key in Settings first')
      return
    }

    setStatus('fetching')
    setMessage('')

    // Fetch transcript
    const transcriptResult = await fetchTranscript(url)

    if (transcriptResult.error) {
      setStatus('error')
      setMessage(transcriptResult.error)
      return
    }

    if (!transcriptResult.transcript) {
      setStatus('error')
      setMessage('No transcript found for this video')
      return
    }

    setStatus('extracting')

    // Extract strategies using AI
    const extractionResult = await extractStrategyFromTranscript(
      transcriptResult.transcript,
      apiKey
    )

    if (extractionResult.error) {
      setStatus('error')
      setMessage(extractionResult.error)
      return
    }

    if (extractionResult.adjustments.length === 0) {
      setStatus('done')
      setMessage('No specific strategy adjustments could be extracted from this video')
      return
    }

    // Convert to full StrategyAdjustment objects
    const videoTitle = extractionResult.summary || `Video ${url.slice(-11)}`
    const newStrategies: StrategyAdjustment[] = extractionResult.adjustments.map(adj => ({
      source: videoTitle,
      videoUrl: url,
      isActive: true,
      position: adj.position,
      handCategory: adj.handCategory,
      situation: adj.situation,
      foldAdjust: adj.foldAdjust,
      callAdjust: adj.callAdjust,
      raiseAdjust: adj.raiseAdjust
    }))

    // Add to stored strategies
    setStrategies(prev => [...prev, ...newStrategies])

    setStatus('done')
    setMessage(`Extracted ${newStrategies.length} strategy adjustments`)
  }, [apiKey, setStrategies])

  const handleToggle = useCallback((index: number) => {
    setStrategies(prev =>
      prev.map((s, i) =>
        i === index ? { ...s, isActive: !s.isActive } : s
      )
    )
  }, [setStrategies])

  const handleDelete = useCallback((index: number) => {
    setStrategies(prev => prev.filter((_, i) => i !== index))
  }, [setStrategies])

  const clearAll = useCallback(() => {
    if (confirm('Are you sure you want to delete all learned strategies?')) {
      setStrategies([])
    }
  }, [setStrategies])

  const activeCount = strategies.filter(s => s.isActive).length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Learn From YouTube</h1>
          <p className="text-white/60 mt-1">
            Extract poker strategies from YouTube videos to customize your recommendations
          </p>
        </div>
        {strategies.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Clear all
          </button>
        )}
      </div>

      {!apiKey && (
        <Card className="p-4 bg-amber-500/10 border-amber-500/30">
          <div className="flex items-center gap-2 text-amber-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">API Key Required</span>
          </div>
          <p className="mt-2 text-sm text-white/70">
            You need to add your OpenAI API key in{' '}
            <a href="/settings" className="text-emerald-400 hover:underline">Settings</a>
            {' '}to use the YouTube learning feature.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Add Video</h2>
            <VideoInput
              onSubmit={handleSubmit}
              isLoading={status === 'fetching' || status === 'extracting'}
            />
          </Card>

          <ProcessingStatus status={status} message={message} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Learned Strategies
            </h2>
            {strategies.length > 0 && (
              <span className="text-sm text-white/50">
                {activeCount} of {strategies.length} active
              </span>
            )}
          </div>
          <LearnedStrategies
            strategies={strategies}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-white/70 mb-2">How it works</h3>
        <ol className="text-sm text-white/50 space-y-1 list-decimal list-inside">
          <li>Paste a YouTube URL from a poker strategy video</li>
          <li>The video&apos;s transcript is automatically fetched</li>
          <li>AI analyzes the content and extracts strategy adjustments</li>
          <li>Adjustments modify your base strategy recommendations</li>
          <li>Toggle individual adjustments on/off as needed</li>
        </ol>
      </Card>
    </div>
  )
}
