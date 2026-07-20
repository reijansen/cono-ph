import { Edit3, Trash2 } from 'lucide-react'

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
  pagination,
  rows,
  visibleColumns,
  onDelete,
  onEdit,
}) {
  const isReadOnly = Boolean(activeResource.readOnly)

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
              {!isReadOnly ? <th className="w-28 px-4 py-2 text-right font-semibold">Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={getRowKey(row, activeResource, index)} className="border-b border-base-300 hover:bg-brand-50/30">
                {visibleColumns.map((column) => (
                  <td key={column} className="max-w-[260px] truncate px-4 py-2 text-base-content">
                    {displayValue(row[column])}
                  </td>
                ))}
                {!isReadOnly ? (
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="btn btn-ghost btn-xs rounded-md text-base-content/60 hover:bg-brand-50 hover:text-brand-800"
                        aria-label="Edit"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(row)}
                        className="btn btn-ghost btn-xs rounded-md text-base-content/60 hover:bg-red-50 hover:text-red-700"
                        aria-label="Archive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex min-h-11 items-center justify-between px-0 py-3 text-sm text-base-content/60 lg:px-4">
        <span>{loading ? 'Loading...' : pagination ? `${pagination.total.toLocaleString()} records` : 'No records'}</span>
        {error ? <span className="text-error">{error}</span> : rows.length === 0 && !loading ? <span>Nothing to show</span> : null}
      </div>
    </>
  )
}
