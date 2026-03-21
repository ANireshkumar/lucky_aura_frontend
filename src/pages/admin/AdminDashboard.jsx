import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { orderAPI } from '../../services/api'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
}

const StatCard = ({ label, value, icon, color }) => (
  <div className={`rounded-2xl p-6 ${color} flex items-center gap-4`}>
    <div className="text-4xl">{icon}</div>
    <div>
      <p className="text-sm font-medium opacity-70">{label}</p>
      <p className="text-3xl font-bold mt-0.5">{value}</p>
    </div>
  </div>
)

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderAPI.getStats()
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-32"><div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="animate-fade-up space-y-8">
      <h1 className="font-display text-3xl text-gray-900">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} icon="📦" color="bg-blue-50 text-blue-900" />
        <StatCard label="Revenue" value={`₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}`} icon="💰" color="bg-emerald-50 text-emerald-900" />
        <StatCard label="Products" value={stats?.totalProducts ?? 0} icon="🛍️" color="bg-purple-50 text-purple-900" />
        <StatCard label="Users" value={stats?.totalUsers ?? 0} icon="👥" color="bg-amber-50 text-amber-900" />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/admin/products', label: 'Manage Products', icon: '🛍️', desc: 'Add, edit, or remove products' },
          { to: '/admin/orders', label: 'Manage Orders', icon: '📋', desc: 'View and update order statuses' },
          { to: '/admin/users', label: 'Manage Users', icon: '👥', desc: 'View registered customers' },
        ].map(({ to, label, icon, desc }) => (
          <Link key={to} to={to} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-emerald-200 transition-all group">
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">{label}</h3>
            <p className="text-sm text-gray-400 mt-1">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-emerald-600 hover:text-emerald-800 font-medium">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
              <tr>
                {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentOrders?.length > 0 ? stats.recentOrders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-600">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 text-gray-700">{order.user?.name || 'Guest'}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-700">₹{order.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
