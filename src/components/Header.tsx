'use client'

interface HeaderProps {
  bpm: number
  onBpmChange: (delta: number) => void
}

export default function Header({ bpm, onBpmChange }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="logo">Choonz</h1>
      <div className="header-controls">
        <button
          className="btn btn-small"
          onClick={() => onBpmChange(-5)}
          aria-label="Decrease BPM"
        >
          -
        </button>
        <span className="bpm-display">{bpm}</span>
        <button
          className="btn btn-small"
          onClick={() => onBpmChange(5)}
          aria-label="Increase BPM"
        >
          +
        </button>
      </div>
    </header>
  )
}
