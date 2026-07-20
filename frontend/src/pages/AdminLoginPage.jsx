import { useEffect, useState } from 'react'
import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { fetchAdminSession, loginAdmin } from '@/services/adminService'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    let active = true

    async function checkSession() {
      try {
        const session = await fetchAdminSession()
        if (active && session.authenticated) navigate('/admin', { replace: true })
      } catch {
        // Stay on the login page.
      } finally {
        if (active) setChecking(false)
      }
    }

    checkSession()

    return () => {
      active = false
    }
  }, [navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await loginAdmin(password)
      navigate('/admin', { replace: true })
    } catch {
      setError('Invalid password.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) return null

  return (
    <div className="mx-auto flex min-h-[58vh] w-full max-w-sm items-center">
      <form onSubmit={handleSubmit} className="w-full border-y border-[var(--app-border)] py-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--app-border)]">
            <LockKeyhole className="h-4 w-4 text-brand-700" />
          </div>
          <div>
            <h1 className="font-sans text-base font-semibold text-[var(--app-text)]">Admin access</h1>
            <p className="text-sm text-[var(--app-muted)]">Password required</p>
          </div>
        </div>

        <label className="block text-sm font-medium text-[var(--app-text)]" htmlFor="admin-password">
          Password
        </label>
        <div className="relative mt-2">
          <Input
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-md pr-11"
            autoComplete="current-password"
            autoFocus
            required
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--app-muted)] hover:bg-brand-50 hover:text-brand-700"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}

        <Button type="submit" className="mt-5 w-full rounded-md" disabled={loading}>
          {loading ? 'Checking...' : 'Continue'}
        </Button>
      </form>
    </div>
  )
}
