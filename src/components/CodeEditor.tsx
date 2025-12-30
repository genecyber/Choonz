'use client'

import { forwardRef } from 'react'

interface CodeEditorProps {
  code: string
  onChange: (code: string) => void
  error: string | null
}

const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  function CodeEditor({ code, onChange, error }, ref) {
    return (
      <div className="editor-container">
        <textarea
          ref={ref}
          className="code-editor"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          placeholder={`// Type your Strudel pattern here...
// Example: sound("bd sd hh sd")
// Press play or Ctrl+Enter to start`}
        />
        {error && <div className="error-display">{error}</div>}
      </div>
    )
  }
)

export default CodeEditor
