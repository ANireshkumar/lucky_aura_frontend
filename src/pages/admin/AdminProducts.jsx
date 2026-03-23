import React, { useState, useEffect, useRef, useCallback } from 'react'
import { productAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const CATEGORIES = ['Bodywash', 'FaceWash', 'Facegel', 'Haircare', 'Lipcare', 'Serum', 'SkinCream', 'Soap', 'Sunscreen', 'Scrub', 'Other']
const BADGES = ['', 'Best Seller', 'New', 'Popular', 'Top Rated', 'Sale']

const emptyForm = {
  name: '', description: '', price: '', mrp: '', category: 'FaceWash',
  badge: '', stock: '100', isFeatured: false, isActive: true,
  ingredients: '', benefits: '', howToUse: '',
}

// Separate stable input component to prevent re-render focus loss
const FormInput = ({ label, name, value, onChange, type = 'text', placeholder = '', required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      defaultValue={value}
      onBlur={onChange}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white"
    />
  </div>
)

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const fileRef = useRef()
  const { showToast } = useToast()

  // Use refs for form values to avoid re-render on every keystroke
  const formRef = useRef({ ...emptyForm })
  const [formKey, setFormKey] = useState(0) // used to reset form

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await productAPI.adminGetAll({ page, limit: 12, search })
      setProducts(res.data.products)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch { showToast('Failed to load products', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [page, search])

  const openCreate = () => {
    setEditing(null)
    formRef.current = { ...emptyForm }
    setImageFiles([])
    setImagePreviews([])
    setFormKey(k => k + 1)
    setModalOpen(true)
  }

  const openEdit = (product) => {
    setEditing(product)
    formRef.current = {
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      mrp: product.mrp || '',
      category: product.category || 'FaceWash',
      badge: product.badge || '',
      stock: product.stock || '100',
      isFeatured: product.isFeatured || false,
      isActive: product.isActive !== undefined ? product.isActive : true,
      ingredients: (product.ingredients || []).join(', '),
      benefits: (product.benefits || []).join(', '),
      howToUse: product.howToUse || '',
    }
    setImageFiles([])
    setImagePreviews(product.images?.map(i => i.url) || [])
    setFormKey(k => k + 1)
    setModalOpen(true)
  }

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target
    formRef.current[name] = type === 'checkbox' ? checked : value
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
      const form = formRef.current
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('description', form.description)
      fd.append('price', form.price)
      fd.append('mrp', form.mrp)
      fd.append('category', form.category)
      fd.append('badge', form.badge)
      fd.append('stock', form.stock)
      fd.append('howToUse', form.howToUse)
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

  const inputCls = "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white"

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
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search products…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
        />
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
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-xl border text-sm font-medium disabled:opacity-40 hover:bg-gray-50">← Prev</button>
          <span className="text-sm text-gray-500">Page {page} of {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-xl border text-sm font-medium disabled:opacity-40 hover:bg-gray-50">Next →</button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-6 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
              <h2 className="font-display text-2xl text-gray-900">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-lg">✕</button>
            </div>

            <form key={formKey} onSubmit={handleSave} className="px-8 py-6 space-y-5">

              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name <span className="text-red-500">*</span></label>
                  <input required type="text" name="name" defaultValue={formRef.current.name} onChange={handleFieldChange}
                    placeholder="e.g. Kumkumadi Face Wash" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                  <select required name="category" defaultValue={formRef.current.category} onChange={handleFieldChange} className={inputCls}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                <textarea required name="description" rows={4} defaultValue={formRef.current.description} onChange={handleFieldChange}
                  placeholder="Describe the product, its benefits and usage…"
                  className={inputCls + ' resize-none'} />
              </div>

              {/* Row 2 - Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) <span className="text-red-500">*</span></label>
                  <input required type="number" min="0" name="price" defaultValue={formRef.current.price} onChange={handleFieldChange} placeholder="299" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">MRP (₹) <span className="text-gray-400 text-xs">optional</span></label>
                  <input type="number" min="0" name="mrp" defaultValue={formRef.current.mrp} onChange={handleFieldChange} placeholder="399" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock</label>
                  <input type="number" min="0" name="stock" defaultValue={formRef.current.stock} onChange={handleFieldChange} placeholder="100" className={inputCls} />
                </div>
              </div>

              {/* Row 3 - Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Badge</label>
                  <select name="badge" defaultValue={formRef.current.badge} onChange={handleFieldChange} className={inputCls}>
                    {BADGES.map(b => <option key={b} value={b}>{b || 'None'}</option>)}
                  </select>
                </div>
                <div className="flex items-end gap-6 pb-1">
                  {[['isFeatured', 'Featured on Homepage'], ['isActive', 'Active / Visible']].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name={key} defaultChecked={formRef.current[key]} onChange={handleFieldChange}
                        className="w-4 h-4 accent-emerald-600 rounded" />
                      <span className="text-sm text-gray-600">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ingredients & Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ingredients <span className="text-gray-400 text-xs">comma separated</span></label>
                  <input type="text" name="ingredients" defaultValue={formRef.current.ingredients} onChange={handleFieldChange}
                    placeholder="Aloe Vera, Neem, Turmeric" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Benefits <span className="text-gray-400 text-xs">comma separated</span></label>
                  <input type="text" name="benefits" defaultValue={formRef.current.benefits} onChange={handleFieldChange}
                    placeholder="Brightening, Moisturizing" className={inputCls} />
                </div>
              </div>

              {/* How to Use */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">How to Use</label>
                <textarea name="howToUse" rows={3} defaultValue={formRef.current.howToUse} onChange={handleFieldChange}
                  placeholder="Apply a small amount on cleansed face and massage gently…"
                  className={inputCls + ' resize-none'} />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images <span className="text-gray-400 text-xs">(up to 5 images)</span>
                </label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative">
                      <img src={src} alt="" className="w-24 h-24 object-cover rounded-xl border border-gray-100" />
                    </div>
                  ))}
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-400 flex flex-col items-center justify-center text-gray-400 hover:text-emerald-600 transition-colors gap-1">
                    <span className="text-2xl leading-none">+</span>
                    <span className="text-xs">Add Image</span>
                  </button>
                </div>
                <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                {editing && imagePreviews.length > 0 && (
                  <p className="text-xs text-gray-400">Upload new images to replace existing ones.</p>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold px-8 py-2.5 rounded-xl text-sm transition-colors">
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