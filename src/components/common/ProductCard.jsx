import React from 'react'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { Link } from 'react-router-dom'

const BADGE_COLORS = {
  'Best Seller': 'bg-amber-500',
  'New': 'bg-blue-500',
  'Popular': 'bg-purple-500',
  'Top Rated': 'bg-emerald-600',
  'Sale': 'bg-red-500',
}

const ProductCard = ({ products }) => {
  const { addToCart } = useCart()
  const { showToast } = useToast()

  if (!products?.length) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg">No products found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => {
        const imgSrc = product.images?.[0]?.url || product.image || '/placeholder.png'
        const id = product._id || product.id

        return (
          <div key={id} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300 group flex flex-col">
            {/* Image */}
            <Link to={`/products/${id}`} className="relative h-60 block bg-gray-50 overflow-hidden">
              <img src={imgSrc} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {product.badge && (
                <span className={`absolute top-3 left-3 ${BADGE_COLORS[product.badge] || 'bg-gray-500'} text-white text-[11px] font-semibold px-2.5 py-1 rounded-full`}>
                  {product.badge}
                </span>
              )}
              {product.mrp && product.mrp > product.price && (
                <span className="absolute top-3 right-3 bg-red-500 text-white text-[11px] font-semibold px-2 py-1 rounded-full">
                  {Math.round((1 - product.price / product.mrp) * 100)}% OFF
                </span>
              )}
            </Link>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
              <Link to={`/products/${id}`}>
                <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1 line-clamp-2 hover:text-emerald-700 transition-colors">{product.name}</h3>
              </Link>
              <p className="text-xs text-gray-400 mb-3 line-clamp-2 flex-1">{product.description}</p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                <span className="text-amber-400 text-xs">{'★'.repeat(Math.round(product.rating || 4))}</span>
                <span className="text-gray-400 text-xs">({product.reviewCount || Math.floor(Math.random() * 100) + 30})</span>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between gap-2 mt-auto">
                <div>
                  <span className="text-lg font-bold text-emerald-700">₹{product.price}</span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="ml-1.5 text-xs text-gray-400 line-through">₹{product.mrp}</span>
                  )}
                </div>
                <button
                  onClick={() => { addToCart(product); showToast(`${product.name} added!`, 'success') }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-full transition-colors whitespace-nowrap"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProductCard
