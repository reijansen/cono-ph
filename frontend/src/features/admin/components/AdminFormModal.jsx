import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

import { getInitialForm, textareaColumns } from '@/features/admin/components/adminUiUtils'

export default function AdminFormModal({ mode, resource, row, saving, error, onCancel, onSubmit }) {
  const [form, setForm] = useState(() => getInitialForm(resource, row))

  useEffect(() => {
    setForm(getInitialForm(resource, row))
  }, [resource, row])

  function updateField(column, value) {
    setForm((current) => ({ ...current, [column]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box flex max-h-[88vh] w-11/12 max-w-4xl flex-col overflow-hidden rounded-md p-0">
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
          <div className="flex items-center justify-between border-b border-base-300 px-4 py-3">
            <div>
              <h2 className="font-sans text-sm font-semibold text-base-content">
                {mode === 'create' ? 'Create record' : 'Edit record'}
              </h2>
              <p className="text-xs text-base-content/60">{resource.label}</p>
            </div>
            <button type="button" onClick={onCancel} className="btn btn-ghost btn-xs rounded-md">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-3 overflow-y-auto px-4 py-4 sm:grid-cols-2 lg:grid-cols-3">
            {resource.columns.map((column) => {
              const type = resource.types[column]
              const isRequired = resource.required.includes(column)
              const disabled = mode === 'edit' && column === resource.idColumn

              return (
                <label key={column} className="form-control">
                  <span className="label py-0 pb-1 text-xs font-medium text-base-content">{column}</span>
                  {textareaColumns.has(column) ? (
                    <textarea
                      value={form[column] ?? ''}
                      onChange={(event) => updateField(column, event.target.value)}
                      disabled={disabled}
                      required={isRequired}
                      rows={column === 'sequence' || column.includes('peptide') ? 4 : 3}
                      className="textarea textarea-bordered rounded-md bg-white text-sm disabled:bg-base-200"
                    />
                  ) : type === 'boolean' ? (
                    <select
                      value={String(Boolean(form[column]))}
                      onChange={(event) => updateField(column, event.target.value === 'true')}
                      disabled={disabled}
                      className="select select-bordered select-sm h-9 rounded-md bg-white disabled:bg-base-200"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  ) : (
                    <input
                      type={type === 'number' ? 'number' : 'text'}
                      value={form[column] ?? ''}
                      onChange={(event) => updateField(column, event.target.value)}
                      disabled={disabled}
                      required={isRequired}
                      className="input input-bordered input-sm h-9 rounded-md bg-white disabled:bg-base-200"
                    />
                  )}
                </label>
              )
            })}
          </div>

          {error ? <p className="px-4 pb-2 text-sm text-error">{error}</p> : null}

          <div className="modal-action mt-0 border-t border-base-300 px-4 py-3">
            <button type="button" className="btn btn-outline btn-sm rounded-md" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-sm rounded-md bg-brand-700 text-white hover:bg-brand-800" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
      <button type="button" className="modal-backdrop" onClick={onCancel}>
        close
      </button>
    </div>
  )
}
