import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productAPI } from '../services/api'
import ProductCard from '../components/common/ProductCard'
import CategoryFilter from '../components/common/CategoryFilter'

const CATEGORIES = ['All', 'Bodywash', 'FaceWash', 'Facegel', 'Haircare', 'Lipcare', 'Serum', 'SkinCream', 'Soap', 'Sunscreen', 'Scrub', 'Other']

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const category = searchParams.get('category') || 'All'

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 16 }
      if (category !== 'All') params.category = category
      if (search) params.search = search
      const res = await productAPI.getAll(params)
      setProducts(res.data.products)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [category, page, search])

  useEffect(() => { fetchProducts() }, [fetchProducts])
  useEffect(() => { setPage(1) }, [category, search])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 to-white animate-fade-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-emerald-600 font-medium text-sm uppercase tracking-widest">Our Collection</span>
          <h1 className="font-display text-4xl text-gray-900 mt-2 mb-3">Organic Products</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Carefully crafted with natural ingredients for healthy skin and hair.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search products…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm bg-white shadow-sm"
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </form>

        <CategoryFilter
          categories={CATEGORIES}
          selected={category}
          onSelect={(cat) => setSearchParams(cat === 'All' ? {} : { category: cat })}
        />

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-400 mb-6 text-center">
            Showing {products.length} of {total} products
            {category !== 'All' && ` in ${category}`}
          </p>
        )}

        {loading
          ? <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>
          : <ProductCard products={products} />
        }

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-12">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-full border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
              ← Prev
            </button>
            <span className="text-sm text-gray-500">Page {page} of {pages}</span>
            <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-full border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
