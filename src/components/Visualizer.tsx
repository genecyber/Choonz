'use client'

import { useEffect, useRef } from 'react'

interface VisualizerProps {
  isPlaying: boolean
}

export default function Visualizer({ isPlaying }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phaseRef = useRef(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const width = canvas.width
      const height = canvas.height

      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, width, height)

      if (!isPlaying) {
        // Draw flat line when not playing
        ctx.strokeStyle = '#606070'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, height / 2)
        ctx.lineTo(width, height / 2)
        ctx.stroke()
      } else {
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, width, 0)
        gradient.addColorStop(0, '#00d9ff')
        gradient.addColorStop(0.5, '#ff6b9d')
        gradient.addColorStop(1, '#c678dd')

        // Draw animated waveform
        ctx.strokeStyle = gradient
        ctx.lineWidth = 3
        ctx.beginPath()

        const segments = 100
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments) * width
          const frequency = 3 + Math.sin(phaseRef.current * 0.5) * 2
          const amplitude =
            (height / 4) * (0.5 + Math.sin(phaseRef.current * 0.7) * 0.5)
          const y =
            height / 2 +
            Math.sin((i / segments) * Math.PI * frequency + phaseRef.current) *
              amplitude

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.stroke()
        phaseRef.current += 0.08
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  return (
    <div className="visualizer">
      <canvas ref={canvasRef} />
    </div>
  )
}
