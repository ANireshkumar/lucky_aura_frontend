import React, { useState, useEffect } from 'react'
import { orderAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
}

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const { showToast } = useToast()

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15 }
      if (statusFilter) params.status = statusFilter
      const res = await orderAPI.getAll(params)
      setOrders(res.data.orders)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch { showToast('Failed to load orders', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchOrders() }, [page, statusFilter])

  const updateStatus = async (id, status) => {
    try {
      const res = await orderAPI.updateStatus(id, status)
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: res.data.status } : o))
      showToast('Order status updated')
    } catch { showToast('Failed to update status', 'error') }
  }

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-gray-900">Orders</h1>
          <p className="text-gray-400 text-sm mt-1">{total} total orders</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => { setStatusFilter(''); setPage(1) }}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${!statusFilter ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          All
        </button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors capitalize ${statusFilter === s ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
              <tr>
                {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center"><div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No orders found</td></tr>
              ) : orders.map(order => (
                <React.Fragment key={order._id}>
                  <tr className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                    <td className="px-5 py-4 font-mono text-gray-600 font-medium">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">{order.user?.name || 'Guest'}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                    <td className="px-5 py-4 font-semibold text-emerald-700">₹{order.totalAmount}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                      >
                        {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                      </select>
                    </td>
                  </tr>
                  {/* Expanded row */}
                  {expanded === order._id && (
                    <tr>
                      <td colSpan={7} className="bg-gray-50/80 px-5 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Items Ordered</p>
                            <div className="space-y-2">
                              {order.items?.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                  {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                                  <div>
                                    <p className="font-medium text-gray-700">{item.name}</p>
                                    <p className="text-gray-400 text-xs">Qty: {item.quantity} × ₹{item.price}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          {order.shippingAddress?.name && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Shipping Address</p>
                              <div className="text-sm text-gray-600 space-y-0.5">
                                <p className="font-medium">{order.shippingAddress.name}</p>
                                <p>{order.shippingAddress.phone}</p>
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-xl border text-sm font-medium disabled:opacity-40 hover:bg-gray-50">← Prev</button>
          <span className="text-sm text-gray-500">Page {page} of {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-xl border text-sm font-medium disabled:opacity-40 hover:bg-gray-50">Next →</button>
        </div>
      )}
    </div>
  )
}

export default AdminOrders
