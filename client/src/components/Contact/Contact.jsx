import { useState } from 'react'
import { Send, User, Mail, Phone, MessageSquare, Upload, CheckCircle, Printer } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [file, setFile] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <section className="section-padding relative" id="contact">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card p-16 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
              <CheckCircle size={40} className="text-emerald-400" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white">Message Sent!</h3>
            <p className="text-k-silver-dim mt-3 font-body">
              We'll get back to you within 24 hours. Thank you for choosing KRIXTRON.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); setFile(null) }}
              className="btn-outline mt-8 text-xs"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding relative" id="contact">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-body text-k-silver-dim uppercase tracking-[0.3em]">Get in Touch</span>
          <h2 className="section-title font-display text-3xl md:text-4xl font-bold mt-3 text-gradient">
            Contact Us
          </h2>
          <p className="mt-4 text-k-silver-dim font-body max-w-xl mx-auto">
            Have a project in mind? Send us your requirements and we'll get back to you with a quote.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass-card p-8">
              <h3 className="font-display text-lg font-semibold text-white mb-6">Quick Info</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-k-border/50 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-k-silver" />
                  </div>
                  <div>
                    <p className="text-xs text-k-silver-dim uppercase tracking-wider">Email</p>
                    <p className="text-sm text-white mt-0.5">hello@krixtron.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-k-border/50 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-k-silver" />
                  </div>
                  <div>
                    <p className="text-xs text-k-silver-dim uppercase tracking-wider">Phone</p>
                    <p className="text-sm text-white mt-0.5">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-k-border/50 flex items-center justify-center shrink-0">
                    <Printer size={18} className="text-k-silver" />
                  </div>
                  <div>
                    <p className="text-xs text-k-silver-dim uppercase tracking-wider">Studio</p>
                    <p className="text-sm text-white mt-0.5">Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Working hours */}
            <div className="glass-card p-8">
              <h3 className="font-display text-lg font-semibold text-white mb-4">Working Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-k-silver-dim">Mon — Fri</span>
                  <span className="text-white">9:00 AM — 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-k-silver-dim">Saturday</span>
                  <span className="text-white">10:00 AM — 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-k-silver-dim">Sunday</span>
                  <span className="text-k-silver-dim">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 glass-card p-8 md:p-10">
            <h3 className="font-display text-lg font-semibold text-white mb-8">Send a Message</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div className="relative">
                <User size={16} className="absolute top-3.5 left-4 text-k-silver-dim" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-k-dark border border-k-border rounded-lg text-sm text-white placeholder:text-k-silver-dim/50 focus:outline-none focus:border-k-silver/50 transition-colors font-body"
                />
              </div>
              {/* Email */}
              <div className="relative">
                <Mail size={16} className="absolute top-3.5 left-4 text-k-silver-dim" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-k-dark border border-k-border rounded-lg text-sm text-white placeholder:text-k-silver-dim/50 focus:outline-none focus:border-k-silver/50 transition-colors font-body"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="relative mt-5">
              <Phone size={16} className="absolute top-3.5 left-4 text-k-silver-dim" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-k-dark border border-k-border rounded-lg text-sm text-white placeholder:text-k-silver-dim/50 focus:outline-none focus:border-k-silver/50 transition-colors font-body"
              />
            </div>

            {/* Message */}
            <div className="relative mt-5">
              <MessageSquare size={16} className="absolute top-3.5 left-4 text-k-silver-dim" />
              <textarea
                name="message"
                placeholder="Describe your project requirements..."
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full pl-11 pr-4 py-3 bg-k-dark border border-k-border rounded-lg text-sm text-white placeholder:text-k-silver-dim/50 focus:outline-none focus:border-k-silver/50 transition-colors font-body resize-none"
              />
            </div>

            {/* File upload */}
            <div className="mt-5">
              <label className="flex items-center gap-3 px-4 py-3 bg-k-dark border border-dashed border-k-border rounded-lg cursor-pointer hover:border-k-silver-dim transition-colors">
                <Upload size={16} className="text-k-silver-dim" />
                <span className="text-sm text-k-silver-dim">
                  {file ? file.name : 'Attach reference file (3D model, sketch, etc.)'}
                </span>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  accept=".glb,.gltf,.stl,.obj,.step,.pdf,.jpg,.png"
                />
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-8 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="loader-dot" style={{ animationDelay: '0s' }} />
                  <span className="loader-dot" style={{ animationDelay: '0.2s' }} />
                  <span className="loader-dot" style={{ animationDelay: '0.4s' }} />
                </span>
              ) : (
                <>
                  Send Message
                  <Send size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

