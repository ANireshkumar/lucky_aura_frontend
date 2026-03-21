import React, { useState, useEffect, useRef } from 'react'
import { productAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const CATEGORIES = ['Bodywash', 'FaceWash', 'Facegel', 'Haircare', 'Lipcare', 'Serum', 'SkinCream', 'Soap', 'Sunscreen', 'Scrub', 'Other']
const BADGES = ['', 'Best Seller', 'New', 'Popular', 'Top Rated', 'Sale']

const emptyForm = {
  name: '', description: '', price: '', mrp: '', category: 'FaceWash',
  badge: '', stock: '100', isFeatured: false, isActive: true,
  ingredients: '', benefits: '', howToUse: '',
}

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null) // product being edited
  const [form, setForm] = useState(emptyForm)
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()
  const { showToast } = useToast()

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await productAPI.adminGetAll({ page, limit: 12, search })
      setProducts(res.data.products)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch (err) { showToast('Failed to load products', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [page, search])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setImageFiles([])
    setImagePreviews([])
    setModalOpen(true)
  }

  const openEdit = (product) => {
    setEditing(product)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      mrp: product.mrp || '',
      category: product.category,
      badge: product.badge || '',
      stock: product.stock,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      ingredients: (product.ingredients || []).join(', '),
      benefits: (product.benefits || []).join(', '),
      howToUse: product.howToUse || '',
    })
    setImageFiles([])
    setImagePreviews(product.images?.map(i => i.url) || [])
    setModalOpen(true)
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles(files)
    setImagePreviews(files.map(f => URL.createObjectURL(f)))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      const fields = ['name', 'description', 'price', 'mrp', 'category', 'badge', 'stock', 'howToUse']
      fields.forEach(k => fd.append(k, form[k]))
      fd.append('isFeatured', form.isFeatured)
      fd.append('isActive', form.isActive)
      fd.append('ingredients', JSON.stringify(form.ingredients.split(',').map(s => s.trim()).filter(Boolean)))
      fd.append('benefits', JSON.stringify(form.benefits.split(',').map(s => s.trim()).filter(Boolean)))
      imageFiles.forEach(f => fd.append('images', f))

      if (editing) {
        await productAPI.update(editing._id, fd)
        showToast('Product updated!')
      } else {
        await productAPI.create(fd)
        showToast('Product created!')
      }
      setModalOpen(false)
      fetchProducts()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save product', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await productAPI.delete(id)
      showToast('Product deleted')
      fetchProducts()
    } catch { showToast('Failed to delete product', 'error') }
  }

  const Field = ({ label, children }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  )

  const inputCls = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-gray-900">Products</h1>
          <p className="text-gray-400 text-sm mt-1">{total} total products</p>
        </div>
        <button onClick={openCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors">
          <span className="text-lg leading-none">+</span> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search products…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white" />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center"><div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No products found</td></tr>
              ) : products.map(p => (
                <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]?.url || '/placeholder.png'} alt={p.name} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100" />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate max-w-[180px]">{p.name}</p>
                        {p.badge && <span className="text-[11px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{p.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{p.category}</td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-emerald-700">₹{p.price}</span>
                    {p.mrp > p.price && <span className="ml-1.5 text-xs text-gray-400 line-through">₹{p.mrp}</span>}
                  </td>
                  <td className="px-5 py-4 text-gray-500">{p.stock}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                      {p.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="text-blue-500 hover:text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="text-red-400 hover:text-red-600 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-xl border text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors">← Prev</button>
          <span className="text-sm text-gray-500">Page {page} of {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-xl border text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors">Next →</button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
              <h2 className="font-display text-xl text-gray-900">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Product Name *">
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="e.g. Kumkumadi Face Wash" />
              </Field>
              <Field label="Category *">
                <select required value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className={inputCls}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Description *">
                  <textarea required rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={inputCls + ' resize-none'} placeholder="Describe the product…" />
                </Field>
              </div>
              <Field label="Price (₹) *">
                <input required type="number" min="0" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="MRP (₹) — optional">
                <input type="number" min="0" value={form.mrp} onChange={e => setForm(p => ({ ...p, mrp: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="Stock">
                <input type="number" min="0" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="Badge">
                <select value={form.badge} onChange={e => setForm(p => ({ ...p, badge: e.target.value }))} className={inputCls}>
                  {BADGES.map(b => <option key={b} value={b}>{b || 'None'}</option>)}
                </select>
              </Field>
              <Field label="Ingredients (comma-separated)">
                <input value={form.ingredients} onChange={e => setForm(p => ({ ...p, ingredients: e.target.value }))} className={inputCls} placeholder="Aloe vera, Neem, Turmeric" />
              </Field>
              <Field label="Benefits (comma-separated)">
                <input value={form.benefits} onChange={e => setForm(p => ({ ...p, benefits: e.target.value }))} className={inputCls} placeholder="Brightening, Anti-aging" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="How to Use">
                  <textarea rows={2} value={form.howToUse} onChange={e => setForm(p => ({ ...p, howToUse: e.target.value }))} className={inputCls + ' resize-none'} placeholder="Apply on face and rinse…" />
                </Field>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                {[['isFeatured', 'Featured'], ['isActive', 'Active / Visible']].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))}
                      className="w-4 h-4 accent-emerald-600 rounded" />
                    <span className="text-sm text-gray-600">{label}</span>
                  </label>
                ))}
              </div>

              {/* Images */}
              <div className="sm:col-span-2">
                <Field label="Product Images (up to 5)">
                  <div className="flex flex-wrap gap-3 mb-3">
                    {imagePreviews.map((src, i) => (
                      <img key={i} src={src} alt="" className="w-20 h-20 object-cover rounded-xl border border-gray-100" />
                    ))}
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-400 flex items-center justify-center text-gray-400 hover:text-emerald-600 text-2xl transition-colors">
                      +
                    </button>
                  </div>
                  <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                  <p className="text-xs text-gray-400">{editing ? 'Upload new images to replace existing ones.' : 'Required for new products.'}</p>
                </Field>
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
                  {saving ? 'Saving…' : editing ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts
