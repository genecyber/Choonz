'use client'

const QUICK_INSERTS = [
  { label: 'sound', insert: 'sound("")' },
  { label: 'note', insert: 'note("")' },
  { label: '.fast', insert: '.fast(2)' },
  { label: '.slow', insert: '.slow(2)' },
  { label: '.rev', insert: '.rev()' },
  { label: '.jux', insert: '.jux(rev)' },
  { label: '.lpf', insert: '.lpf(800)' },
  { label: '.delay', insert: '.delay(.5)' },
  { label: '.room', insert: '.room(.5)' },
  { label: '.gain', insert: '.gain(.8)' },
]

interface QuickInsertProps {
  onInsert: (text: string) => void
}

export default function QuickInsert({ onInsert }: QuickInsertProps) {
  return (
    <div className="quick-insert">
      {QUICK_INSERTS.map(({ label, insert }) => (
        <button
          key={label}
          className="insert-btn"
          onClick={() => onInsert(insert)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
