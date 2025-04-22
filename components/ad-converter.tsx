"use client"

import { useState, useEffect, useRef } from "react"
import { Slider } from "@/components/ui/slider"

export default function ADConverter() {
  const [inputValue, setInputValue] = useState(0.5)
  const [sampleRate, setSampleRate] = useState(8) // Number of samples
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Convert analog value to digital (quantized)
  const getDigitalValue = (analog: number) => {
    // 3-bit quantization (8 levels)
    const levels = 8
    const digital = Math.floor(analog * levels)
    return digital / levels
  }

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw coordinate system
    const padding = 30
    const graphWidth = canvas.width - padding * 2
    const graphHeight = canvas.height - padding * 2

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw labels
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "#64748b"
    ctx.fillText("Zeit", canvas.width - padding - 20, canvas.height - padding + 20)
    ctx.fillText("Amplitude", padding - 25, padding + 10)

    // Draw analog signal (sine wave)
    ctx.beginPath()
    ctx.moveTo(padding, canvas.height - padding - inputValue * graphHeight)

    for (let x = 0; x <= graphWidth; x++) {
      const normalizedX = x / graphWidth
      // Create a sine wave with some variation based on input value
      const y = Math.sin(normalizedX * Math.PI * 4) * 0.4 + inputValue
      const canvasY = canvas.height - padding - y * graphHeight
      ctx.lineTo(padding + x, canvasY)
    }

    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw sampling points and quantization
    const sampleWidth = graphWidth / (sampleRate - 1)

    for (let i = 0; i < sampleRate; i++) {
      const x = padding + i * sampleWidth
      const normalizedX = i / (sampleRate - 1)
      const analogValue = Math.sin(normalizedX * Math.PI * 4) * 0.4 + inputValue
      const analogY = canvas.height - padding - analogValue * graphHeight

      // Draw sample point
      ctx.beginPath()
      ctx.arc(x, analogY, 4, 0, Math.PI * 2)
      ctx.fillStyle = "#3b82f6"
      ctx.fill()

      // Get quantized value
      const digitalValue = getDigitalValue(analogValue)
      const digitalY = canvas.height - padding - digitalValue * graphHeight

      // Draw quantization level
      ctx.beginPath()
      ctx.moveTo(x - 5, digitalY)
      ctx.lineTo(x + 5, digitalY)
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw quantization error
      ctx.beginPath()
      ctx.moveTo(x, analogY)
      ctx.lineTo(x, digitalY)
      ctx.strokeStyle = "#f59e0b"
      ctx.setLineDash([2, 2])
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.setLineDash([])

      // Draw digital value
      if (i < sampleRate - 1) {
        ctx.beginPath()
        ctx.moveTo(x, digitalY)
        ctx.lineTo(x + sampleWidth, digitalY)
        ctx.strokeStyle = "#10b981"
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    // Draw binary representation
    const binaryValue = Math.floor(getDigitalValue(inputValue) * 7)
      .toString(2)
      .padStart(3, "0")
    ctx.font = "14px monospace"
    ctx.fillStyle = "#1e293b"
    ctx.fillText(`Binär: ${binaryValue}`, padding, padding - 10)
  }, [inputValue, sampleRate])

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden bg-slate-50 p-2">
        <canvas ref={canvasRef} className="w-full h-64"></canvas>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Eingangssignal</span>
            <span>{Math.round(inputValue * 100)}%</span>
          </div>
          <Slider
            value={[inputValue]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={(values) => setInputValue(values[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Abtastrate</span>
            <span>{sampleRate} Samples</span>
          </div>
          <Slider value={[sampleRate]} min={4} max={16} step={1} onValueChange={(values) => setSampleRate(values[0])} />
        </div>
      </div>
    </div>
  )
}
