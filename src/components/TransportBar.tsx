'use client'

interface TransportBarProps {
  isPlaying: boolean
  onPlay: () => void
  onStop: () => void
  onShuffle: () => void
  onClear: () => void
}

export default function TransportBar({
  isPlaying,
  onPlay,
  onStop,
  onShuffle,
  onClear,
}: TransportBarProps) {
  return (
    <div className="transport-bar">
      <button
        className={`btn btn-transport btn-play ${isPlaying ? 'playing' : ''}`}
        onClick={onPlay}
        aria-label="Play"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>

      <button
        className="btn btn-transport btn-stop"
        onClick={onStop}
        aria-label="Stop"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="6" width="12" height="12" />
        </svg>
      </button>

      <button
        className="btn btn-transport"
        onClick={onShuffle}
        aria-label="Random Pattern"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
        </svg>
      </button>

      <button
        className="btn btn-transport"
        onClick={onClear}
        aria-label="Clear"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>
  )
}
