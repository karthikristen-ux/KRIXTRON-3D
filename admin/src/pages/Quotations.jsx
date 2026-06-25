import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Search, Plus, Edit3, Trash2, ArrowRightLeft, Download, X, Filter } from 'lucide-react'

const STATUS_COLORS = {
  new: 'text-emerald-400 bg-emerald-400/[0.08]',
  read: 'text-k-silver-dim bg-k-border/50',
}

export default function Quotations() {
  const [quotations, setQuotations] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  
  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (!error && data) {
      setQuotations(data)
    }
  }

  const filtered = quotations.filter(qt => {
    const matchSearch = (qt.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (qt.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (qt.phone || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || qt.status === filterStatus
    return matchSearch && matchStatus
  })

  const handleDelete = async (id) => {
    await supabase.from('contact_submissions').delete().eq('id', id)
    fetchSubmissions()
  }

  const markAsRead = async (id) => {
    await supabase.from('contact_submissions').update({ status: 'read' }).eq('id', id)
    fetchSubmissions()
    setModalOpen(false)
  }

  const openMessage = (msg) => {
    setSelectedMessage(msg)
    setModalOpen(true)
    if (msg.status === 'new') {
      markAsRead(msg.id)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-wide">Customer Inquiries</h1>
          <p className="text-sm text-k-silver-dim mt-1">{quotations.length} total messages</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute top-3.5 left-4 text-k-silver-dim" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-k-dark border border-k-border rounded-xl text-sm text-white placeholder:text-k-silver-dim/40 focus:outline-none focus:border-k-silver/40 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-k-silver-dim" />
          {['', 'new', 'read'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all uppercase ${
                filterStatus === status
                  ? 'border-k-silver/40 text-white bg-white/[0.05]'
                  : 'border-k-border text-k-silver-dim hover:text-white'
              }`}
            >
              {status || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-k-dark border border-k-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-k-border">
                <th className="text-left px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Date</th>
                <th className="text-left px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Name</th>
                <th className="text-left px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Contact</th>
                <th className="text-center px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Status</th>
                <th className="text-right px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((qt) => (
                <tr key={qt.id} className="border-b border-k-border/50 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => openMessage(qt)}>
                  <td className="px-6 py-4 text-sm text-k-silver-dim">
                    {new Date(qt.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-medium">{qt.name}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">{qt.email}</div>
                    <div className="text-xs text-k-silver-dim mt-0.5">{qt.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-semibold ${STATUS_COLORS[qt.status] || STATUS_COLORS.new}`}>
                      {qt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(qt.id) }} className="w-8 h-8 rounded-lg flex items-center justify-center text-k-silver-dim hover:text-red-400 hover:bg-red-400/[0.06] transition-all" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-k-silver-dim text-sm">
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      {modalOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-k-dark border border-k-border rounded-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-k-silver-dim hover:text-white hover:bg-white/[0.06]">
              <X size={16} />
            </button>
            <h2 className="font-display text-lg font-bold text-white mb-6">Inquiry Details</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-k-black border border-k-border rounded-xl p-5">
                <div>
                  <p className="text-xs text-k-silver-dim uppercase tracking-wider mb-1">Name</p>
                  <p className="text-sm text-white font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-xs text-k-silver-dim uppercase tracking-wider mb-1">Date</p>
                  <p className="text-sm text-white">{new Date(selectedMessage.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-k-silver-dim uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm text-white">{selectedMessage.email}</p>
                </div>
                <div>
                  <p className="text-xs text-k-silver-dim uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-sm text-white">{selectedMessage.phone || 'N/A'}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-k-silver-dim uppercase tracking-wider mb-2">Message</p>
                <div className="bg-k-black border border-k-border rounded-xl p-5 text-sm text-white leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <a href={`mailto:${selectedMessage.email}`} className="px-5 py-2.5 text-sm bg-gradient-to-r from-white to-k-silver text-k-black font-semibold rounded-xl hover:shadow-lg hover:shadow-white/10 transition-all">
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

