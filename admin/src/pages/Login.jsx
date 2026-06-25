import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Printer, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    setError('')
    try {
      await login(email, password)
    } catch (err) {
      setError('Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-k-black flex items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-white/[0.03] to-transparent" />

      {/* Floating shapes */}
      <div className="absolute top-20 left-20 w-24 h-24 border border-k-border/30 rotate-45 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-32 right-24 w-16 h-16 border border-k-border/20 rounded-full animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-1/3 right-16 w-12 h-12 border border-k-border/15 -rotate-12 animate-pulse" style={{ animationDuration: '5s' }} />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-k-dark/80 backdrop-blur-xl border border-k-border rounded-2xl p-10 shadow-2xl shadow-black/50">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-k-silver flex items-center justify-center mb-5 shadow-lg shadow-white/10">
              <Printer size={32} className="text-k-black" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-wider">
              <span className="text-white">KRIX</span>
              <span className="text-k-silver">TRON</span>
            </h1>
            <p className="text-xs text-k-silver-dim mt-2 uppercase tracking-[0.3em]">Admin Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full px-4 py-3 bg-k-black/50 border border-k-border rounded-xl text-sm text-white placeholder:text-k-silver-dim/40 focus:outline-none focus:border-k-silver/40 transition-colors font-body"
                autoFocus
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  className="w-full px-4 py-3 pr-12 bg-k-black/50 border border-k-border rounded-xl text-sm text-white placeholder:text-k-silver-dim/40 focus:outline-none focus:border-k-silver/40 transition-colors font-body"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-k-silver-dim hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-white to-k-silver text-k-black font-semibold text-sm uppercase tracking-wider rounded-xl transition-all hover:shadow-lg hover:shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-k-black animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-k-black animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-k-black animate-pulse" style={{ animationDelay: '0.4s' }} />
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo hint */}
          <p className="text-center text-[11px] text-k-silver-dim/50 mt-6">
            Sign in with your registered email
          </p>
        </div>
      </div>
    </div>
  )
}
