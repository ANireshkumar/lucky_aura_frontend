import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { orderAPI } from '../services/api'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [address, setAddress] = useState({ name: user?.name || '', phone: '', street: '', city: '', state: '', pincode: '' })

  const total = getTotalPrice()

  const handleCheckout = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setPlacing(true)
    try {
      await orderAPI.create({
        items: cartItems.map(i => ({
          product: i._id || i.id,
          name: i.name,
          image: i.images?.[0]?.url || i.image || '',
          price: i.price,
          quantity: i.quantity,
        })),
        shippingAddress: address,
        totalAmount: total,
        paymentMethod: 'COD',
      })
      clearCart()
      showToast('Order placed successfully! 🎉')
      navigate('/orders')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to place order', 'error')
    } finally {
      setPlacing(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 animate-fade-up">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-4xl">🛒</div>
        <h2 className="font-display text-2xl text-gray-800">Your cart is empty</h2>
        <p className="text-gray-400 text-sm">Add some products to get started!</p>
        <Link to="/products" className="mt-2 bg-emerald-600 text-white px-8 py-3 rounded-full font-medium hover:bg-emerald-700 transition-colors">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 animate-fade-up">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-gray-900">Shopping Cart</h1>
          <button onClick={clearCart} className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors">Clear all</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => {
              const id = item._id || item.id
              const img = item.images?.[0]?.url || item.image || '/placeholder.png'
              return (
                <div key={id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 shadow-sm">
                  <img src={img} alt={item.name} className="w-24 h-24 object-cover rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{item.name}</h3>
                    <p className="text-emerald-700 font-bold mt-1">₹{item.price}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button onClick={() => updateQuantity(id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors font-medium">−</button>
                      <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors font-medium">+</button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeFromCart(id)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="font-semibold text-gray-900 text-lg mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span>₹{total}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span><span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span><span>₹{total}</span>
                </div>
              </div>

              {!checkoutOpen ? (
                <button onClick={() => { if (!user) navigate('/login'); else setCheckoutOpen(true) }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-colors">
                  {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-3 mt-4">
                  <p className="font-medium text-gray-700 text-sm mb-2">Shipping Address</p>
                  {[
                    ['name', 'Full Name', 'text'],
                    ['phone', 'Phone', 'tel'],
                    ['street', 'Street Address', 'text'],
                    ['city', 'City', 'text'],
                    ['state', 'State', 'text'],
                    ['pincode', 'Pincode', 'text'],
                  ].map(([field, label, type]) => (
                    <input key={field} type={type} placeholder={label} required
                      value={address[field]}
                      onChange={e => setAddress(p => ({ ...p, [field]: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  ))}
                  <button type="submit" disabled={placing}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm mt-1">
                    {placing ? 'Placing order…' : 'Place Order (COD)'}
                  </button>
                  <button type="button" onClick={() => setCheckoutOpen(false)} className="w-full text-gray-400 text-sm hover:text-gray-600">Cancel</button>
                </form>
              )}

              <Link to="/products" className="block text-center text-emerald-600 hover:text-emerald-800 text-sm font-medium mt-4">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
