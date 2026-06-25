import { Link } from 'react-router-dom'
import { Printer, Globe, Share2, Link2, Mail, ArrowUpRight } from 'lucide-react'

const FOOTER_LINKS = [
  {
    title: 'Services',
    links: [
      { label: '3D Printing', path: '/services' },
      { label: 'Repair & Rebuild', path: '/services' },
      { label: 'Design Service', path: '/services' },
      { label: 'Materials', path: '/services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', path: '/' },
      { label: 'Products', path: '/products' },
      { label: 'Gallery', path: '/' },
      { label: 'Contact', path: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', path: '/' },
      { label: 'Shipping', path: '/' },
      { label: 'Returns', path: '/' },
      { label: 'Privacy Policy', path: '/' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-k-border bg-k-dark/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white to-k-silver flex items-center justify-center">
                <Printer size={22} className="text-k-black" />
              </div>
              <span className="font-display font-bold text-xl tracking-wider text-k-white">
                KRIX<span className="text-k-silver">TRON</span>
              </span>
            </Link>
            <p className="text-sm text-k-silver-dim font-body leading-relaxed max-w-xs">
              Premium 3D printing services for prototypes, production parts, and custom manufacturing solutions.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              {[Globe, Share2, Link2, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg border border-k-border flex items-center justify-center text-k-silver-dim hover:text-white hover:border-k-silver hover:bg-k-card transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-xs font-semibold text-white uppercase tracking-[0.2em] mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-k-silver-dim hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-k-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-k-silver-dim">
            © {new Date().getFullYear()} KRIXTRON. All rights reserved.
          </p>
          <p className="text-xs text-k-silver-dim">
            Precision Engineered · Layer by Layer
          </p>
        </div>
      </div>
    </footer>
  )
}
