import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute'

// Layout
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AdminLayout from './components/admin/AdminLayout'

// Public pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import AuthCallback from './pages/auth/AuthCallback'

// Protected pages
import Orders from './pages/Orders'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'

// Main store layout wrapper
const StoreLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Routes>
              {/* Public store routes */}
              <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
              <Route path="/products" element={<StoreLayout><Products /></StoreLayout>} />
              <Route path="/products/:id" element={<StoreLayout><ProductDetail /></StoreLayout>} />
              <Route path="/about" element={<StoreLayout><About /></StoreLayout>} />
              <Route path="/contact" element={<StoreLayout><Contact /></StoreLayout>} />
              <Route path="/cart" element={<StoreLayout><Cart /></StoreLayout>} />

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Protected user routes */}
              <Route path="/orders" element={
                <ProtectedRoute>
                  <StoreLayout><Orders /></StoreLayout>
                </ProtectedRoute>
              } />

              {/* Admin routes — nested layout */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={
                <StoreLayout>
                  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
                    <p className="font-display text-8xl text-emerald-200 font-bold">404</p>
                    <h1 className="font-display text-2xl text-gray-800">Page not found</h1>
                    <a href="/" className="text-emerald-600 hover:underline text-sm">← Back to Home</a>
                  </div>
                </StoreLayout>
              } />
            </Routes>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
