import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Printer } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Products', path: '/products' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-k-black/80 backdrop-blur-xl border-b border-k-border shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white to-k-silver flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <Printer size={22} className="text-k-black" />
          </div>
          <span className="font-display font-bold text-xl tracking-wider text-k-white">
            KRIX<span className="text-k-silver">TRON</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-5 py-2.5 text-sm font-medium tracking-wide uppercase transition-colors duration-300 rounded-lg ${
                location.pathname === link.path
                  ? 'text-white'
                  : 'text-k-silver-dim hover:text-white'
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent rounded-full" />
              )}
            </Link>
          ))}
          <Link
            to="/contact"
            className="ml-4 btn-primary text-xs py-2.5 px-5"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-k-silver hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute top-20 left-0 right-0 bg-k-dark/95 backdrop-blur-xl border-b border-k-border transition-all duration-400 overflow-hidden ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-3 rounded-lg text-sm font-medium tracking-wide uppercase transition-all ${
                location.pathname === link.path
                  ? 'text-white bg-white/5'
                  : 'text-k-silver-dim hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/contact" className="btn-primary mt-3 justify-center text-xs">
            Get a Quote
          </Link>
        </div>
      </div>
    </nav>
  )
}
