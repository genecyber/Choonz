'use client'

import { PRESETS } from '@/lib/presets'

interface PresetsDrawerProps {
  isOpen: boolean
  onToggle: () => void
  onSelect: (code: string) => void
}

export default function PresetsDrawer({
  isOpen,
  onToggle,
  onSelect,
}: PresetsDrawerProps) {
  return (
    <div className={`presets-drawer ${isOpen ? 'open' : ''}`}>
      <button className="presets-toggle" onClick={onToggle}>
        <span className="toggle-arrow">▲</span>
        <span>Patterns</span>
      </button>

      <div className="presets-content">
        <div className="presets-grid">
          {PRESETS.map((preset, index) => (
            <button
              key={index}
              className="preset-btn"
              onClick={() => onSelect(preset.code)}
            >
              <span className="preset-name">{preset.name}</span>
              <span className="preset-desc">{preset.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
