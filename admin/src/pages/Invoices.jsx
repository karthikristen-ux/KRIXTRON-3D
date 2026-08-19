import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Search, Plus, FileDown, Upload, Edit3, Trash2, Download, X, Filter } from 'lucide-react'

const STATUS_COLORS = {
  PAID: 'text-emerald-400 bg-emerald-400/[0.08]',
  PENDING: 'text-amber-400 bg-amber-400/[0.08]',
  OVERDUE: 'text-red-400 bg-red-400/[0.08]',
  CANCELLED: 'text-k-silver-dim bg-k-border/50',
}

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    invoiceNo: '', customerName: '', items: [{ description: '', quantity: 1, unitPrice: 0 }], status: 'PENDING', notes: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (!error && data) {
      setInvoices(data)
    }
  }

  const filtered = invoices.filter(inv => {
    const matchSearch = (inv.invoice_no || '').toLowerCase().includes(search.toLowerCase()) ||
      (inv.customer_name || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || inv.status === filterStatus
    return matchSearch && matchStatus
  })

  const openNew = () => {
    setEditing(null)
    setForm({
      invoiceNo: `KRX-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      customerName: '', 
      items: [{ description: '', quantity: 1, unitPrice: 0 }], 
      status: 'PENDING', 
      notes: ''
    })
    setModalOpen(true)
  }

  const openEdit = (invoice) => {
    setEditing(invoice)
    setForm({ 
      invoiceNo: invoice.invoice_no || '',
      customerName: invoice.customer_name || '', 
      items: invoice.items || [{ description: '', quantity: 1, unitPrice: 0 }], 
      status: invoice.status || 'PENDING', 
      notes: invoice.notes || '' 
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

  const subtotal = form.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  const total = subtotal * 1.18

  const handleSave = async () => {
    if (!form.customerName || !form.invoiceNo) return
    setLoading(true)

    const payload = {
      invoice_no: form.invoiceNo,
      customer_name: form.customerName,
      items: form.items,
      status: form.status,
      notes: form.notes,
      subtotal: subtotal,
      tax: subtotal * 0.18,
      total_amount: total
    }

    if (editing) {
      const { error } = await supabase.from('invoices').update(payload).eq('id', editing.id)
      if (!error) fetchInvoices()
    } else {
      const { error } = await supabase.from('invoices').insert([payload])
      if (!error) fetchInvoices()
    }

    setLoading(false)
    setModalOpen(false)
  }

  const handleExport = () => {
    alert('Excel export would be triggered here (requires SheetJS integration)')
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('invoices').delete().eq('id', id)
    if (!error) {
      setInvoices(prev => prev.filter(inv => inv.id !== id))
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-wide">Invoices</h1>
          <p className="text-sm text-k-silver-dim mt-1">{invoices.length} total invoices</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 text-sm text-k-silver border border-k-border rounded-xl hover:border-k-silver/40 hover:text-white transition-all">
            <FileDown size={14} /> Export
          </button>
          <label className="flex items-center gap-2 px-4 py-2.5 text-sm text-k-silver border border-k-border rounded-xl hover:border-k-silver/40 hover:text-white transition-all cursor-pointer">
            <Upload size={14} /> Import
            <input type="file" accept=".xlsx,.xls,.csv" className="hidden" />
          </label>
          <button onClick={openNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-white to-k-silver text-k-black text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-white/10 transition-all">
            <Plus size={16} /> New Invoice
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute top-3.5 left-4 text-k-silver-dim" />
          <input
            type="text"
            placeholder="Search by invoice # or customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-k-dark border border-k-border rounded-xl text-sm text-white placeholder:text-k-silver-dim/40 focus:outline-none focus:border-k-silver/40 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-k-silver-dim" />
          {['', 'PAID', 'PENDING', 'OVERDUE'].map(status => (
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
                <th className="text-left px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Invoice #</th>
                <th className="text-left px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Customer</th>
                <th className="text-right px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Amount</th>
                <th className="text-center px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Status</th>
                <th className="text-left px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Date</th>
                <th className="text-right px-6 py-4 text-[11px] text-k-silver-dim uppercase tracking-wider font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-b border-k-border/50 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-white font-display tracking-wide">{inv.invoice_no}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-white">{inv.customer_name}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-white">₹{(inv.total_amount || 0).toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-semibold ${STATUS_COLORS[inv.status] || STATUS_COLORS.PENDING}`}>
                      {inv.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-k-silver-dim">
                    {new Date(inv.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-k-silver-dim hover:text-white hover:bg-white/[0.06] transition-all" title="Download PDF">
                        <Download size={14} />
                      </button>
                      <button onClick={() => openEdit(inv)} className="w-8 h-8 rounded-lg flex items-center justify-center text-k-silver-dim hover:text-white hover:bg-white/[0.06] transition-all" title="Edit">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(inv.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-k-silver-dim hover:text-red-400 hover:bg-red-400/[0.06] transition-all" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-k-silver-dim text-sm">
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-k-dark border border-k-border rounded-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-k-silver-dim hover:text-white hover:bg-white/[0.06]">
              <X size={16} />
            </button>
            <h2 className="font-display text-lg font-bold text-white mb-6">
              {editing ? 'Edit Invoice' : 'New Invoice'}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-1.5">Invoice #</label>
                  <input value={form.invoiceNo} onChange={e => setForm({...form, invoiceNo: e.target.value})} className="w-full px-4 py-2.5 bg-k-black border border-k-border rounded-lg text-sm text-white focus:outline-none focus:border-k-silver/40" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-1.5">Customer Name *</label>
                  <input value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} className="w-full px-4 py-2.5 bg-k-black border border-k-border rounded-lg text-sm text-white focus:outline-none focus:border-k-silver/40" placeholder="e.g. John Doe" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-4 py-2.5 bg-k-black border border-k-border rounded-lg text-sm text-white focus:outline-none focus:border-k-silver/40 appearance-none">
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="OVERDUE">OVERDUE</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
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
                <div className="flex justify-between text-sm">
                  <span className="text-k-silver-dim">Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-k-silver-dim">GST (18%)</span>
                  <span className="text-white">₹{(subtotal * 0.18).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-k-border pt-2">
                  <span className="text-white">Total</span>
                  <span className="text-white font-display">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} className="w-full px-4 py-2.5 bg-k-black border border-k-border rounded-lg text-sm text-white focus:outline-none focus:border-k-silver/40 resize-none" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-k-silver-dim border border-k-border rounded-xl hover:text-white hover:border-k-silver/40 transition-all">
                Cancel
              </button>
              <button disabled={loading} onClick={handleSave} className="px-5 py-2.5 text-sm bg-gradient-to-r from-white to-k-silver text-k-black font-semibold rounded-xl hover:shadow-lg hover:shadow-white/10 transition-all disabled:opacity-50">
                {editing ? 'Save Invoice' : 'Create Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
