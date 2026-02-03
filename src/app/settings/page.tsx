'use client'

import { useState, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function SettingsPage() {
  const [apiKey, setApiKey] = useLocalStorage('openai_api_key', '')
  const [inputKey, setInputKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (apiKey) {
      setInputKey(apiKey)
    }
  }, [apiKey])

  const handleSave = () => {
    setApiKey(inputKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClear = () => {
    setApiKey('')
    setInputKey('')
  }

  const maskKey = (key: string) => {
    if (key.length <= 8) return key
    return key.slice(0, 4) + '...' + key.slice(-4)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">OpenAI API Key</h2>
        <p className="text-sm text-white/60 mb-4">
          Your API key is used to extract strategies from YouTube video transcripts.
          It is stored locally in your browser and never sent to our servers.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              API Key
            </label>
            <div className="flex gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Button
                variant="ghost"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? 'Hide' : 'Show'}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave}>
              {saved ? 'Saved!' : 'Save Key'}
            </Button>
            {apiKey && (
              <Button variant="danger" onClick={handleClear}>
                Clear Key
              </Button>
            )}
          </div>

          {apiKey && !showKey && (
            <p className="text-sm text-white/50">
              Current key: {maskKey(apiKey)}
            </p>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">About</h2>
        <div className="space-y-2 text-sm text-white/60">
          <p>
            <strong className="text-white">Low Stakes Live Poker Crusher</strong> helps you make
            optimal poker decisions based on your position, hand, and game situation.
          </p>
          <p>
            The base strategies are simplified GTO-ish recommendations adjusted for
            typical low stakes live games.
          </p>
          <p>
            Use the YouTube learning feature to teach the app custom adjustments
            based on poker strategy videos.
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Data Storage</h2>
        <div className="space-y-2 text-sm text-white/60">
          <p>
            All your data is stored locally in your browser using localStorage.
            This includes:
          </p>
          <ul className="list-disc list-inside ml-2">
            <li>Your OpenAI API key</li>
            <li>Learned strategy adjustments from YouTube videos</li>
          </ul>
          <p className="text-amber-400 mt-4">
            Clearing your browser data will remove all stored information.
          </p>
        </div>
      </Card>
    </div>
  )
}
