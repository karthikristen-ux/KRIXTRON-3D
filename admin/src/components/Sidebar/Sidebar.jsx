import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Users, FileText, FilePlus, Package,
  Settings, LogOut, Printer, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useState } from 'react'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Customers', path: '/customers', icon: Users },
  { label: 'Invoices', path: '/invoices', icon: FileText },
  { label: 'Quotations', path: '/quotations', icon: FilePlus },
  { label: 'Products', path: '/products', icon: Package },
  { label: 'Settings', path: '/settings', icon: Settings },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { logout, admin } = useAuth()
  const location = useLocation()

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-k-dark border-r border-k-border flex flex-col transition-all duration-300 z-40 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-k-border shrink-0">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-white to-k-silver flex items-center justify-center shrink-0">
          <Printer size={18} className="text-k-black" />
        </div>
        {!collapsed && (
          <span className="ml-3 font-display font-bold text-sm tracking-wider text-k-white">
            KRIX<span className="text-k-silver">TRON</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-white/[0.07] text-white'
                    : 'text-k-silver-dim hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <item.icon
                  size={20}
                  className={`shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-k-silver-dim group-hover:text-k-silver'
                  }`}
                />
                {!collapsed && <span>{item.label}</span>}
                {isActive && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-k-border p-3 space-y-2">
        {/* User info */}
        {!collapsed && admin && (
          <div className="px-3 py-2 rounded-lg bg-k-card/50">
            <p className="text-xs text-k-silver-dim">Logged in as</p>
            <p className="text-sm font-medium text-white">{admin.username}</p>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-k-silver-dim hover:text-red-400 hover:bg-red-400/[0.06] transition-all"
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-lg text-k-silver-dim hover:text-white hover:bg-white/[0.04] transition-all"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  )
}
