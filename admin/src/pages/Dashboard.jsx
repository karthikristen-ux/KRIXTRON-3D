import { MOCK_STATS, MOCK_INVOICES, MOCK_CUSTOMERS } from '../data/mockData'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { IndianRupee, FileText, Users, Package, TrendingUp, Clock } from 'lucide-react'

const STAT_CARDS = [
  {
    label: 'Total Revenue',
    value: `₹${MOCK_STATS.totalRevenue.toLocaleString('en-IN')}`,
    icon: IndianRupee,
    change: '+12.5%',
    positive: true,
  },
  {
    label: 'Pending Invoices',
    value: MOCK_STATS.pendingInvoices,
    icon: FileText,
    change: '2 unpaid',
    positive: false,
  },
  {
    label: 'Total Customers',
    value: MOCK_STATS.totalCustomers,
    icon: Users,
    change: '+3 this month',
    positive: true,
  },
  {
    label: 'Active Products',
    value: MOCK_STATS.totalProducts,
    icon: Package,
    change: '5 active',
    positive: true,
  },
]

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
              <p className="text-xs text-k-silver-dim mt-0.5">Last 6 months</p>
            </div>
            <TrendingUp size={18} className="text-k-silver-dim" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_STATS.monthlyRevenue} barSize={32}>
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
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_STATS.invoicesByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {MOCK_STATS.invoicesByStatus.map((entry, index) => (
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
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center gap-5 mt-2">
            {MOCK_STATS.invoicesByStatus.map((item) => (
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
            {MOCK_INVOICES.slice(0, 4).map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-k-card/50 border border-k-border/50 hover:border-k-border transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-k-border/50 flex items-center justify-center">
                    <FileText size={16} className="text-k-silver-dim" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{inv.invoiceNo}</p>
                    <p className="text-xs text-k-silver-dim">{inv.customer.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">₹{inv.totalAmount.toLocaleString('en-IN')}</p>
                  <span className={`text-[10px] uppercase tracking-wider font-medium ${
                    inv.status === 'PAID' ? 'text-emerald-400' :
                    inv.status === 'PENDING' ? 'text-amber-400' :
                    'text-red-400'
                  }`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent customers */}
        <div className="bg-k-dark border border-k-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Customers</h3>
          <div className="space-y-3">
            {MOCK_CUSTOMERS.slice(0, 4).map((cust) => (
              <div
                key={cust.id}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-k-card/50 border border-k-border/50 hover:border-k-border transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-k-silver/20 to-k-border flex items-center justify-center">
                    <span className="text-xs font-bold text-k-silver">{cust.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{cust.name}</p>
                    <p className="text-xs text-k-silver-dim">{cust.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-k-silver-dim">
                  <Clock size={12} />
                  {new Date(cust.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
