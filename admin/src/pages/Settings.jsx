import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Key, Shield, CheckCircle } from 'lucide-react'

export default function Settings() {
  const { admin } = useAuth()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('All fields are required')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match')
      return
    }
    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    // Mock save
    await new Promise(resolve => setTimeout(resolve, 800))
    setSaved(true)
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white tracking-wide">Settings</h1>
        <p className="text-sm text-k-silver-dim mt-1">Manage your account settings</p>
      </div>

      <div className="max-w-xl">
        {/* Account info */}
        <div className="bg-k-dark border border-k-border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-k-silver/20 to-k-border flex items-center justify-center">
              <span className="font-display text-lg font-bold text-k-silver">
                {admin?.username?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{admin?.username || 'admin'}</p>
              <p className="text-xs text-k-silver-dim mt-0.5">Administrator</p>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="bg-k-dark border border-k-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-k-card border border-k-border flex items-center justify-center">
              <Key size={18} className="text-k-silver" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Change Password</h3>
              <p className="text-xs text-k-silver-dim">Update your admin password</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-1.5">Current Password</label>
              <input
                type="password"
                value={form.currentPassword}
                onChange={e => setForm({...form, currentPassword: e.target.value})}
                className="w-full px-4 py-2.5 bg-k-black border border-k-border rounded-lg text-sm text-white focus:outline-none focus:border-k-silver/40 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-1.5">New Password</label>
              <input
                type="password"
                value={form.newPassword}
                onChange={e => setForm({...form, newPassword: e.target.value})}
                className="w-full px-4 py-2.5 bg-k-black border border-k-border rounded-lg text-sm text-white focus:outline-none focus:border-k-silver/40 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => setForm({...form, confirmPassword: e.target.value})}
                className="w-full px-4 py-2.5 bg-k-black border border-k-border rounded-lg text-sm text-white focus:outline-none focus:border-k-silver/40 transition-colors"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-sm text-red-400">
                {error}
              </div>
            )}

            {saved && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-sm text-emerald-400">
                <CheckCircle size={16} />
                Password updated successfully
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-white to-k-silver text-k-black text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-white/10 transition-all"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Security info */}
        <div className="bg-k-dark border border-k-border rounded-xl p-6 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={18} className="text-k-silver" />
            <h3 className="text-sm font-semibold text-white">Security</h3>
          </div>
          <div className="space-y-3 text-xs text-k-silver-dim">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Passwords hashed with bcrypt (12 salt rounds)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              JWT access tokens expire in 15 minutes
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Refresh tokens stored in httpOnly secure cookies
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Rate limited: 10 login attempts per 15 minutes
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
