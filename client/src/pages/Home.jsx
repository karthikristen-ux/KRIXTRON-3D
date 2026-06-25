import { useScrollAnimations } from '../hooks/useScrollAnimations'
import Hero from '../components/Hero/Hero'
import Services from '../components/Services/Services'
import HowItWorks from '../components/HowItWorks/HowItWorks'
import Products from '../components/Products/Products'
import Gallery from '../components/Gallery/Gallery'
import Testimonials from '../components/Testimonials/Testimonials'
import ContactSection from '../components/Contact/Contact'
import CTA from '../components/CTA/CTA'

export default function Home() {
  useScrollAnimations()

  return (
    <>
      <Hero />
      <Services />
      <HowItWorks />
      <Products />
      <Gallery />
      <Testimonials />
      <CTA />
      <ContactSection />
    </>
  )
}
