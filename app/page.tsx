"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import ADConverter from "@/components/ad-converter"
import DAConverter from "@/components/da-converter"
import WaveformComparison from "@/components/waveform-comparison"

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)
  const [activeTab, setActiveTab] = useState("wav")

  const totalSlides = 5

  // Stop audio playback when changing slides
  useEffect(() => {
    setIsPlaying(false)
  }, [currentSlide])

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    if (value[0] === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setIsPlaying(false) // Stop playback when switching tabs
  }

  const slides = [
    {
      id: "introduction",
      title: "Einführung",
      presenter: "Leon",
      duration: 2,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Digitalisierung von Musik</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Willkommen</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Warum ist die Digitalisierung von Musik wichtig?</li>
                <li>Ziel der Präsentation:</li>
                <li>Unterschiede zwischen WAV- und MP3-Dateien</li>
                <li>Grundlagen der AD- und DA-Wandlung</li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-4 bg-blue-200 rounded-full opacity-40 animate-pulse animation-delay-300"></div>
                <div className="absolute inset-8 bg-blue-300 rounded-full opacity-60 animate-pulse animation-delay-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Volume2 className="w-16 h-16 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "formats",
      title: "Musikdateiformate",
      presenter: "Leon & Deniel",
      duration: 5,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Musikdateiformate: WAV vs. MP3</h2>

          <Tabs defaultValue="wav" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="wav">WAV (Leon)</TabsTrigger>
              <TabsTrigger value="mp3">MP3 (Deniel)</TabsTrigger>
            </TabsList>
            <TabsContent value="wav" className="space-y-4 pt-4">
              <h3 className="text-xl font-semibold">Was ist eine WAV-Datei?</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Unkomprimiertes Format</li>
                <li>Hohe Audioqualität</li>
                <li>Große Dateigröße</li>
                <li>Verwendung: Studioaufnahmen, Archivierung</li>
              </ul>
              <div className="mt-4">
                <WaveformComparison
                  type="wav"
                  isPlaying={isPlaying && activeTab === "wav"}
                  volume={volume}
                  isMuted={isMuted}
                />
              </div>
            </TabsContent>
            <TabsContent value="mp3" className="space-y-4 pt-4">
              <h3 className="text-xl font-semibold">Was ist eine MP3-Datei?</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verlustbehaftete Kompression</li>
                <li>Geringere Dateigröße durch Reduktion unwichtiger Audiodaten</li>
                <li>Vergleich WAV vs. MP3 (Tonbeispiele)</li>
                <li>Verwendung: Streaming, mobile Nutzung</li>
              </ul>
              <div className="mt-4">
                <WaveformComparison
                  type="mp3"
                  isPlaying={isPlaying && activeTab === "mp3"}
                  volume={volume}
                  isMuted={isMuted}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-800">Interaktiver Vergleich</h4>
            <div className="flex items-center gap-4 mt-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={togglePlayback}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pause" : "Abspielen"}
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Slider value={[volume]} max={100} step={1} className="w-24" onValueChange={handleVolumeChange} />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "conversion",
      title: "AD- und DA-Wandlung",
      presenter: "Leon & Deniel",
      duration: 6,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">AD- und DA-Wandlung</h2>

          <Tabs key="conversion-tabs" defaultValue="ad" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ad">AD-Wandlung (Leon)</TabsTrigger>
              <TabsTrigger value="da">DA-Wandlung (Deniel)</TabsTrigger>
            </TabsList>
            <TabsContent value="ad" className="space-y-4 pt-4">
              <h3 className="text-xl font-semibold">Analog → Digital</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Umwandlung von analogen Signalen (Schall) in digitale Werte</li>
                <li>Abtastrate & Nyquist-Theorem</li>
                <li>Beispiel: 44,1 kHz bei CDs</li>
                <li>Quantisierung & Quantisierungsfehler</li>
                <li>Rauschen und Fehler durch begrenzte Bit-Tiefe</li>
              </ul>
              <div className="mt-4">
                <ADConverter />
              </div>
            </TabsContent>
            <TabsContent value="da" className="space-y-4 pt-4">
              <h3 className="text-xl font-semibold">Digital → Analog</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Von digital (Binärcode) zu analogen Signal (Ton)</li>
                <li>Findet man in: Lautsprechern, Kopfhörern & Audiogeräten</li>
                <li>Digital-Analog-Wandler (DAC)</li>
                <li>Beispiel an Musikhören</li>
              </ul>
              <div className="mt-4">
                <DAConverter />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ),
    },
    {
      id: "8bit",
      title: "8-Bit Wandler",
      presenter: "Leon & Deniel",
      duration: 5,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">8-Bit AD- und DA-Wandler</h2>

          <Tabs key="8bit-tabs" defaultValue="ad8bit" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ad8bit">8-Bit AD-Wandler (Leon)</TabsTrigger>
              <TabsTrigger value="da8bit">8-Bit DA-Wandler (Deniel)</TabsTrigger>
            </TabsList>
            <TabsContent value="ad8bit" className="space-y-4 pt-4">
              <h3 className="text-xl font-semibold">Aufbau eines 8-Bit-AD-Wandlers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Beispielhafte Umwandlung eines analogen Signals</li>
                    <li>Vor- und Nachteile von 8-Bit</li>
                    <li>Geringe Auflösung (nur 256 Stufen)</li>
                    <li>Hohe Fehleranfälligkeit</li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="font-semibold mb-2">8-Bit Auflösung</h4>
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="text-xs font-mono">
                          2<sup>{7 - i}</sup>
                        </div>
                        <div className="w-full h-8 bg-blue-100 border border-blue-300 rounded flex items-center justify-center text-xs font-mono">
                          {i === 0
                            ? "128"
                            : i === 1
                              ? "64"
                              : i === 2
                                ? "32"
                                : i === 3
                                  ? "16"
                                  : i === 4
                                    ? "8"
                                    : i === 5
                                      ? "4"
                                      : i === 6
                                        ? "2"
                                        : "1"}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-center">
                    8-Bit = 2<sup>8</sup> = 256 mögliche Werte (0-255)
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="da8bit" className="space-y-4 pt-4">
              <h3 className="text-xl font-semibold">Aufbau eines 8-Bit-DA-Wandlers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ul className="list-disc pl-6 space-y-2">                    
                    <li>Anz. möglicher Spannungswerten -&gt; Anz. Bits</li>
                    <li>2<sup>8</sup> = 256</li>
                    <li>8-Bit DA-Wandler veraltet</li>
                    <li>Vergleich zu modernen Wandlern (16- oder 24-, 32-Bit)</li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="font-semibold mb-2">Vergleich der Auflösungen</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left">Bit-Tiefe</th>
                        <th className="text-right">mögliche Spannugswerte</th>
                        <th className="text-right">möglicher Preis</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>8-Bit</td>
                        <td className="text-right">256</td>                        
                        <td className="text-right">2,--€</td>
                      </tr>
                      <tr>
                        <td>16-Bit</td>
                        <td className="text-right">65.536</td>
                        <td className="text-right">3 bis 14,-- €</td>
                      </tr>
                      <tr>
                        <td>24-Bit</td>
                        <td className="text-right">16,8 Mio.</td>
                        <td className="text-right">2,--€</td>
                      </tr>
                      <tr>
                        <td>32-Bit</td>
                        <td className="text-right">4.3 Mrd.</td>
                        <td className="text-right">45,99€</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ),
    },
    {
      id: "conclusion",
      title: "Fazit & Fragen",
      presenter: "Leon & Deniel",
      duration: 2,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Fazit & Fragen</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Leon: Zusammenfassung</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>WAV vs. MP3: Qualität vs. Kompression</li>
                  <li>AD-Wandlung: Analog zu Digital</li>
                  <li>Bedeutung der Abtastrate und Bit-Tiefe</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Deniel: Bedeutung</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>DA-Wandlung: Digital zu Analog</li>
                  <li>Bedeutung der Wandlung für Musik & Technik</li>
                  <li>Entwicklung: Von 8-Bit zu modernen Wandlern</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Fragerunde</h3>
            <p>Vielen Dank für eure Aufmerksamkeit!</p>
            <p className="mt-2">Habt ihr Fragen?</p>
          </div>
        </div>
      ),
    },
  ]

  const currentSlideData = slides[currentSlide]
  const progress = ((currentSlide + 1) / totalSlides) * 100

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Digitalisierung von Musik</h1>
          <div className="hidden md:block text-sm text-slate-500">
            Slide {currentSlide + 1} von {totalSlides}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="flex items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {currentSlideData.title}
              </div>
              <div className="text-slate-500 text-sm">Präsentiert von: {currentSlideData.presenter}</div>
            </div>
          </div>

          {currentSlideData.content}
        </div>
      </main>

      {/* Footer with navigation */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Zurück
          </Button>

          <div className="flex-1 mx-4">
            <Progress value={progress} className="h-2" />
          </div>

          <Button
            variant="outline"
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="flex items-center gap-2"
          >
            Weiter
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </footer>
    </div>
  )
}
