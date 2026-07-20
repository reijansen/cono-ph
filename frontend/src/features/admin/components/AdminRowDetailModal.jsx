import { ArchiveRestore, Edit3, Trash2, X } from 'lucide-react'

import { displayValue } from '@/features/admin/components/adminUiUtils'

function isLongValue(value) {
  const text = displayValue(value)
  return text.length > 80 || text.startsWith('{') || text.startsWith('[')
}

export default function AdminRowDetailModal({
  resource,
  row,
  onArchive,
  onClose,
  onEdit,
  onPermanentDelete,
  onRestore,
}) {
  const isArchive = resource.key === 'archive'
  const canEdit = !resource.readOnly && !isArchive

  return (
    <div className="modal modal-open">
      <div className="modal-box max-h-[88vh] w-11/12 max-w-4xl overflow-hidden rounded-md p-0">
        <div className="flex items-start justify-between border-b border-base-300 px-4 py-3">
          <div>
            <h2 className="font-sans text-base font-semibold text-base-content">
              {row[resource.idColumn] ?? resource.label}
            </h2>
            <p className="text-xs text-base-content/60">{resource.label}</p>
          </div>
          <button type="button" className="btn btn-ghost btn-xs rounded-md" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto px-4 py-4">
          <dl className="grid gap-x-5 gap-y-3 md:grid-cols-2">
            {resource.columns.map((column) => (
              <div key={column} className={isLongValue(row[column]) ? 'md:col-span-2' : ''}>
                <dt className="text-xs font-semibold text-base-content/60">{column}</dt>
                <dd className="mt-1 max-h-52 overflow-auto whitespace-pre-wrap break-words rounded-md border border-base-300 bg-base-100 px-3 py-2 text-sm text-base-content">
                  {displayValue(row[column])}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="modal-action mt-0 border-t border-base-300 px-4 py-3">
          <button type="button" className="btn btn-outline btn-sm rounded-md" onClick={onClose}>
            Close
          </button>
          {canEdit ? (
            <>
              <button type="button" className="btn btn-outline btn-sm rounded-md gap-2" onClick={() => onEdit(row)}>
                <Edit3 className="h-4 w-4" />
                Edit
              </button>
              <button type="button" className="btn btn-outline btn-sm rounded-md gap-2 text-red-700" onClick={() => onArchive(row)}>
                <Trash2 className="h-4 w-4" />
                Archive
              </button>
            </>
          ) : null}
          {isArchive ? (
            <>
              <button type="button" className="btn btn-outline btn-sm rounded-md gap-2" onClick={() => onRestore(row)}>
                <ArchiveRestore className="h-4 w-4" />
                Restore
              </button>
              <button type="button" className="btn btn-sm rounded-md bg-red-700 text-white hover:bg-red-800" onClick={() => onPermanentDelete(row)}>
                Permanently delete
              </button>
            </>
          ) : null}
        </div>
      </div>
      <button type="button" className="modal-backdrop" onClick={onClose}>
        close
      </button>
    </div>
  )
}
