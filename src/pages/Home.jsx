import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productAPI } from '../services/api'
import ProductCard from '../components/common/ProductCard'

const CATEGORIES = [
  { name: 'Face Wash', icon: '🌿' },
  { name: 'Serums', icon: '✨' },
  { name: 'Hair Care', icon: '💆' },
  { name: 'Soaps', icon: '🧼' },
  { name: 'Lip Care', icon: '💋' },
  { name: 'Sunscreen', icon: '☀️' },
  { name: 'Scrubs', icon: '🌸' },
  { name: 'Gels', icon: '💧' },
]

const Home = () => {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productAPI.getAll({ featured: true, limit: 8 })
      .then(res => setFeatured(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-700 via-green-700 to-teal-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-20 w-80 h-80 rounded-full bg-emerald-300 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 lg:py-32 flex flex-col items-center text-center">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">100% Organic & Cruelty-Free</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-3xl">
            Discover the Power of <span className="text-yellow-300 italic">Nature</span>
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl mb-10 leading-relaxed">
            Premium organic skincare & haircare crafted with Ayurvedic wisdom. Gentle on your skin, powerful in results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/products" className="bg-white text-emerald-800 font-semibold px-8 py-3.5 rounded-full hover:bg-emerald-50 transition-all shadow-lg">
              Shop Now
            </Link>
            <Link to="/about" className="border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-all">
              Our Story
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-10 border-t border-white/20 w-full max-w-lg">
            {[['1000+', 'Happy Customers'], ['100%', 'Natural Ingredients'], ['0%', 'Harsh Chemicals']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-display text-2xl font-bold text-yellow-300">{num}</div>
                <div className="text-xs text-emerald-200 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-emerald-600 font-medium text-sm uppercase tracking-widest">Why Luckyaura?</span>
            <h2 className="font-display text-3xl lg:text-4xl text-gray-900 mt-2">Rooted in Nature, Backed by Science</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🌿', title: '100% Natural', desc: 'Every ingredient is carefully sourced from nature — herbs, essential oils, and botanical extracts inspired by Ayurveda.' },
              { icon: '🧴', title: 'Safe for Everyone', desc: 'Free from parabens, sulphates, and harsh chemicals. Suitable for all skin and hair types including sensitive skin.' },
              { icon: '✨', title: 'Visible Results', desc: 'Consistent use delivers glowing skin, stronger hair, and lasting radiance — without any compromise on safety.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="p-8 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-semibold text-lg text-gray-800 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl text-gray-900">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map(({ name, icon }) => (
              <Link key={name} to={`/products?category=${name}`}
                className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">{icon}</div>
                <p className="text-sm font-medium text-gray-700">{name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-emerald-600 font-medium text-sm uppercase tracking-widest">Handpicked for You</span>
              <h2 className="font-display text-3xl lg:text-4xl text-gray-900 mt-1">Featured Products</h2>
            </div>
            <Link to="/products" className="hidden sm:inline-flex items-center gap-1.5 text-emerald-600 font-medium hover:text-emerald-800 transition-colors text-sm">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          {loading
            ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>
            : featured.length > 0
              ? <ProductCard products={featured} />
              : (
                <div className="text-center py-16 text-gray-400">
                  <p>No featured products yet. Check back soon!</p>
                  <Link to="/products" className="mt-4 inline-block text-emerald-600 font-medium hover:underline">Browse all products →</Link>
                </div>
              )
          }
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-20 text-center px-4">
        <h2 className="font-display text-3xl lg:text-4xl text-white mb-4">Glow Naturally with Luckyaura</h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">Explore our full range of organic face washes, serums, creams, hair oils, and more — crafted with love from nature.</p>
        <Link to="/products" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-10 py-4 rounded-full text-lg transition-colors shadow-lg shadow-emerald-900/30">
          View All Products
        </Link>
      </section>
    </div>
  )
}

export default Home
