import { ArrowRight, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import PrinterText from '../PrinterText/PrinterText'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="hero-glow" />

      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-k-border rotate-45 animate-float opacity-20" />
      <div className="absolute bottom-32 right-16 w-16 h-16 border border-k-border rotate-12 animate-float opacity-15" style={{ animationDelay: '2s' }} />
      <div className="absolute top-40 right-20 w-12 h-12 border border-k-border -rotate-12 animate-float opacity-10" style={{ animationDelay: '4s' }} />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6 pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-k-border bg-k-card/50 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-body text-k-silver-dim uppercase tracking-widest">
            Precision 3D Manufacturing
          </span>
        </div>

        {/* 3D Printer Text Animation */}
        <PrinterText />

        {/* Tagline */}
        <p className="mt-6 text-lg md:text-xl text-k-silver-dim font-body font-light max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
          From concept to creation — precision engineered 3D printing for
          prototypes, production parts, and beyond.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Link to="/contact" className="btn-primary">
            Start Your Project
            <ArrowRight size={16} />
          </Link>
          <Link to="/products" className="btn-outline">
            View Products
          </Link>
        </div>

        {/* Stats row */}
        <div className="stats-section grid grid-cols-3 gap-8 mt-20 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <div className="text-center">
            <p className="stat-number font-display text-2xl md:text-3xl font-bold text-white">500+</p>
            <p className="text-xs text-k-silver-dim uppercase tracking-wider mt-1">Projects Done</p>
          </div>
          <div className="text-center">
            <p className="stat-number font-display text-2xl md:text-3xl font-bold text-white">50+</p>
            <p className="text-xs text-k-silver-dim uppercase tracking-wider mt-1">Materials</p>
          </div>
          <div className="text-center">
            <p className="stat-number font-display text-2xl md:text-3xl font-bold text-white">0.1mm</p>
            <p className="text-xs text-k-silver-dim uppercase tracking-wider mt-1">Precision</p>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[10px] text-k-silver-dim uppercase tracking-[0.2em]">Scroll</span>
        <ChevronDown size={16} className="text-k-silver-dim" />
      </div>
    </section>
  )
}
