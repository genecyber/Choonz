'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseStrudelOptions {
  onError?: (error: string) => void
  onSuccess?: () => void
}

interface UseStrudelReturn {
  isPlaying: boolean
  isReady: boolean
  play: () => Promise<void>
  stop: () => void
  evaluate: (code: string, bpm: number) => Promise<void>
}

// Global state for Strudel - persists across re-renders
let strudelRepl: any = null
let audioInitialized = false

export function useStrudel({
  onError,
  onSuccess,
}: UseStrudelOptions = {}): UseStrudelReturn {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const initPromiseRef = useRef<Promise<void> | null>(null)

  // Initialize Strudel on mount
  useEffect(() => {
    if (!initPromiseRef.current) {
      initPromiseRef.current = initializeStrudel()
    }

    async function initializeStrudel() {
      try {
        // Dynamically import Strudel modules
        const [{ repl }, { initAudioOnFirstClick, webaudioOutput, samples }] =
          await Promise.all([
            import('@strudel/repl'),
            import('@strudel/webaudio'),
          ])

        // Load default samples
        await samples('https://strudel.cc/samples.json')

        // Create the REPL instance
        strudelRepl = repl({
          defaultOutput: webaudioOutput,
          afterEval: () => {
            onSuccess?.()
          },
          onError: (err: Error) => {
            onError?.(err.message || String(err))
          },
        })

        setIsReady(true)
      } catch (error) {
        console.error('Failed to initialize Strudel:', error)
        onError?.(`Failed to initialize Strudel: ${error}`)
      }
    }
  }, [onError, onSuccess])

  const initAudio = useCallback(async () => {
    if (audioInitialized) return

    try {
      const { initAudioOnFirstClick, getAudioContext } = await import(
        '@strudel/webaudio'
      )
      await initAudioOnFirstClick()
      const ctx = getAudioContext()
      if (ctx.state === 'suspended') {
        await ctx.resume()
      }
      audioInitialized = true
    } catch (error) {
      console.error('Audio init error:', error)
      throw error
    }
  }, [])

  const evaluate = useCallback(
    async (code: string, bpm: number) => {
      if (!strudelRepl) {
        onError?.('Strudel is not ready yet')
        return
      }

      try {
        // Initialize audio on first interaction
        if (!audioInitialized) {
          await initAudio()
        }

        // Stop any current playback
        strudelRepl.stop()

        // Evaluate with BPM
        const fullCode = `setcps(${bpm / 60 / 4})\n${code}`
        await strudelRepl.evaluate(fullCode)

        setIsPlaying(true)
        onSuccess?.()
      } catch (error: any) {
        setIsPlaying(false)
        onError?.(error.message || String(error))
      }
    },
    [initAudio, onError, onSuccess]
  )

  const play = useCallback(async () => {
    if (!audioInitialized) {
      await initAudio()
    }
  }, [initAudio])

  const stop = useCallback(() => {
    if (strudelRepl) {
      strudelRepl.stop()
    }
    setIsPlaying(false)
  }, [])

  return {
    isPlaying,
    isReady,
    play,
    stop,
    evaluate,
  }
}
