import { useScrollAnimations } from '../hooks/useScrollAnimations'
import { Printer, Wrench, Palette, Layers, ArrowRight, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const SERVICES_DETAIL = [
  {
    icon: Printer,
    title: '3D Printing',
    subtitle: 'FDM · SLA · SLS',
    description: 'From rapid prototypes to production-grade components, our multi-technology printing capabilities deliver the perfect balance of speed, precision, and cost-effectiveness.',
    features: [
      'Fused Deposition Modeling (FDM) — ideal for functional prototypes',
      'Stereolithography (SLA) — ultra-smooth surface finishes',
      'Selective Laser Sintering (SLS) — complex geometries, no supports',
      'Tolerances as fine as ±0.1mm',
      'Build volumes up to 300×300×400mm',
      'Batch production up to 1000+ units',
    ],
  },
  {
    icon: Wrench,
    title: 'Repair & Rebuild',
    subtitle: 'Reverse Engineering',
    description: 'Broken, discontinued, or hard-to-find parts? We 3D scan, reverse-engineer, and rebuild components to exact specifications — often stronger than the original.',
    features: [
      'High-precision 3D scanning (0.05mm accuracy)',
      'CAD reconstruction from physical parts',
      'Material matching for OEM compatibility',
      'Structural reinforcement and optimization',
      'Legacy part reproduction',
      'Assembly fitting verification',
    ],
  },
  {
    icon: Palette,
    title: 'Design Service',
    subtitle: 'Concept to CAD',
    description: 'Don\'t have a 3D model? No problem. Our industrial designers transform your sketches, photos, or verbal descriptions into print-ready 3D files.',
    features: [
      'Parametric CAD modeling (SolidWorks, Fusion 360)',
      'Design for Manufacturability (DFM) optimization',
      'Multiple design iterations included',
      'File preparation and print orientation',
      'Organic and freeform surface modeling',
      'Technical drawings and specifications',
    ],
  },
  {
    icon: Layers,
    title: 'Materials Library',
    subtitle: '50+ Options',
    description: 'Choose from our extensive materials catalog. Each material is tested and profiled for optimal print settings, ensuring consistent results every time.',
    features: [
      'PLA, ABS, PETG — standard engineering plastics',
      'Nylon PA12 — high strength and flexibility',
      'TPU — flexible and impact-resistant',
      'Resins — standard, tough, castable, dental',
      'Specialty — carbon fiber, wood-fill, metal-fill',
      'Custom color matching (RAL/Pantone)',
    ],
  },
]

export default function ServicesPage() {
  useScrollAnimations()

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="section-padding text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-body text-k-silver-dim uppercase tracking-[0.3em]">What We Offer</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-4 text-gradient">
            Our Services
          </h1>
          <p className="mt-6 text-lg text-k-silver-dim font-body font-light leading-relaxed">
            End-to-end additive manufacturing solutions — from initial concept to final delivery. 
            We handle everything so you can focus on innovation.
          </p>
        </div>
      </section>

      {/* Services detail */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="space-y-20">
          {SERVICES_DETAIL.map((service, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? 'lg:direction-rtl' : ''
              }`}
            >
              {/* Visual */}
              <div className={`${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="glass-card glow-border p-12 flex items-center justify-center min-h-[320px] relative overflow-hidden">
                  {/* Geometric pattern */}
                  <div className="absolute inset-0 opacity-10"
                       style={{
                         backgroundImage: 'linear-gradient(rgba(192,192,192,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(192,192,192,0.15) 1px, transparent 1px)',
                         backgroundSize: '30px 30px'
                       }} />
                  <service.icon size={80} className="text-k-silver/40 relative z-10" strokeWidth={1} />
                  {/* Corner accents */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-k-silver/20" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-k-silver/20" />
                </div>
              </div>

              {/* Content */}
              <div className={`${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-k-card border border-k-border flex items-center justify-center">
                    <service.icon size={20} className="text-k-silver" />
                  </div>
                  <span className="text-xs text-k-silver-dim uppercase tracking-[0.2em] font-display">{service.subtitle}</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                  {service.title}
                </h2>
                <p className="text-k-silver-dim font-body leading-relaxed mb-8">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-k-silver">
                      <CheckCircle size={16} className="text-k-silver-dim mt-0.5 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding text-center">
        <div className="max-w-2xl mx-auto glass-card p-12">
          <h3 className="font-display text-2xl font-bold text-white mb-4">
            Need a Custom Solution?
          </h3>
          <p className="text-k-silver-dim font-body mb-8">
            Every project is unique. Tell us what you need and we'll create a tailored manufacturing plan.
          </p>
          <Link to="/contact" className="btn-primary">
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
