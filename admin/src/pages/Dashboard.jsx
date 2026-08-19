import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { IndianRupee, FileText, Users, Package, TrendingUp, Clock } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-k-dark border border-k-border rounded-lg px-4 py-3 shadow-xl">
        <p className="text-xs text-k-silver-dim">{label}</p>
        <p className="text-sm font-semibold text-white mt-1">
          ₹{payload[0].value.toLocaleString('en-IN')}
        </p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingInvoices: 0,
    totalCustomers: 0,
    totalProducts: 0,
    monthlyRevenue: [],
    invoicesByStatus: []
  })
  const [recentInvoices, setRecentInvoices] = useState([])
  const [recentCustomers, setRecentCustomers] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch totals
      const { data: invoicesData } = await supabase.from('invoices').select('*')
      const { data: customersData } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
      const { data: productsData } = await supabase.from('products').select('*').eq('is_active', true)

      const invoices = invoicesData || []
      const customers = customersData || []
      const products = productsData || []

      // Calculate stats
      let totalRev = 0
      let pendingCount = 0
      let statusCounts = { PAID: 0, PENDING: 0, OVERDUE: 0, CANCELLED: 0 }
      
      invoices.forEach(inv => {
        if (inv.status === 'PAID') totalRev += (inv.total_amount || 0)
        if (inv.status === 'PENDING') pendingCount++
        
        if (statusCounts[inv.status] !== undefined) {
          statusCounts[inv.status]++
        }
      })

      // Generate invoice status pie data
      const pieData = []
      if (statusCounts.PAID > 0) pieData.push({ name: 'Paid', value: statusCounts.PAID, color: '#10b981' })
      if (statusCounts.PENDING > 0) pieData.push({ name: 'Pending', value: statusCounts.PENDING, color: '#f59e0b' })
      if (statusCounts.OVERDUE > 0) pieData.push({ name: 'Overdue', value: statusCounts.OVERDUE, color: '#ef4444' })

      // Create a dummy monthly revenue chart (real implementation would group by month)
      const currentMonth = new Date().toLocaleString('default', { month: 'short' })
      const monthlyRev = [
        { month: currentMonth, revenue: totalRev }
      ]

      setStats({
        totalRevenue: totalRev,
        pendingInvoices: pendingCount,
        totalCustomers: customers.length,
        totalProducts: products.length,
        monthlyRevenue: monthlyRev,
        invoicesByStatus: pieData
      })

      setRecentInvoices(invoices.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4))
      setRecentCustomers(customers.slice(0, 4))
      
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
    }
  }

  const STAT_CARDS = [
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      change: 'Lifetime',
      positive: true,
    },
    {
      label: 'Pending Invoices',
      value: stats.pendingInvoices,
      icon: FileText,
      change: `${stats.pendingInvoices} unpaid`,
      positive: stats.pendingInvoices === 0,
    },
    {
      label: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      change: 'Registered',
      positive: true,
    },
    {
      label: 'Active Products',
      value: stats.totalProducts,
      icon: Package,
      change: 'Available',
      positive: true,
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white tracking-wide">Dashboard</h1>
        <p className="text-sm text-k-silver-dim mt-1">Welcome back. Here's your business overview.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {STAT_CARDS.map((stat, i) => (
          <div
            key={i}
            className="bg-k-dark border border-k-border rounded-xl p-6 hover:border-k-silver/20 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-k-card border border-k-border flex items-center justify-center group-hover:border-k-silver/20 transition-colors">
                <stat.icon size={20} className="text-k-silver" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                stat.positive
                  ? 'text-emerald-400 bg-emerald-400/[0.08]'
                  : 'text-amber-400 bg-amber-400/[0.08]'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white font-display">{stat.value}</p>
            <p className="text-xs text-k-silver-dim mt-1 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-k-dark border border-k-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-white">Monthly Revenue</h3>
              <p className="text-xs text-k-silver-dim mt-0.5">Current Overview</p>
            </div>
            <TrendingUp size={18} className="text-k-silver-dim" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyRevenue} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                <XAxis dataKey="month" stroke="#707070" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#707070" fontSize={11} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="revenue" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#707070" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invoice status pie */}
        <div className="bg-k-dark border border-k-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-white">Invoice Status</h3>
              <p className="text-xs text-k-silver-dim mt-0.5">Current distribution</p>
            </div>
            <FileText size={18} className="text-k-silver-dim" />
          </div>
          <div className="h-48">
            {stats.invoicesByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.invoicesByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.invoicesByStatus.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#f5f5f5',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-k-silver-dim text-sm">No Invoice Data</div>
            )}
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center gap-5 mt-2">
            {stats.invoicesByStatus.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-xs text-k-silver-dim">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent invoices */}
        <div className="bg-k-dark border border-k-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Invoices</h3>
          <div className="space-y-3">
            {recentInvoices.length > 0 ? recentInvoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-k-card/50 border border-k-border/50 hover:border-k-border transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-k-border/50 flex items-center justify-center">
                    <FileText size={16} className="text-k-silver-dim" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{inv.invoice_no}</p>
                    <p className="text-xs text-k-silver-dim">{inv.customer_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">₹{(inv.total_amount || 0).toLocaleString('en-IN')}</p>
                  <span className={`text-[10px] uppercase tracking-wider font-medium ${
                    inv.status === 'PAID' ? 'text-emerald-400' :
                    inv.status === 'PENDING' ? 'text-amber-400' :
                    'text-red-400'
                  }`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            )) : <p className="text-sm text-k-silver-dim">No recent invoices.</p>}
          </div>
        </div>

        {/* Recent customers */}
        <div className="bg-k-dark border border-k-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Customers</h3>
          <div className="space-y-3">
            {recentCustomers.length > 0 ? recentCustomers.map((cust) => (
              <div
                key={cust.id}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-k-card/50 border border-k-border/50 hover:border-k-border transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-k-silver/20 to-k-border flex items-center justify-center">
                    <span className="text-xs font-bold text-k-silver">{(cust.name || 'C').charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{cust.name}</p>
                    <p className="text-xs text-k-silver-dim">{cust.company || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-k-silver-dim">
                  <Clock size={12} />
                  {new Date(cust.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            )) : <p className="text-sm text-k-silver-dim">No recent customers.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
