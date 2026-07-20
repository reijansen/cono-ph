import { LogOut, RefreshCw } from 'lucide-react'

export default function AdminHeader({ onRefresh, onLogout }) {
  return (
    <div className="flex flex-col gap-3 border-b border-base-300 py-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="font-sans text-lg font-semibold text-base-content">Admin</h1>
        <p className="text-sm text-base-content/60">Manage catalog records</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-outline btn-sm rounded-md gap-2" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
        <button type="button" className="btn btn-outline btn-sm rounded-md gap-2" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )
}
