import { useScrollAnimations } from '../hooks/useScrollAnimations'
import ProductsSection from '../components/Products/Products'

export default function ProductsPage() {
  useScrollAnimations()

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="section-padding text-center pb-0">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-body text-k-silver-dim uppercase tracking-[0.3em]">Collection</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-4 text-gradient">
            Our Products
          </h1>
          <p className="mt-6 text-lg text-k-silver-dim font-body font-light leading-relaxed">
            Explore our range of precision-engineered 3D printed products. 
            Click any product to view it in interactive 3D.
          </p>
        </div>
      </section>

      {/* Products grid (reusing the component) */}
      <ProductsSection />
    </div>
  )
}
