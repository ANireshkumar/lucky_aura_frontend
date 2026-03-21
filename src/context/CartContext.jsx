import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()
export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i._id === product._id || i.id === product.id)
      if (existing) {
        return prev.map(i =>
          (i._id === product._id || i.id === product.id)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id) =>
    setCartItems(prev => prev.filter(i => i._id !== id && i.id !== id))

  const updateQuantity = (id, qty) => {
    if (qty <= 0) { removeFromCart(id); return }
    setCartItems(prev =>
      prev.map(i => (i._id === id || i.id === id) ? { ...i, quantity: qty } : i)
    )
  }

  const clearCart = () => setCartItems([])

  const getTotalItems = () => cartItems.reduce((s, i) => s + i.quantity, 0)
  const getTotalPrice = () => cartItems.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  )
}
