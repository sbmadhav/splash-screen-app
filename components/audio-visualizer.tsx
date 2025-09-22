"use client"

import { useEffect, useRef, useState } from "react"

interface AudioVisualizerProps {
  audioUrl?: string
  isPlaying?: boolean
  onPlayStateChange?: (isPlaying: boolean) => void
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: [number, number, number]
}

export function AudioVisualizer({ audioUrl, isPlaying = false, onPlayStateChange }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const drawFrameCountRef = useRef<number>(0)
  
  const [isInitialized, setIsInitialized] = useState(false)
  const [currentAmplitude, setCurrentAmplitude] = useState(0)

  // Debug prop changes
  useEffect(() => {
    console.log('[AudioVisualizer] Props changed:', { audioUrl, isPlaying })
  }, [audioUrl, isPlaying])

  // Handle isPlaying prop changes
  useEffect(() => {
    const handlePlayStateChange = async () => {
      const audio = audioRef.current
      if (!audio || !audioUrl) {
        console.log('[AudioVisualizer] No audio element or URL, skipping play state change')
        return
      }

      console.log('[AudioVisualizer] Play state prop changed to:', isPlaying)

      try {
        if (isPlaying) {
          // Initialize if needed
          if (!isInitialized) {
            console.log('[AudioVisualizer] Initializing audio for prop change...')
            await initAudio()
          }

          // Resume context if suspended
          if (audioContextRef.current?.state === 'suspended') {
            console.log('[AudioVisualizer] Resuming suspended audio context...')
            await audioContextRef.current.resume()
          }

          // Ensure audio is ready
          if (audio.readyState < 2) {
            console.log('[AudioVisualizer] Waiting for audio to be ready...')
            await new Promise((resolve) => {
              audio.addEventListener('canplay', resolve, { once: true })
            })
          }

          console.log('[AudioVisualizer] Starting audio playback...')
          await audio.play()
          console.log('[AudioVisualizer] Audio.play() completed, starting draw loop...')
          draw()
          console.log('[AudioVisualizer] Draw function called')
        } else {
          console.log('[AudioVisualizer] Pausing audio...')
          audio.pause()
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
            console.log('[AudioVisualizer] Animation cancelled')
          }
        }
      } catch (error) {
        console.error('[AudioVisualizer] Error handling play state change:', error)
      }
    }

    handlePlayStateChange()
  }, [isPlaying, audioUrl, isInitialized])

  // Set up canvas dimensions 
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      console.log('[AudioVisualizer] Canvas size updated:', canvas.width, 'x', canvas.height)
    }
    
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [])

  // Initialize audio context and analyser
  const initAudio = async () => {
    if (!audioRef.current || isInitialized) return

    try {
      console.log('Initializing audio context...')
      
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      console.log('Audio context created, state:', audioContextRef.current.state)
      
      // Create analyser
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 512
      analyserRef.current.smoothingTimeConstant = 0.8
      
      // Connect audio element to analyser
      if (!sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current)
        sourceRef.current.connect(analyserRef.current)
        analyserRef.current.connect(audioContextRef.current.destination)
        console.log('Audio nodes connected')
      }
      
      setIsInitialized(true)
      console.log('Audio initialization complete')
    } catch (error) {
      console.error('Error initializing audio context:', error)
    }
  }

  // Create particle from circle edge
  const createParticle = (centerX: number, centerY: number, amplitude: number): Particle => {
    const angle = Math.random() * Math.PI * 2
    // Timer circle radius is about 140px (w-64 = 256px / 2 = 128px + some padding)
    // Make particle radius larger to avoid overlap with timer
    const circleRadius = 170
    // Much slower base speed, less amplitude influence
    const baseSpeed = 0.2 + (amplitude / 255) * 0.5
    
    // Start particle at the edge of the timer circle
    const startX = centerX + Math.cos(angle) * circleRadius
    const startY = centerY + Math.sin(angle) * circleRadius
    
    // Color palette with more variety
    const colorPalettes: [number, number, number][] = [
      [255, 100, 150], // Pink
      [100, 255, 150], // Green
      [150, 100, 255], // Purple
      [255, 200, 100], // Orange
      [100, 200, 255], // Light Blue
      [255, 255, 100], // Yellow
      [255, 150, 100], // Coral
      [150, 255, 200], // Mint
      [200, 150, 255], // Lavender
      [255, 180, 200], // Rose
    ]
    const selectedColor = colorPalettes[Math.floor(Math.random() * colorPalettes.length)]
    
    return {
      x: startX,
      y: startY,
      vx: Math.cos(angle) * baseSpeed,
      vy: Math.sin(angle) * baseSpeed,
      size: Math.random() * 1 + 1, // Much smaller particles: 1-2px
      alpha: 1,
      color: selectedColor
    }
  }

  // Update particles
  const updateParticles = (amplitude: number, centerX: number, centerY: number) => {
    const particles = particlesRef.current
    
    // Add new particles based on amplitude - more sensitive to tempo
    if (amplitude > 80 && particles.length < 100) { // Lower threshold, fewer max particles
      // Tempo-based particle generation
      const tempoMultiplier = Math.max(amplitude / 200, 0.5)
      const numParticles = Math.floor(tempoMultiplier * 2)
      for (let i = 0; i < numParticles && particles.length < 100; i++) {
        particles.push(createParticle(centerX, centerY, amplitude))
      }
    }
    
    // Update existing particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i]
      
      // Much slower tempo-based movement speed adjustment
      const tempoSpeed = 0.3 + (amplitude / 255) * 0.7
      particle.x += particle.vx * tempoSpeed
      particle.y += particle.vy * tempoSpeed
      
      // No alpha fading - particles stay visible until they exit screen
      // No size shrinking - particles maintain size
      
      // Remove particles only when they're off-screen
      const canvas = canvasRef.current
      if (canvas && (
        particle.x < -100 || particle.x > canvas.width + 100 ||
        particle.y < -100 || particle.y > canvas.height + 100
      )) {
        particles.splice(i, 1)
      }
    }
  }

  // Draw audio visualization
  const draw = () => {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    
    if (!canvas || !analyser) {
      console.log('[AudioVisualizer] Draw skipped - missing canvas or analyser:', { canvas: !!canvas, analyser: !!analyser })
      return
    }
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.log('[AudioVisualizer] Draw skipped - no context')
      return
    }

    // Debug: log every 60 frames (about once per second at 60fps)
    if (!drawFrameCountRef.current) {
      drawFrameCountRef.current = 0
    }
    drawFrameCountRef.current++
    
    if (drawFrameCountRef.current % 60 === 0) {
      console.log('[AudioVisualizer] Draw loop running, frame:', drawFrameCountRef.current)
    }
    
    // Get audio data
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const waveArray = new Float32Array(analyser.fftSize)
    
    analyser.getByteFrequencyData(dataArray)
    analyser.getFloatTimeDomainData(waveArray)
    
    // Calculate amplitude (energy in 20-200Hz range, similar to p5.js getEnergy)
    const lowFreqStart = Math.floor((20 / 22050) * bufferLength)
    const lowFreqEnd = Math.floor((200 / 22050) * bufferLength)
    let amplitude = 0
    for (let i = lowFreqStart; i < lowFreqEnd; i++) {
      amplitude += dataArray[i]
    }
    amplitude = amplitude / (lowFreqEnd - lowFreqStart)
    setCurrentAmplitude(amplitude)
    
    // Debug amplitude every 60 frames
    if (drawFrameCountRef.current % 60 === 0) {
      console.log('[AudioVisualizer] Current amplitude:', amplitude)
    }
    
    // Clear canvas without covering background
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Position waveform rings to match timer (center of screen)
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    
    // Timer circle radius is about 140px, so waveform should be larger to avoid overlap
    const baseRadius = 180
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.lineWidth = 2
    ctx.fillStyle = 'none'
    
    // Draw two ring halves to match the p5.js style
    for (let t = -1; t <= 1; t += 2) {
      ctx.beginPath()
      
      for (let i = 0; i <= 180; i += 1) {
        const index = Math.floor((i / 180) * (waveArray.length - 1))
        const waveValue = waveArray[index] || 0
        
        // Map wave value to radius variations around the timer circle
        const r = baseRadius + (waveValue * 100)
        
        const angleRad = (i * Math.PI) / 180
        const x = centerX + r * Math.sin(angleRad) * t
        const y = centerY + r * Math.cos(angleRad)
        
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      
      ctx.stroke()
    }
    
    // Update and draw particles
    updateParticles(amplitude, centerX, centerY)
    const particles = particlesRef.current
    
    // Draw particles with enhanced visibility
    for (const particle of particles) {
      ctx.save()
      
      // Make particles more prominent with glow effect
      ctx.shadowColor = `rgb(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]})`
      ctx.shadowBlur = 8
      ctx.globalAlpha = particle.alpha
      
      // Main particle
      ctx.fillStyle = `rgb(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]})`
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      
      // Inner bright core for more prominence
      ctx.shadowBlur = 0
      ctx.fillStyle = `rgb(255, 255, 255)`
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * 0.4, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }
    
    animationRef.current = requestAnimationFrame(draw)
  }

  // Handle play/pause
  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) {
      console.error('No audio element found')
      return
    }

    try {
      // Initialize audio context if needed
      if (!isInitialized) {
        console.log('Initializing audio before play...')
        await initAudio()
      }

      if (isPlaying) {
        console.log('Pausing audio...')
        audio.pause()
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
        onPlayStateChange?.(false)
      } else {
        // Resume audio context if suspended
        if (audioContextRef.current?.state === 'suspended') {
          console.log('Resuming suspended audio context...')
          await audioContextRef.current.resume()
        }

        console.log('Attempting to play audio...', audio.src)
        
        // Check if audio has data
        if (audio.readyState < 2) {
          console.log('Audio not ready, waiting...')
          audio.load()
          await new Promise((resolve) => {
            audio.addEventListener('canplay', resolve, { once: true })
          })
        }

        await audio.play()
        console.log('Audio playing successfully')
        draw()
        onPlayStateChange?.(true)
      }
    } catch (error) {
      console.error('Error in togglePlay:', error)
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          console.log('Audio play blocked by browser - user interaction required')
        } else if (error.name === 'NotSupportedError') {
          console.log('Audio format not supported')
        }
      }
    }
  }

  // Resize canvas
  const resizeCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      const audio = audioRef.current
      
      // Reset initialization when URL changes
      setIsInitialized(false)
      
      // Add event listeners
      const handleCanPlay = () => {
        console.log('✅ Audio can play:', audioUrl)
      }
      
      const handleError = (e: Event) => {
        console.error('❌ Audio error:', e, 'URL:', audioUrl)
      }
      
      const handleLoadStart = () => {
        console.log('🔄 Audio load started:', audioUrl)
      }
      
      const handleLoadedData = () => {
        console.log('📦 Audio data loaded:', audioUrl)
      }
      
      const handleLoadedMetadata = () => {
        console.log('📋 Audio metadata loaded:', audioUrl, 'Duration:', audio.duration)
      }
      
      audio.addEventListener('canplay', handleCanPlay)
      audio.addEventListener('error', handleError)
      audio.addEventListener('loadstart', handleLoadStart)
      audio.addEventListener('loadeddata', handleLoadedData)
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      
      console.log('🎵 Setting audio source:', audioUrl)
      audio.src = audioUrl
      audio.load() // Force reload
      
      return () => {
        audio.removeEventListener('canplay', handleCanPlay)
        audio.removeEventListener('error', handleError)
        audio.removeEventListener('loadstart', handleLoadStart)
        audio.removeEventListener('loadeddata', handleLoadedData)
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
    }
  }, [audioUrl])

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <audio
        ref={audioRef}
        loop
        preload="metadata"
        crossOrigin="anonymous"
      />
    </div>
  )
}
