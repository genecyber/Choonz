'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useStrudel } from '@/hooks/useStrudel'
import { PRESETS } from '@/lib/presets'
import Header from './Header'
import CodeEditor from './CodeEditor'
import Visualizer from './Visualizer'
import TransportBar from './TransportBar'
import PresetsDrawer from './PresetsDrawer'
import QuickInsert from './QuickInsert'

export default function StrudelUI() {
  const [code, setCode] = useState('')
  const [bpm, setBpm] = useState(120)
  const [error, setError] = useState<string | null>(null)
  const [presetsOpen, setPresetsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const { isPlaying, isReady, play, stop, evaluate } = useStrudel({
    onError: (err) => setError(err),
    onSuccess: () => setError(null),
  })

  // Load saved code on mount
  useEffect(() => {
    const savedCode = localStorage.getItem('choonz-code')
    const savedBpm = localStorage.getItem('choonz-bpm')

    if (savedCode) setCode(savedCode)
    if (savedBpm) setBpm(parseInt(savedBpm, 10) || 120)

    setIsLoading(false)
  }, [])

  // Save code when it changes
  useEffect(() => {
    localStorage.setItem('choonz-code', code)
  }, [code])

  // Save BPM when it changes
  useEffect(() => {
    localStorage.setItem('choonz-bpm', bpm.toString())
  }, [bpm])

  const handlePlay = useCallback(async () => {
    if (!code.trim()) {
      setError('Write some code first!')
      return
    }
    setError(null)
    await evaluate(code, bpm)
  }, [code, bpm, evaluate])

  const handleStop = useCallback(() => {
    stop()
    setError(null)
  }, [stop])

  const handleBpmChange = useCallback((delta: number) => {
    setBpm((prev) => Math.max(40, Math.min(300, prev + delta)))
  }, [])

  const handlePresetSelect = useCallback((presetCode: string) => {
    setCode(presetCode)
    setPresetsOpen(false)
  }, [])

  const handleShuffle = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * PRESETS.length)
    setCode(PRESETS[randomIndex].code)
  }, [])

  const handleClear = useCallback(() => {
    stop()
    setCode('')
    setError(null)
  }, [stop])

  const handleInsert = useCallback((text: string) => {
    const editor = editorRef.current
    if (!editor) return

    const start = editor.selectionStart
    const end = editor.selectionEnd
    const value = editor.value

    const newValue = value.substring(0, start) + text + value.substring(end)
    setCode(newValue)

    // Position cursor
    setTimeout(() => {
      const cursorPos = text.includes('""')
        ? start + text.indexOf('""') + 1
        : start + text.length
      editor.setSelectionRange(cursorPos, cursorPos)
      editor.focus()
    }, 0)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handlePlay()
      }
      if (e.key === 'Escape' || ((e.ctrlKey || e.metaKey) && e.key === '.')) {
        e.preventDefault()
        handleStop()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handlePlay, handleStop])

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner" />
        <p>Loading Strudel...</p>
      </div>
    )
  }

  return (
    <div id="app">
      <Header bpm={bpm} onBpmChange={handleBpmChange} />

      <main className="main-content">
        <CodeEditor
          ref={editorRef}
          code={code}
          onChange={setCode}
          error={error}
        />
        <Visualizer isPlaying={isPlaying} />
      </main>

      <TransportBar
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onStop={handleStop}
        onShuffle={handleShuffle}
        onClear={handleClear}
      />

      <PresetsDrawer
        isOpen={presetsOpen}
        onToggle={() => setPresetsOpen(!presetsOpen)}
        onSelect={handlePresetSelect}
      />

      <QuickInsert onInsert={handleInsert} />
    </div>
  )
}
