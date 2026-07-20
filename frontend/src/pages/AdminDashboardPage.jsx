import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AdminDataTable from '@/features/admin/components/AdminDataTable'
import AdminFormModal from '@/features/admin/components/AdminFormModal'
import AdminHeader from '@/features/admin/components/AdminHeader'
import AdminResourceNav from '@/features/admin/components/AdminResourceNav'
import AdminToolbar from '@/features/admin/components/AdminToolbar'
import { getFilterColumns, getVisibleColumns } from '@/features/admin/components/adminUiUtils'
import {
  createAdminRow,
  deleteAdminRow,
  fetchAdminResources,
  fetchAdminRows,
  fetchAdminSession,
  logoutAdmin,
  updateAdminRow,
} from '@/services/adminService'

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [resources, setResources] = useState([])
  const [activeResourceKey, setActiveResourceKey] = useState('')
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState(null)
  const [search, setSearch] = useState('')
  const [filterColumn, setFilterColumn] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editor, setEditor] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const activeResource = useMemo(
    () => resources.find((resource) => resource.key === activeResourceKey) ?? resources[0],
    [activeResourceKey, resources],
  )
  const visibleColumns = activeResource ? getVisibleColumns(activeResource) : []
  const filterColumns = activeResource ? getFilterColumns(activeResource) : []

  useEffect(() => {
    let active = true

    async function bootstrap() {
      try {
        const session = await fetchAdminSession()
        if (!session.authenticated) {
          navigate('/adminlogin', { replace: true })
          return
        }

        const loadedResources = await fetchAdminResources()
        if (active) {
          setResources(loadedResources)
          setActiveResourceKey(loadedResources[0]?.key ?? '')
        }
      } catch {
        if (active) navigate('/adminlogin', { replace: true })
      } finally {
        if (active) setChecking(false)
      }
    }

    bootstrap()

    return () => {
      active = false
    }
  }, [navigate])

  useEffect(() => {
    if (!activeResource) return

    let active = true

    async function loadRows() {
      setLoading(true)
      setError('')
      try {
        const result = await fetchAdminRows(activeResource.key, { search, filterColumn, filterValue, limit: 25 })
        if (active) {
          setRows(result.rows)
          setPagination(result.pagination)
        }
      } catch {
        if (active) {
          setRows([])
          setPagination(null)
          setError('Unable to load records.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    const timeout = window.setTimeout(loadRows, 180)
    return () => {
      active = false
      window.clearTimeout(timeout)
    }
  }, [activeResource, search, filterColumn, filterValue])

  async function reloadRows() {
    if (!activeResource) return
    setLoading(true)
    setError('')
    try {
      const result = await fetchAdminRows(activeResource.key, { search, filterColumn, filterValue, limit: 25 })
      setRows(result.rows)
      setPagination(result.pagination)
    } catch {
      setError('Unable to load records.')
    } finally {
      setLoading(false)
    }
  }

  function handleResourceSelect(resourceKey) {
    setActiveResourceKey(resourceKey)
    setEditor(null)
    setSearch('')
    setFilterColumn('')
    setFilterValue('')
  }

  async function handleLogout() {
    await logoutAdmin()
    navigate('/adminlogin', { replace: true })
  }

  async function handleSave(form) {
    setSaving(true)
    setFormError('')

    try {
      if (editor.mode === 'create') {
        await createAdminRow(activeResource.key, form)
      } else {
        await updateAdminRow(activeResource.key, editor.row[activeResource.idColumn], form)
      }
      setEditor(null)
      await reloadRows()
    } catch (err) {
      setFormError(err.message || 'Unable to save record.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(row) {
    const id = row[activeResource.idColumn]
    if (!window.confirm(`Delete ${id}?`)) return

    setLoading(true)
    try {
      await deleteAdminRow(activeResource.key, id)
      await reloadRows()
    } catch {
      setError('Unable to delete record.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) return null

  return (
    <div className="min-h-[72vh] border-y border-base-300">
      <AdminHeader onRefresh={reloadRows} onLogout={handleLogout} />

      <div className="grid lg:grid-cols-[190px_minmax(0,1fr)]">
        <AdminResourceNav
          resources={resources}
          activeResourceKey={activeResource?.key}
          onSelect={handleResourceSelect}
        />

        <section className="min-w-0">
          <AdminToolbar
            activeResource={activeResource}
            filterColumns={filterColumns}
            filterColumn={filterColumn}
            filterValue={filterValue}
            search={search}
            onCreate={() => {
              setFormError('')
              setEditor({ mode: 'create', row: null })
            }}
            onFilterColumnChange={(nextColumn) => {
              setFilterColumn(nextColumn)
              setFilterValue('')
            }}
            onFilterValueChange={setFilterValue}
            onSearchChange={setSearch}
            onClearFilters={() => {
              setFilterColumn('')
              setFilterValue('')
            }}
          />

          {activeResource ? (
            <AdminDataTable
              activeResource={activeResource}
              error={error}
              loading={loading}
              pagination={pagination}
              rows={rows}
              visibleColumns={visibleColumns}
              onDelete={handleDelete}
              onEdit={(row) => {
                setFormError('')
                setEditor({ mode: 'edit', row })
              }}
            />
          ) : null}
        </section>
      </div>

      {activeResource && editor ? (
        <AdminFormModal
          mode={editor.mode}
          resource={activeResource}
          row={editor.row}
          saving={saving}
          error={formError}
          onCancel={() => setEditor(null)}
          onSubmit={handleSave}
        />
      ) : null}
    </div>
  )
}
