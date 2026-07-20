export default function AdminConfirmModal({
  confirmLabel = 'Confirm',
  description,
  loading = false,
  tone = 'default',
  title,
  onCancel,
  onConfirm,
}) {
  const confirmClass =
    tone === 'danger'
      ? 'btn btn-sm rounded-md bg-red-700 text-white hover:bg-red-800'
      : 'btn btn-sm rounded-md bg-brand-700 text-white hover:bg-brand-800'

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md rounded-md p-0">
        <div className="border-b border-base-300 px-5 py-4">
          <h2 className="font-sans text-base font-semibold text-base-content">{title}</h2>
          {description ? <p className="mt-1 text-sm leading-6 text-base-content/65">{description}</p> : null}
        </div>
        <div className="modal-action mt-0 px-5 py-4">
          <button type="button" className="btn btn-outline btn-sm rounded-md" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="button" className={confirmClass} onClick={onConfirm} disabled={loading}>
            {loading ? 'Working...' : confirmLabel}
          </button>
        </div>
      </div>
      <button type="button" className="modal-backdrop" onClick={onCancel}>
        close
      </button>
    </div>
  )
}
