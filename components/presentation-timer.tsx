"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PresentationTimerProps {
  duration: number // in minutes
}

export default function PresentationTimer({ duration }: PresentationTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60) // convert to seconds
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    // Reset timer when duration changes
    setTimeLeft(duration * 60)
    setIsRunning(false)
  }, [duration])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setTimeLeft(duration * 60)
    setIsRunning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const getTimerColor = () => {
    const percentage = (timeLeft / (duration * 60)) * 100
    if (percentage > 50) return "text-green-600"
    if (percentage > 25) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`font-mono text-lg font-bold ${getTimerColor()}`}>{formatTime(timeLeft)}</div>
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTimer}>
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetTimer}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
