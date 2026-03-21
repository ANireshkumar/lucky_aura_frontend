import React, { useState, useEffect } from 'react'
import { userAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()
  const { user: currentUser } = useAuth()

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await userAPI.getAll({ page, limit: 15, search })
      setUsers(res.data.users)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch { showToast('Failed to load users', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [page, search])

  const toggleRole = async (id, current) => {
    const newRole = current === 'admin' ? 'user' : 'admin'
    if (!window.confirm(`Change this user's role to ${newRole}?`)) return
    try {
      const res = await userAPI.updateRole(id, newRole)
      setUsers(prev => prev.map(u => u._id === id ? res.data : u))
      showToast(`Role updated to ${newRole}`)
    } catch { showToast('Failed to update role', 'error') }
  }

  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <h1 className="font-display text-3xl text-gray-900">Users</h1>
        <p className="text-gray-400 text-sm mt-1">{total} registered users</p>
      </div>

      <div className="relative max-w-sm">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search by name or email…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white" />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
              <tr>
                {['User', 'Email', 'Auth', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center"><div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No users found</td></tr>
              ) : users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {u.avatar
                        ? <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                        : <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold shrink-0">{u.name?.[0]?.toUpperCase()}</div>
                      }
                      <p className="font-medium text-gray-800">{u.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${u.googleId ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.googleId ? '🔵 Google' : '📧 Email'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-4">
                    {u._id !== currentUser?._id && (
                      <button onClick={() => toggleRole(u._id, u.role)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${u.role === 'admin' ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}>
                        {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                      </button>
                    )}
                  </td>
                </tr>
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

export default AdminUsers
