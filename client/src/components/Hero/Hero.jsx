import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const imagesRef = useRef([])

  // The local 3D printer sequence provided by the user
  const frameCount = 51
  
  // Create the URL for a specific frame
  const currentFrame = index => (
    `/printer-sequence/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
  )

  // Preload all images on mount
  useEffect(() => {
    let loadedCount = 0

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image()
      img.src = currentFrame(i)
      img.onload = () => {
        loadedCount++
        if (loadedCount === frameCount) {
          setImagesLoaded(true)
        }
      }
      imagesRef.current.push(img)
    }
  }, [])

  // Handle scroll and drawing to canvas
  useEffect(() => {
    if (!imagesLoaded) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const container = containerRef.current

    // Set canvas dimensions to window inner size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const drawFrame = (index) => {
      const img = imagesRef.current[index]
      if (img) {
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height)
        
        // Calculate aspect ratio to fit image properly (Cover effect)
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
        const x = (canvas.width / 2) - (img.width / 2) * scale
        const y = (canvas.height / 2) - (img.height / 2) * scale
        
        context.drawImage(img, x, y, img.width * scale, img.height * scale)
      }
    }

    // Draw first frame immediately
    drawFrame(0)

    const handleScroll = () => {
      // Calculate how far down the user has scrolled inside the 400vh container
      const scrollTop = window.scrollY
      const containerTop = container.offsetTop
      const maxScroll = container.scrollHeight - window.innerHeight
      
      let progress = (scrollTop - containerTop) / maxScroll
      // Clamp progress between 0 and 1
      progress = Math.max(0, Math.min(1, progress))
      setScrollProgress(progress)

      // Determine which frame to show
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(progress * frameCount)
      )

      requestAnimationFrame(() => drawFrame(frameIndex))
    }



    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      handleScroll()
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    
    // Trigger scroll once to set initial state
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [imagesLoaded])

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-k-black">
      {/* Sticky Container - locks to screen while scrolling */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Loading State */}
        {!imagesLoaded && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-k-black">
            <div className="w-8 h-8 border-2 border-k-silver-dim border-t-emerald-400 rounded-full animate-spin mb-4" />
            <p className="text-k-silver-dim text-sm font-display tracking-widest uppercase">Loading High-Res Sequence...</p>
          </div>
        )}

        {/* The Image Sequence Canvas */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 z-0 w-full h-full object-cover opacity-80"
        />

        {/* Dark overlay to match the palette and make text readable */}
        <div className="absolute inset-0 z-[1] bg-black/60" />

        {/* --- SCROLL-TRIGGERED TEXT OVERLAYS --- */}
        {/* These elements fade in and out based on the scroll progress (0.0 to 1.0) */}
        
        {/* Text 1: The Initial Hook (0 to 0.20) */}
        <div 
          className="absolute z-10 text-center transition-all duration-700 ease-out"
          style={{
            opacity: scrollProgress < 0.20 ? 1 : 0,
            transform: `translateY(${scrollProgress < 0.20 ? '0px' : '-40px'})`,
            pointerEvents: scrollProgress < 0.20 ? 'auto' : 'none'
          }}
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
            From concept <br /> to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">creation.</span>
          </h1>
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-[10px] text-k-silver-dim uppercase tracking-[0.2em]">Scroll to Build</span>
            <ChevronDown size={16} className="text-k-silver-dim" />
          </div>
        </div>

        {/* Text 2: Left Side (0.20 to 0.48) */}
        <div 
          className="absolute z-10 left-[10%] md:left-[15%] max-w-sm transition-all duration-700 ease-out text-left"
          style={{
            opacity: scrollProgress > 0.20 && scrollProgress < 0.48 ? 1 : 0,
            transform: `translateY(${scrollProgress > 0.20 && scrollProgress < 0.48 ? '0px' : '40px'})`,
            pointerEvents: scrollProgress > 0.20 && scrollProgress < 0.48 ? 'auto' : 'none'
          }}
        >
          <h2 className="font-display text-4xl font-bold text-white mb-4">Flawless Layers</h2>
          <p className="text-white text-lg leading-relaxed drop-shadow-md">
            Every micron matters. Our high-precision resin printing ensures that your prototypes have the exact shape and structural integrity you designed.
          </p>
        </div>

        {/* Text 3: Right Side (0.50 to 0.78) */}
        <div 
          className="absolute z-10 right-[10%] md:right-[15%] max-w-sm transition-all duration-700 ease-out text-right"
          style={{
            opacity: scrollProgress > 0.50 && scrollProgress < 0.78 ? 1 : 0,
            transform: `translateY(${scrollProgress > 0.50 && scrollProgress < 0.78 ? '0px' : '40px'})`,
            pointerEvents: scrollProgress > 0.50 && scrollProgress < 0.78 ? 'auto' : 'none'
          }}
        >
          <h2 className="font-display text-4xl font-bold text-white mb-4">Complex Routing</h2>
          <p className="text-white text-lg leading-relaxed drop-shadow-md">
            Seamlessly integrate wire channels, inserts, and moving parts perfectly into the final shape. No assembly required.
          </p>
        </div>

        {/* Text 4: The Finale & Call to Action (0.80 to 1.0) */}
        <div 
          className="absolute z-10 text-center transition-all duration-700 ease-out"
          style={{
            opacity: scrollProgress > 0.80 ? 1 : 0,
            transform: `translateY(${scrollProgress > 0.80 ? '0px' : '40px'})`,
            pointerEvents: scrollProgress > 0.80 ? 'auto' : 'none'
          }}
        >
          <h2 className="font-display text-5xl font-bold text-white mb-8">Ready to print?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn-primary">
              Start Your Project
              <ArrowRight size={16} />
            </Link>
            <Link to="/products" className="btn-outline bg-k-card/50 backdrop-blur-md">
              View Materials
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
