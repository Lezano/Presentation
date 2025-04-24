"use client"

import { useState, useEffect, useRef } from "react"
import { Slider } from "@/components/ui/slider"

export default function DAConverter() {
  const [bitDepth, setBitDepth] = useState(3) // 3-bit = 8 levels
  const [digitalValue, setDigitalValue] = useState(4) // Middle value
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Maximum possible value based on bit depth
  const maxValue = Math.pow(2, bitDepth) - 1

  useEffect(() => {
    // Ensure digital value is within range of current bit depth
    if (digitalValue > maxValue) {
      setDigitalValue(maxValue)
    }
  }, [bitDepth, digitalValue, maxValue])

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

    // Draw quantization levels
    const levelHeight = graphHeight / maxValue

    for (let i = 0; i <= maxValue; i++) {
      const y = canvas.height - padding - i * levelHeight

      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + 10, y)
      ctx.strokeStyle = "#94a3b8"
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.fillStyle = "#64748b"
      ctx.fillText(i.toString(), padding - 20, y + 4)
    }

    // Draw digital signal (steps)
    ctx.beginPath()
    ctx.moveTo(padding, canvas.height - padding - digitalValue * levelHeight)

    // Digital signal is constant
    ctx.lineTo(canvas.width - padding, canvas.height - padding - digitalValue * levelHeight)

    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw reconstructed analog signal (smooth curve)
    ctx.beginPath()
    ctx.moveTo(padding, canvas.height - padding - digitalValue * levelHeight)

    for (let x = 0; x <= graphWidth; x++) {
      // Add some smoothing to simulate reconstruction filter
      const normalizedX = x / graphWidth
      const noise = Math.sin(normalizedX * Math.PI * 8) * 0.1
      const y = digitalValue / maxValue + noise
      const canvasY = canvas.height - padding - y * graphHeight
      ctx.lineTo(padding + x, canvasY)
    }

    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw binary representation
    const binaryValue = digitalValue.toString(2).padStart(bitDepth, "0")
    ctx.font = "14px monospace"
    ctx.fillStyle = "#1e293b"
    ctx.fillText(`Binär: ${binaryValue}`, padding, padding - 10)
  }, [digitalValue, bitDepth, maxValue])

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden bg-slate-50 p-2">
        <canvas ref={canvasRef} className="w-full h-64"></canvas>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Digitaler Wert</span>
            <span>
              {digitalValue} / {maxValue}
            </span>
          </div>
          <Slider
            value={[digitalValue]}
            min={0}
            max={maxValue}
            step={1}
            onValueChange={(values) => setDigitalValue(values[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Bit-Tiefe</span>
            <span>
              {bitDepth}-Bit ({Math.pow(2, bitDepth)} Stufen)
            </span>
          </div>
          <Slider value={[bitDepth]} min={2} max={8} step={1} onValueChange={(values) => setBitDepth(values[0])} />
        </div>
      </div>
    </div> 
  )
}
