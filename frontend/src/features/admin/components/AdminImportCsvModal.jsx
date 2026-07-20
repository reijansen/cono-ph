import { useState } from 'react'
import { Upload, X } from 'lucide-react'

export default function AdminImportCsvModal({ resource, loading, error, onCancel, onConfirm }) {
  const [fileName, setFileName] = useState('')
  const [csvText, setCsvText] = useState('')
  const [readError, setReadError] = useState('')

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    setReadError('')
    setFileName('')
    setCsvText('')

    if (!file) return
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setReadError('Choose a CSV file.')
      return
    }

    setFileName(file.name)
    setCsvText(await file.text())
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg rounded-md p-0">
        <div className="flex items-start justify-between border-b border-base-300 px-5 py-4">
          <div>
            <h2 className="font-sans text-base font-semibold text-base-content">Import CSV</h2>
            <p className="text-sm text-base-content/65">{resource.label}</p>
          </div>
          <button type="button" className="btn btn-ghost btn-xs rounded-md" onClick={onCancel}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <input
            type="file"
            accept=".csv,text/csv"
            className="file-input file-input-bordered file-input-sm w-full rounded-md"
            onChange={handleFileChange}
          />
          {fileName ? <p className="text-sm text-base-content/70">{fileName}</p> : null}
          <div className="rounded-md border border-base-300 bg-base-100 px-3 py-2 text-sm leading-6 text-base-content/70">
            Import uses upsert by primary key. Existing active records with matching keys are archived before they are updated.
          </div>
          {readError || error ? <p className="text-sm text-error">{readError || error}</p> : null}
        </div>

        <div className="modal-action mt-0 border-t border-base-300 px-5 py-4">
          <button type="button" className="btn btn-outline btn-sm rounded-md" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-sm rounded-md bg-brand-700 text-white hover:bg-brand-800"
            disabled={!csvText || loading}
            onClick={() => onConfirm({ filename: fileName, csvText })}
          >
            <Upload className="h-4 w-4" />
            {loading ? 'Importing...' : 'Import'}
          </button>
        </div>
      </div>
      <button type="button" className="modal-backdrop" onClick={onCancel}>
        close
      </button>
    </div>
  )
}
