import { useState } from 'react'
import { MOCK_PRODUCTS } from '../data/mockData'
import { Plus, Edit3, Trash2, X, Package, ToggleLeft, ToggleRight } from 'lucide-react'

export default function Products() {
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', material: '', price: '' })

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', description: '', material: '', price: '' })
    setModalOpen(true)
  }

  const openEdit = (product) => {
    setEditing(product)
    setForm({ name: product.name, description: product.description || '', material: product.material || '', price: product.price || '' })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.name) return
    if (editing) {
      setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...form, price: Number(form.price) } : p))
    } else {
      setProducts(prev => [...prev, { ...form, id: String(Date.now()), price: Number(form.price), isActive: true, createdAt: new Date().toISOString() }])
    }
    setModalOpen(false)
  }

  const toggleActive = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p))
  }

  const handleDelete = (id) => setProducts(prev => prev.filter(p => p.id !== id))

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-wide">Products</h1>
          <p className="text-sm text-k-silver-dim mt-1">{products.length} products · {products.filter(p => p.isActive).length} active</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-white to-k-silver text-k-black text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-white/10 transition-all">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => (
          <div
            key={product.id}
            className={`bg-k-dark border rounded-xl overflow-hidden transition-all hover:border-k-silver/20 ${
              product.isActive ? 'border-k-border' : 'border-k-border/50 opacity-60'
            }`}
          >
            {/* Image placeholder */}
            <div className="h-40 bg-k-card flex items-center justify-center relative">
              <Package size={40} className="text-k-border" />
              {/* Active badge */}
              <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold ${
                product.isActive ? 'text-emerald-400 bg-emerald-400/[0.1]' : 'text-k-silver-dim bg-k-border/50'
              }`}>
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Info */}
            <div className="p-5">
              <h3 className="font-display text-sm font-semibold text-white mb-1">{product.name}</h3>
              <p className="text-xs text-k-silver-dim mb-3 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-k-silver px-2 py-0.5 rounded bg-k-border/50">{product.material}</span>
                <span className="text-sm font-bold text-white font-display">₹{product.price?.toLocaleString('en-IN')}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-k-border/50">
                <button
                  onClick={() => toggleActive(product.id)}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${
                    product.isActive ? 'text-emerald-400 hover:text-emerald-300' : 'text-k-silver-dim hover:text-white'
                  }`}
                >
                  {product.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  {product.isActive ? 'Active' : 'Inactive'}
                </button>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(product)} className="w-7 h-7 rounded-lg flex items-center justify-center text-k-silver-dim hover:text-white hover:bg-white/[0.06] transition-all">
                    <Edit3 size={13} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-k-silver-dim hover:text-red-400 hover:bg-red-400/[0.06] transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-k-dark border border-k-border rounded-2xl w-full max-w-lg p-8 relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-k-silver-dim hover:text-white hover:bg-white/[0.06]">
              <X size={16} />
            </button>
            <h2 className="font-display text-lg font-bold text-white mb-6">
              {editing ? 'Edit Product' : 'Add Product'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-1.5">Product Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 bg-k-black border border-k-border rounded-lg text-sm text-white focus:outline-none focus:border-k-silver/40" />
              </div>
              <div>
                <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-4 py-2.5 bg-k-black border border-k-border rounded-lg text-sm text-white focus:outline-none focus:border-k-silver/40 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-1.5">Material</label>
                  <input value={form.material} onChange={e => setForm({...form, material: e.target.value})} className="w-full px-4 py-2.5 bg-k-black border border-k-border rounded-lg text-sm text-white focus:outline-none focus:border-k-silver/40" />
                </div>
                <div>
                  <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-1.5">Price (₹)</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full px-4 py-2.5 bg-k-black border border-k-border rounded-lg text-sm text-white focus:outline-none focus:border-k-silver/40" />
                </div>
              </div>
              {/* GLB upload placeholder */}
              <div>
                <label className="block text-xs text-k-silver-dim uppercase tracking-wider mb-1.5">3D Model (.glb)</label>
                <label className="flex items-center gap-3 px-4 py-3 bg-k-black border border-dashed border-k-border rounded-lg cursor-pointer hover:border-k-silver-dim transition-colors">
                  <Package size={16} className="text-k-silver-dim" />
                  <span className="text-sm text-k-silver-dim">Click to upload .glb model file</span>
                  <input type="file" accept=".glb,.gltf" className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-k-silver-dim border border-k-border rounded-xl hover:text-white hover:border-k-silver/40 transition-all">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2.5 text-sm bg-gradient-to-r from-white to-k-silver text-k-black font-semibold rounded-xl hover:shadow-lg hover:shadow-white/10 transition-all">
                {editing ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
