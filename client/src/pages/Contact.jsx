import { useScrollAnimations } from '../hooks/useScrollAnimations'
import ContactSection from '../components/Contact/Contact'

export default function ContactPage() {
  useScrollAnimations()

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="section-padding text-center pb-0">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-body text-k-silver-dim uppercase tracking-[0.3em]">Reach Out</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-4 text-gradient">
            Contact Us
          </h1>
          <p className="mt-6 text-lg text-k-silver-dim font-body font-light leading-relaxed">
            Have a project in mind? We'd love to hear from you. Get in touch and let's discuss how we can bring your ideas to life.
          </p>
        </div>
      </section>

      {/* Contact form section */}
      <ContactSection />
    </div>
  )
}
