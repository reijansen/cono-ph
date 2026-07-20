import { ArchiveRestore, Edit3, Trash2 } from 'lucide-react'

import { displayValue } from '@/features/admin/components/adminUiUtils'

function getRowKey(row, activeResource, index) {
  const primaryKey = row[activeResource.idColumn]
  if (primaryKey !== undefined && primaryKey !== null && String(primaryKey).trim()) {
    return `${activeResource.key}:${String(primaryKey)}`
  }

  return `${activeResource.key}:row-${index}:${JSON.stringify(row)}`
}

export default function AdminDataTable({
  activeResource,
  error,
  loading,
  pageSize,
  pagination,
  rows,
  visibleColumns,
  onDelete,
  onEdit,
  onPermanentDelete,
  onPageChange,
  onPageSizeChange,
  onRestore,
  onRowOpen,
}) {
  const isArchive = activeResource.key === 'archive'
  const isReadOnly = Boolean(activeResource.readOnly) && !isArchive

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-sm w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-base-300 bg-base-200/70 text-xs uppercase text-base-content/60">
              {visibleColumns.map((column) => (
                <th key={column} className="px-4 py-2 font-semibold">
                  {column}
                </th>
              ))}
              {activeResource.key !== 'datasetLogs' ? <th className="w-36 px-4 py-2 text-right font-semibold">Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={getRowKey(row, activeResource, index)}
                className="cursor-pointer border-b border-base-300 hover:bg-brand-50/30"
                onClick={() => onRowOpen(row)}
              >
                {visibleColumns.map((column) => (
                  <td key={column} className="max-w-[260px] truncate px-4 py-2 text-base-content">
                    {displayValue(row[column])}
                  </td>
                ))}
                {activeResource.key !== 'datasetLogs' ? (
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-1">
                      {isArchive ? (
                        <>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              onRestore(row)
                            }}
                            className="btn btn-ghost btn-xs rounded-md text-base-content/60 hover:bg-brand-50 hover:text-brand-800"
                            aria-label="Restore"
                          >
                            <ArchiveRestore className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              onPermanentDelete(row)
                            }}
                            className="btn btn-ghost btn-xs rounded-md text-base-content/60 hover:bg-red-50 hover:text-red-700"
                            aria-label="Permanently delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : !isReadOnly ? (
                        <>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              onEdit(row)
                            }}
                            className="btn btn-ghost btn-xs rounded-md text-base-content/60 hover:bg-brand-50 hover:text-brand-800"
                            aria-label="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              onDelete(row)
                            }}
                            className="btn btn-ghost btn-xs rounded-md text-base-content/60 hover:bg-red-50 hover:text-red-700"
                            aria-label="Archive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex min-h-11 flex-col gap-3 px-0 py-3 text-sm text-base-content/60 sm:flex-row sm:items-center sm:justify-between lg:px-4">
        <div className="flex flex-wrap items-center gap-3">
          <span>{loading ? 'Loading...' : pagination ? `${pagination.total.toLocaleString()} records` : 'No records'}</span>
          <label className="flex items-center gap-2">
            <span>Rows</span>
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="select select-bordered select-xs h-8 rounded-md bg-white"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
        </div>
        {error ? <span className="text-error">{error}</span> : rows.length === 0 && !loading ? <span>Nothing to show</span> : null}
        {pagination ? (
          <div className="join">
            <button
              type="button"
              className="btn join-item btn-xs rounded-l-md"
              disabled={pagination.page <= 1 || loading}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              Prev
            </button>
            <button type="button" className="btn join-item btn-xs pointer-events-none">
              {pagination.page} / {pagination.totalPages}
            </button>
            <button
              type="button"
              className="btn join-item btn-xs rounded-r-md"
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </>
  )
}
