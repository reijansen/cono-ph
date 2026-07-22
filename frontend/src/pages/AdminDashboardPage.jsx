import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AdminConfirmModal from '@/features/admin/components/AdminConfirmModal'
import AdminDataTable from '@/features/admin/components/AdminDataTable'
import AdminFormModal from '@/features/admin/components/AdminFormModal'
import AdminHeader from '@/features/admin/components/AdminHeader'
import AdminImportCsvModal from '@/features/admin/components/AdminImportCsvModal'
import AdminResourceNav from '@/features/admin/components/AdminResourceNav'
import AdminRowDetailModal from '@/features/admin/components/AdminRowDetailModal'
import AdminToolbar from '@/features/admin/components/AdminToolbar'
import { getFilterColumns, getVisibleColumns, orderAdminResources } from '@/features/admin/components/adminUiUtils'
import {
  createAdminRow,
  deleteAdminRow,
  fetchAdminResources,
  fetchAdminRows,
  fetchAdminSession,
  importAdminCsv,
  logoutAdmin,
  permanentlyDeleteArchivedRow,
  restoreArchivedRow,
  updateAdminRow,
} from '@/services/adminService'

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [resources, setResources] = useState([])
  const [activeResourceKey, setActiveResourceKey] = useState('')
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [filterColumn, setFilterColumn] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editor, setEditor] = useState(null)
  const [detailRow, setDetailRow] = useState(null)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [importError, setImportError] = useState('')
  const [confirmation, setConfirmation] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState(null)

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

        const loadedResources = orderAdminResources(await fetchAdminResources())
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
        const result = await fetchAdminRows(activeResource.key, {
          page,
          search,
          filterColumn,
          filterValue,
          limit: pageSize,
        })
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
  }, [activeResource, page, pageSize, search, filterColumn, filterValue])

  useEffect(() => {
    if (pagination && page > pagination.totalPages) {
      setPage(pagination.totalPages)
    }
  }, [page, pagination])

  async function reloadRows() {
    if (!activeResource) return
    setLoading(true)
    setError('')
    try {
      const result = await fetchAdminRows(activeResource.key, {
        page,
        search,
        filterColumn,
        filterValue,
        limit: pageSize,
      })
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
    setDetailRow(null)
    setImportModalOpen(false)
    setConfirmation(null)
    setNotice(null)
    setPage(1)
    setSearch('')
    setFilterColumn('')
    setFilterValue('')
  }

  async function executeLogout() {
    setSaving(true)
    await logoutAdmin()
    navigate('/adminlogin', { replace: true })
  }

  async function executeSave(form) {
    setSaving(true)
    setFormError('')

    try {
      if (editor.mode === 'create') {
        await createAdminRow(activeResource.key, form)
      } else {
        await updateAdminRow(activeResource.key, editor.row[activeResource.idColumn], form)
      }
      setConfirmation(null)
      setEditor(null)
      await reloadRows()
    } catch (err) {
      setConfirmation(null)
      setFormError(err.message || 'Unable to save record.')
    } finally {
      setSaving(false)
    }
  }

  async function executeArchive(row) {
    const id = row[activeResource.idColumn]
    setSaving(true)
    setError('')
    try {
      await deleteAdminRow(activeResource.key, id)
      setConfirmation(null)
      setDetailRow(null)
      await reloadRows()
    } catch {
      setError('Unable to archive record.')
    } finally {
      setSaving(false)
    }
  }

  async function executeRestore(row) {
    setSaving(true)
    setError('')
    try {
      await restoreArchivedRow(row.archive_id)
      setConfirmation(null)
      setDetailRow(null)
      await reloadRows()
    } catch (err) {
      setConfirmation(null)
      setError(err.message || 'Unable to restore archived record.')
    } finally {
      setSaving(false)
    }
  }

  async function executePermanentDelete(row) {
    setSaving(true)
    setError('')
    try {
      await permanentlyDeleteArchivedRow(row.archive_id)
      setConfirmation(null)
      setDetailRow(null)
      await reloadRows()
    } catch (err) {
      setConfirmation(null)
      setError(err.message || 'Unable to permanently delete archived record.')
    } finally {
      setSaving(false)
    }
  }

  async function executeImport({ filename, csvText }) {
    setSaving(true)
    setImportError('')
    try {
      const result = await importAdminCsv(activeResource.key, { filename, csvText })
      setConfirmation(null)
      setImportModalOpen(false)
      setNotice({
        type: 'success',
        message: [
          `Imported ${result.imported_row_count ?? 0} rows from ${filename}.`,
          `Created ${result.created_count ?? 0}, updated ${result.updated_count ?? 0}, skipped ${result.skipped_count ?? 0}.`,
          result.notes,
        ].filter(Boolean).join(' '),
      })
      await reloadRows()
    } catch (err) {
      const message = err.message || 'Unable to import CSV.'
      setConfirmation(null)
      setImportError(message)
      setNotice({
        type: 'error',
        message,
      })
    } finally {
      setSaving(false)
    }
  }

  if (checking) return null

  return (
    <div className="min-h-[72vh] border-y border-base-300">
      <AdminHeader
        onRefresh={reloadRows}
        onLogout={() => {
          setConfirmation({
            type: 'logout',
            title: 'Log out?',
            description: 'Your admin session will end on this browser.',
            confirmLabel: 'Log out',
            tone: 'danger',
            onConfirm: executeLogout,
          })
        }}
      />

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
              if (activeResource?.readOnly) return
              setFormError('')
              setEditor({ mode: 'create', row: null })
            }}
            onImport={() => {
              setImportError('')
              setImportModalOpen(true)
            }}
            onFilterColumnChange={(nextColumn) => {
              setPage(1)
              setFilterColumn(nextColumn)
              setFilterValue('')
            }}
            onFilterValueChange={(nextValue) => {
              setPage(1)
              setFilterValue(nextValue)
            }}
            onSearchChange={(nextSearch) => {
              setPage(1)
              setSearch(nextSearch)
            }}
            onClearFilters={() => {
              setPage(1)
              setSearch('')
              setFilterColumn('')
              setFilterValue('')
            }}
          />

          {notice ? (
            <div className="px-4 pt-4">
              <div
                className={`alert rounded-md py-3 text-sm ${
                  notice.type === 'success' ? 'alert-success' : 'alert-error'
                }`}
              >
                <span>{notice.message}</span>
                <button type="button" className="btn btn-ghost btn-xs" onClick={() => setNotice(null)}>
                  Dismiss
                </button>
              </div>
            </div>
          ) : null}

          {activeResource ? (
            <AdminDataTable
              activeResource={activeResource}
              error={error}
              loading={loading}
              pageSize={pageSize}
              pagination={pagination}
              rows={rows}
              visibleColumns={visibleColumns}
              onDelete={(row) => {
                const id = row[activeResource.idColumn]
                setConfirmation({
                  type: 'archive',
                  title: 'Archive this record?',
                  description: `${id} will move out of active ${activeResource.label} records and appear in Archive.`,
                  confirmLabel: 'Archive',
                  tone: 'danger',
                  onConfirm: () => executeArchive(row),
                })
              }}
              onPermanentDelete={(row) => {
                setConfirmation({
                  type: 'permanent-delete',
                  title: 'Permanently delete this archived record?',
                  description: `${row.archive_id} will be removed from Archive. This cannot be undone.`,
                  confirmLabel: 'Delete forever',
                  tone: 'danger',
                  onConfirm: () => executePermanentDelete(row),
                })
              }}
              onRestore={(row) => {
                setConfirmation({
                  type: 'restore',
                  title: 'Restore this archived record?',
                  description: `${row.record_id} will be returned to ${row.resource_name} if its primary key is not already active.`,
                  confirmLabel: 'Restore',
                  onConfirm: () => executeRestore(row),
                })
              }}
              onRowOpen={setDetailRow}
              onEdit={(row) => {
                if (activeResource.readOnly) return
                setDetailRow(null)
                setFormError('')
                setEditor({ mode: 'edit', row })
              }}
              onPageChange={setPage}
              onPageSizeChange={(nextPageSize) => {
                setPageSize(nextPageSize)
                setPage(1)
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
          onSubmit={(form) => {
            setConfirmation({
              type: 'save',
              title: editor.mode === 'create' ? 'Create this record?' : 'Save changes?',
              description:
                editor.mode === 'create'
                  ? `A new ${activeResource.label} record will be added.`
                  : `Changes to ${editor.row[activeResource.idColumn]} will be saved.`,
              confirmLabel: editor.mode === 'create' ? 'Create' : 'Save',
              onConfirm: () => executeSave(form),
            })
          }}
        />
      ) : null}

      {activeResource && detailRow ? (
        <AdminRowDetailModal
          resource={activeResource}
          row={detailRow}
          onClose={() => setDetailRow(null)}
          onEdit={(row) => {
            setDetailRow(null)
            setFormError('')
            setEditor({ mode: 'edit', row })
          }}
          onArchive={(row) => {
            const id = row[activeResource.idColumn]
            setConfirmation({
              type: 'archive',
              title: 'Archive this record?',
              description: `${id} will move out of active ${activeResource.label} records and appear in Archive.`,
              confirmLabel: 'Archive',
              tone: 'danger',
              onConfirm: () => executeArchive(row),
            })
          }}
          onRestore={(row) => {
            setConfirmation({
              type: 'restore',
              title: 'Restore this archived record?',
              description: `${row.record_id} will be returned to ${row.resource_name} if its primary key is not already active.`,
              confirmLabel: 'Restore',
              onConfirm: () => executeRestore(row),
            })
          }}
          onPermanentDelete={(row) => {
            setConfirmation({
              type: 'permanent-delete',
              title: 'Permanently delete this archived record?',
              description: `${row.archive_id} will be removed from Archive. This cannot be undone.`,
              confirmLabel: 'Delete forever',
              tone: 'danger',
              onConfirm: () => executePermanentDelete(row),
            })
          }}
        />
      ) : null}

      {activeResource && importModalOpen ? (
        <AdminImportCsvModal
          resource={activeResource}
          loading={saving}
          error={importError}
          onCancel={() => {
            if (!saving) setImportModalOpen(false)
          }}
          onConfirm={(payload) => {
            setConfirmation({
              type: 'import',
              title: 'Import this CSV?',
              description: `${payload.filename} will be upserted into ${activeResource.label}. Existing matching records will be archived before update.`,
              confirmLabel: 'Import',
              onConfirm: () => executeImport(payload),
            })
          }}
        />
      ) : null}

      {confirmation ? (
        <AdminConfirmModal
          title={confirmation.title}
          description={confirmation.description}
          confirmLabel={confirmation.confirmLabel}
          tone={confirmation.tone}
          loading={saving}
          onCancel={() => {
            if (!saving) setConfirmation(null)
          }}
          onConfirm={confirmation.onConfirm}
        />
      ) : null}
    </div>
  )
}
