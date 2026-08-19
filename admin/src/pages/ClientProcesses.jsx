import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Search, Edit3, Trash2, X, Filter } from 'lucide-react'

const STATUS_COLORS = {
  new: 'text-emerald-400 bg-emerald-400/[0.08]',
  'in-progress': 'text-blue-400 bg-blue-400/[0.08]',
  completed: 'text-k-silver bg-white/[0.08]',
  cancelled: 'text-red-400 bg-red-400/[0.08]',
}

export default function ClientProcesses() {
  const [processes, setProcesses] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProcess, setSelectedProcess] = useState(null)
  
  useEffect(() => {
    fetchProcesses()
  }, [])

  const fetchProcesses = async () => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (!error && data) {
      setProcesses(data)
    }
  }

  const filtered = processes.filter(p => {
    const matchSearch = (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.tracking_id || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || p.status === filterStatus
    return matchSearch && matchStatus
  })

  const handleDelete = async (id) => {
    await supabase.from('contact_submissions').delete().eq('id', id)
    fetchProcesses()
    setModalOpen(false)
  }

  const updateStatus = async (id, newStatus) => {
    await supabase.from('contact_submissions').update({ status: newStatus }).eq('id', id)
    fetchProcesses()
    if (selectedProcess && selectedProcess.id === id) {
      setSelectedProcess({ ...selectedProcess, status: newStatus })
    }
  }

  const openProcess = (p) => {
    setSelectedProcess(p)
    setModalOpen(true)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-wide">Client Processes</h1>
          <p className="text-sm text-k-silver-dim mt-1">{processes.length} total processes tracked</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute top-3.5 left-4 text-k-silver-dim" />
          <input
            type="text"
            placeholder="Search by ID, name, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-k-dark border border-k-border rounded-xl text-sm text-white placeholder:text-k-silver-dim/40 focus:outline-none focus:border-k-silver/40 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-k-silver-dim" />
          {['', 'new', 'in-progress', 'completed', 'cancelled'].map(status => (
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
                <th className="text-left px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Tracking ID</th>
                <th className="text-left px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Date</th>
                <th className="text-left px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Client</th>
                <th className="text-center px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Status</th>
                <th className="text-right px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-k-border/50 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => openProcess(p)}>
                  <td className="px-6 py-4 text-sm text-white font-mono">{p.tracking_id || p.id.split('-')[0]}</td>
                  <td className="px-6 py-4 text-sm text-k-silver-dim">
                    {new Date(p.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white font-medium">{p.name}</div>
                    <div className="text-xs text-k-silver-dim mt-0.5">{p.email}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-semibold ${STATUS_COLORS[p.status] || STATUS_COLORS.new}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id) }} className="w-8 h-8 rounded-lg flex items-center justify-center text-k-silver-dim hover:text-red-400 hover:bg-red-400/[0.06] transition-all" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-k-silver-dim text-sm">
                    No processes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Detail Modal */}
      {modalOpen && selectedProcess && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-k-dark border border-k-border rounded-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-k-silver-dim hover:text-white hover:bg-white/[0.06]">
              <X size={16} />
            </button>
            <h2 className="font-display text-lg font-bold text-white mb-2">Process Details</h2>
            <p className="font-mono text-sm text-k-silver-dim mb-6">ID: {selectedProcess.tracking_id || selectedProcess.id}</p>

            <div className="space-y-6">
              {/* Update Status */}
              <div className="bg-k-black border border-k-border rounded-xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-k-silver-dim uppercase tracking-wider mb-1">Current Status</p>
                  <div className="flex gap-2 mt-3">
                    {['new', 'in-progress', 'completed', 'cancelled'].map(st => (
                      <button
                        key={st}
                        onClick={() => updateStatus(selectedProcess.id, st)}
                        className={`px-3 py-1.5 text-[10px] rounded-lg border transition-all uppercase font-semibold ${
                          selectedProcess.status === st
                            ? 'border-white text-k-black bg-white'
                            : 'border-k-border text-k-silver-dim hover:text-white hover:border-k-silver/40'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-k-black border border-k-border rounded-xl p-5">
                <div>
                  <p className="text-xs text-k-silver-dim uppercase tracking-wider mb-1">Name</p>
                  <p className="text-sm text-white font-medium">{selectedProcess.name}</p>
                </div>
                <div>
                  <p className="text-xs text-k-silver-dim uppercase tracking-wider mb-1">Date Submitted</p>
                  <p className="text-sm text-white">{new Date(selectedProcess.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-k-silver-dim uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm text-white">{selectedProcess.email}</p>
                </div>
                <div>
                  <p className="text-xs text-k-silver-dim uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-sm text-white">{selectedProcess.phone || 'N/A'}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-k-silver-dim uppercase tracking-wider mb-2">Client Message / Project Details</p>
                <div className="bg-k-black border border-k-border rounded-xl p-5 text-sm text-white leading-relaxed whitespace-pre-wrap">
                  {selectedProcess.message}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-k-border">
              <button onClick={() => handleDelete(selectedProcess.id)} className="px-4 py-2 text-sm text-red-400 hover:text-red-300 font-medium transition-colors">
                Delete Process
              </button>
              <a href={`mailto:${selectedProcess.email}`} className="px-5 py-2.5 text-sm bg-gradient-to-r from-white to-k-silver text-k-black font-semibold rounded-xl hover:shadow-lg hover:shadow-white/10 transition-all">
                Contact Client
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
