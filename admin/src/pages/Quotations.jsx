import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Search, Plus, Edit3, Trash2, Download, X, Filter } from 'lucide-react'

const STATUS_COLORS = {
  ACCEPTED: 'text-emerald-400 bg-emerald-400/[0.08]',
  SENT: 'text-blue-400 bg-blue-400/[0.08]',
  DRAFT: 'text-k-silver-dim bg-k-border/50',
  REJECTED: 'text-red-400 bg-red-400/[0.08]',
}

export default function Quotations() {
  const [quotations, setQuotations] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    quoteNo: '', customerName: '', items: [{ description: '', quantity: 1, unitPrice: 0 }], status: 'DRAFT', validUntil: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchQuotations()
  }, [])

  const fetchQuotations = async () => {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (!error && data) {
      setQuotations(data)
    }
  }

  const filtered = quotations.filter(qt => {
    const matchSearch = (qt.quote_no || '').toLowerCase().includes(search.toLowerCase()) ||
      (qt.customer_name || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || qt.status === filterStatus
    return matchSearch && matchStatus
  })

  const openNew = () => {
    setEditing(null)
    setForm({
      quoteNo: `QT-${new Date().getFullYear()}-${String(quotations.length + 1).padStart(3, '0')}`,
      customerName: '', 
      items: [{ description: '', quantity: 1, unitPrice: 0 }], 
      status: 'DRAFT',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
    })
    setModalOpen(true)
  }

  const openEdit = (quote) => {
    setEditing(quote)
    setForm({ 
      quoteNo: quote.quote_no || '',
      customerName: quote.customer_name || '', 
      items: quote.items || [{ description: '', quantity: 1, unitPrice: 0 }], 
      status: quote.status || 'DRAFT',
      validUntil: quote.valid_until ? quote.valid_until.split('T')[0] : ''
    })
    setModalOpen(true)
  }

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { description: '', quantity: 1, unitPrice: 0 }] }))
  const removeItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }))
  const updateItem = (i, field, val) => {
    setForm(f => ({
      ...f,
      items: f.items.map((item, idx) => idx === i ? { ...item, [field]: val } : item)
    }))
  }

  const total = form.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)

  const handleSave = async () => {
    if (!form.customerName || !form.quoteNo) return
    setLoading(true)

    const payload = {
      quote_no: form.quoteNo,
      customer_name: form.customerName,
      items: form.items,
      status: form.status,
      total_amount: total,
      valid_until: form.validUntil ? new Date(form.validUntil).toISOString() : null
    }

    if (editing) {
      const { error } = await supabase.from('quotations').update(payload).eq('id', editing.id)
      if (!error) fetchQuotations()
    } else {
      const { error } = await supabase.from('quotations').insert([payload])
      if (!error) fetchQuotations()
    }

    setLoading(false)
    setModalOpen(false)
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('quotations').delete().eq('id', id)
    if (!error) {
      setQuotations(prev => prev.filter(qt => qt.id !== id))
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-wide">Quotations</h1>
          <p className="text-sm text-k-silver-dim mt-1">{quotations.length} total quotes</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-white to-k-silver text-k-black text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-white/10 transition-all">
          <Plus size={16} /> Create Quote
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute top-3.5 left-4 text-k-silver-dim" />
          <input
            type="text"
            placeholder="Search by quote # or customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-k-dark border border-k-border rounded-xl text-sm text-white placeholder:text-k-silver-dim/40 focus:outline-none focus:border-k-silver/40 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-k-silver-dim" />
          {['', 'DRAFT', 'SENT', 'ACCEPTED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                filterStatus === status
                  ? 'border-k-silver/40 text-white bg-white/[0.05]'
                  : 'border-k-border text-k-silver-dim hover:text-white hover:border-k-border'
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
                <th className="text-left px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Quote #</th>
                <th className="text-left px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Customer</th>
                <th className="text-right px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Total</th>
                <th className="text-center px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Status</th>
                <th className="text-left px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Date</th>
                <th className="text-left px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Valid Until</th>
                <th className="text-right px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((qt) => (
                <tr key={qt.id} className="border-b border-k-border/50 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-white font-display tracking-wide">{qt.quote_no}</td>
                  <td className="px-6 py-4 text-sm text-white">{qt.customer_name}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-white">₹{(qt.total_amount || 0).toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-semibold ${STATUS_COLORS[qt.status] || STATUS_COLORS.DRAFT}`}>
                      {qt.status || 'DRAFT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-k-silver-dim">
                    {new Date(qt.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-sm text-k-silver-dim">
                    {qt.valid_until ? new Date(qt.valid_until).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-k-silver-dim hover:text-white hover:bg-white/[0.06] transition-all" title="Download PDF">
                        <Download size={14} />
                      </button>
                      <button onClick={() => openEdit(qt)} className="w-8 h-8 rounded-lg flex items-center justify-center text-k-silver-dim hover:text-white hover:bg-white/[0.06] transition-all" title="Edit">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(qt.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-k-silver-dim hover:text-red-400 hover:bg-red-400/[0.06] transition-all" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-k-silver-dim text-sm">
                    No quotations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-k-dark border border-k-border rounded-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-k-silver-dim hover:text-white hover:bg-white/[0.06]">
              <X size={16} />
            </button>
            <h2 className="font-display text-lg font-bold text-white mb-6">
              {editing ? 'Edit Quotation' : 'New Quotation'}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-1.5">Quote #</label>
                  <input value={form.quoteNo} onChange={e => setForm({...form, quoteNo: e.target.value})} className="w-full px-4 py-2.5 bg-k-black border border-k-border rounded-lg text-sm text-white focus:outline-none focus:border-k-silver/40" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-1.5">Customer Name *</label>
                  <input value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} className="w-full px-4 py-2.5 bg-k-black border border-k-border rounded-lg text-sm text-white focus:outline-none focus:border-k-silver/40" placeholder="e.g. John Doe" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-4 py-2.5 bg-k-black border border-k-border rounded-lg text-sm text-white focus:outline-none focus:border-k-silver/40 appearance-none">
                    <option value="DRAFT">DRAFT</option>
                    <option value="SENT">SENT</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-1.5">Valid Until</label>
                  <input type="date" value={form.validUntil} onChange={e => setForm({...form, validUntil: e.target.value})} className="w-full px-4 py-2.5 bg-k-black border border-k-border rounded-lg text-sm text-white focus:outline-none focus:border-k-silver/40 [color-scheme:dark]" />
                </div>
              </div>

              {/* Line items */}
              <div>
                <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-3">Line Items</label>
                {form.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 mb-3">
                    <input
                      placeholder="Description"
                      value={item.description}
                      onChange={e => updateItem(i, 'description', e.target.value)}
                      className="col-span-5 px-3 py-2.5 bg-k-black border border-k-border rounded-lg text-sm text-white focus:outline-none focus:border-k-silver/40"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={e => updateItem(i, 'quantity', Number(e.target.value))}
                      className="col-span-2 px-3 py-2.5 bg-k-black border border-k-border rounded-lg text-sm text-white text-center focus:outline-none focus:border-k-silver/40"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.unitPrice}
                      onChange={e => updateItem(i, 'unitPrice', Number(e.target.value))}
                      className="col-span-3 px-3 py-2.5 bg-k-black border border-k-border rounded-lg text-sm text-white text-right focus:outline-none focus:border-k-silver/40"
                    />
                    <div className="col-span-2 flex items-center justify-between">
                      <span className="text-sm text-k-silver">₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}</span>
                      {form.items.length > 1 && (
                        <button onClick={() => removeItem(i)} className="text-k-silver-dim hover:text-red-400">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button onClick={addItem} className="text-xs text-k-silver-dim hover:text-white border border-dashed border-k-border rounded-lg px-4 py-2 hover:border-k-silver/40 transition-all">
                  + Add Item
                </button>
              </div>

              {/* Totals */}
              <div className="bg-k-card/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm font-bold pt-2">
                  <span className="text-white">Total Quoted</span>
                  <span className="text-white font-display">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-k-silver-dim border border-k-border rounded-xl hover:text-white hover:border-k-silver/40 transition-all">
                Cancel
              </button>
              <button disabled={loading} onClick={handleSave} className="px-5 py-2.5 text-sm bg-gradient-to-r from-white to-k-silver text-k-black font-semibold rounded-xl hover:shadow-lg hover:shadow-white/10 transition-all disabled:opacity-50">
                {editing ? 'Save Quotation' : 'Create Quotation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
