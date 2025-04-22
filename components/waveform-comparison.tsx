"use client"

import { useEffect, useRef, useState } from "react"

interface WaveformComparisonProps {
  type: "wav" | "mp3"
  isPlaying: boolean
  volume: number
  isMuted: boolean
}

export default function WaveformComparison({ type, isPlaying, volume, isMuted }: WaveformComparisonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Audio URLs
  const audioUrls = {
    wav: "https://github.com/Lezano/Presentation/raw/refs/heads/main/wavtest.wav",
    mp3: "https://github.com/Lezano/Presentation/raw/refs/heads/main/mp3test.mpga",
  }

  // Initialize or update audio element when play is clicked
  useEffect(() => {
    if (isPlaying && !audioRef.current) {
      setIsLoading(true)
      audioRef.current = new Audio(type === "wav" ? audioUrls.wav : audioUrls.mp3)

      audioRef.current.addEventListener("canplaythrough", () => {
        setIsLoaded(true)
        setIsLoading(false)
        if (audioRef.current && isPlaying) {
          audioRef.current.play().catch((error) => {
            console.error("Error playing audio:", error)
          })
        }
      })

      audioRef.current.addEventListener("error", () => {
        console.error("Error loading audio")
        setIsLoading(false)
      })

      audioRef.current.volume = isMuted ? 0 : volume / 100
      audioRef.current.load()
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, type, audioUrls.wav, audioUrls.mp3, isMuted, volume])

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying && isLoaded) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error)
      })
    } else if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [isPlaying, isLoaded])

  // Handle volume changes
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = isMuted ? 0 : volume / 100
  }, [volume, isMuted])

  // Clean up audio when component unmounts or type changes
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
        audioRef.current = null
        setIsLoaded(false)
      }
    }
  }, [type])

  // Draw waveform
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

    // Draw waveform
    const centerY = canvas.height / 2
    const amplitude = type === "wav" ? canvas.height / 3 : canvas.height / 4

    ctx.beginPath()
    ctx.moveTo(0, centerY)

    // Different waveform patterns for WAV and MP3
    if (type === "wav") {
      // Smooth sine wave for WAV (high quality)
      for (let x = 0; x < canvas.width; x++) {
        const frequency = 0.02
        const y = centerY + Math.sin(x * frequency) * amplitude
        ctx.lineTo(x, y)
      }
    } else {
      // More jagged wave for MP3 (compressed)
      for (let x = 0; x < canvas.width; x++) {
        const frequency = 0.02
        let y = centerY + Math.sin(x * frequency) * amplitude

        // Add some compression artifacts
        if (x % 20 < 3) {
          y = y * 0.7 + centerY * 0.3
        }

        ctx.lineTo(x, y)
      }
    }

    ctx.strokeStyle = type === "wav" ? "#3b82f6" : "#f59e0b"
    ctx.lineWidth = 2
    ctx.stroke()

    // Add label
    ctx.font = "12px sans-serif"
    ctx.fillStyle = type === "wav" ? "#1d4ed8" : "#b45309"
    ctx.fillText(type === "wav" ? "WAV: Unkomprimiert (44.1kHz, 16-bit)" : "MP3: Komprimiert (128kbps)", 10, 20)

    // Add file size indicator
    ctx.font = "12px sans-serif"
    ctx.fillText(type === "wav" ? "Dateigröße: ~10MB/min" : "Dateigröße: ~1MB/min", 10, 40)

    // Add loading/playing indicator
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "#64748b"

    let statusText = "⏸ Bereit"
    if (isLoading) statusText = "⌛ Wird geladen..."
    else if (isLoaded && isPlaying) statusText = "▶ Wird abgespielt"

    ctx.fillText(statusText, canvas.width - 120, 20)
  }, [type, isPlaying, isLoaded, isLoading])

  return (
    <div className="border rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className={`w-full h-32 ${type === "wav" ? "bg-blue-50" : "bg-amber-50"}`}></canvas>
    </div>
  )
}
