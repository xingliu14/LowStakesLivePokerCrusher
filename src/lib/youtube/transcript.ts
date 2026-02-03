// YouTube transcript fetching utilities

export interface TranscriptSegment {
  text: string
  offset: number
  duration: number
}

export interface TranscriptResult {
  transcript: string
  segments: TranscriptSegment[]
  videoId: string
  error?: string
}

// Extract video ID from various YouTube URL formats
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

// Fetch transcript via our API route
export async function fetchTranscript(videoUrl: string): Promise<TranscriptResult> {
  const videoId = extractVideoId(videoUrl)

  if (!videoId) {
    return {
      transcript: '',
      segments: [],
      videoId: '',
      error: 'Invalid YouTube URL'
    }
  }

  try {
    const response = await fetch('/api/youtube/transcript', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ videoId })
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        transcript: '',
        segments: [],
        videoId,
        error: error.message || 'Failed to fetch transcript'
      }
    }

    const data = await response.json()
    return {
      transcript: data.transcript,
      segments: data.segments,
      videoId
    }
  } catch (error) {
    return {
      transcript: '',
      segments: [],
      videoId,
      error: 'Network error while fetching transcript'
    }
  }
}
