import { NextRequest, NextResponse } from 'next/server'
import { YoutubeTranscript } from 'youtube-transcript'

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json()

    if (!videoId) {
      return NextResponse.json(
        { message: 'Video ID is required' },
        { status: 400 }
      )
    }

    // Fetch transcript using youtube-transcript library
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId)

    if (!transcriptItems || transcriptItems.length === 0) {
      return NextResponse.json(
        { message: 'No transcript available for this video' },
        { status: 404 }
      )
    }

    // Combine all segments into full transcript
    const transcript = transcriptItems
      .map(item => item.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()

    const segments = transcriptItems.map(item => ({
      text: item.text,
      offset: item.offset,
      duration: item.duration
    }))

    return NextResponse.json({
      transcript,
      segments,
      videoId
    })
  } catch (error) {
    console.error('Transcript fetch error:', error)

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('disabled')) {
        return NextResponse.json(
          { message: 'Transcripts are disabled for this video' },
          { status: 403 }
        )
      }
      if (error.message.includes('not found') || error.message.includes('unavailable')) {
        return NextResponse.json(
          { message: 'Video not found or unavailable' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { message: 'Failed to fetch transcript' },
      { status: 500 }
    )
  }
}
