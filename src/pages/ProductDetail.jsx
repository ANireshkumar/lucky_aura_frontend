import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productAPI } from '../services/api'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const { addToCart } = useCart()
  const { showToast } = useToast()

  useEffect(() => {
    productAPI.getOne(id)
      .then(res => setProduct(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-32"><div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!product) return <div className="text-center py-32"><p className="text-gray-500">Product not found.</p><Link to="/products" className="text-emerald-600 hover:underline mt-4 inline-block">← Back to products</Link></div>

  const images = product.images?.length ? product.images : [{ url: '/placeholder.png' }]

  return (
    <div className="min-h-screen bg-white animate-fade-up">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-700 mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 mb-4">
              <img src={images[activeImg]?.url} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-emerald-600' : 'border-gray-100 hover:border-emerald-300'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.badge && <span className="inline-block self-start bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">{product.badge}</span>}
            <h1 className="font-display text-3xl text-gray-900 mb-3">{product.name}</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-amber-400">{'★'.repeat(Math.round(product.rating || 4))}{'☆'.repeat(5 - Math.round(product.rating || 4))}</span>
              <span className="text-sm text-gray-400">{product.rating?.toFixed(1)} ({product.reviewCount || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-4xl font-bold text-emerald-700">₹{product.price}</span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{product.mrp}</span>
                  <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-0.5 rounded-full">{Math.round((1 - product.price / product.mrp) * 100)}% OFF</span>
                </>
              )}
            </div>

            <button
              onClick={() => { addToCart(product); showToast(`${product.name} added to cart!`) }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-full text-lg transition-colors shadow-md shadow-emerald-200 mb-4"
            >
              Add to Cart
            </button>
            <Link to="/cart" className="block text-center text-emerald-600 font-medium text-sm hover:underline mb-8">View Cart →</Link>

            {/* Details */}
            {product.ingredients?.length > 0 && (
              <div className="border-t pt-6 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Key Ingredients</h4>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing, i) => <span key={i} className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full border border-green-100">{ing}</span>)}
                </div>
              </div>
            )}
            {product.benefits?.length > 0 && (
              <div className="border-t pt-6 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Benefits</h4>
                <ul className="space-y-1.5">
                  {product.benefits.map((b, i) => <li key={i} className="flex items-center gap-2 text-sm text-gray-600"><span className="text-emerald-500">✓</span>{b}</li>)}
                </ul>
              </div>
            )}
            {product.howToUse && (
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-800 mb-2">How to Use</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{product.howToUse}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
