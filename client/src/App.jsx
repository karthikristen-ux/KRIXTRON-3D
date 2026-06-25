import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import ScrollWire from './components/ScrollWire/ScrollWire'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import Products from './pages/Products'
import Contact from './pages/Contact'

export default function App() {
  return (
    <>
      {/* Geometric grid background */}
      <div className="geo-grid" />

      {/* Filament scroll indicator */}
      <ScrollWire />

      {/* Navigation */}
      <Navbar />

      {/* Page routes */}
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </>
  )
}
