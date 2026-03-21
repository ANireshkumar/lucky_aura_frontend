import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const AuthCallback = () => {
  const [params] = useSearchParams()
  const { setFromOAuth } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    const userRaw = params.get('user')

    if (token && userRaw) {
      try {
        const user = JSON.parse(decodeURIComponent(userRaw))
        setFromOAuth(token, user)
        showToast(`Welcome, ${user.name}!`)
        navigate(user.role === 'admin' ? '/admin' : '/', { replace: true })
      } catch {
        showToast('Google login failed', 'error')
        navigate('/login', { replace: true })
      }
    } else {
      showToast('Google login failed', 'error')
      navigate('/login', { replace: true })
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">Signing you in…</p>
    </div>
  )
}

export default AuthCallback
