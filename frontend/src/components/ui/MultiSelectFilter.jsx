import { ChevronDown, X } from 'lucide-react'

import { cn } from '@/utils/cn'
import { normalizeFilterValues, removeFilterValue, toggleFilterValue } from '@/utils/multiSelectFilters'

export default function MultiSelectFilter({ label, options = [], value = [], onChange, className }) {
  const selected = normalizeFilterValues(value)

  return (
    <div className={cn('dropdown w-full', className)}>
      <button type="button" tabIndex={0} className="btn btn-outline btn-sm h-11 min-h-11 w-full justify-between gap-3 rounded-2xl border-[var(--app-border)] bg-white px-4 py-2 text-left normal-case text-[var(--app-text)] shadow-none hover:border-brand-300 hover:bg-brand-50/40 sm:min-w-0">
        <span className="min-w-0">
          <span className="block text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">{label}</span>
          <span className="block truncate text-sm">{selected.length ? `${selected.length} selected` : 'All values'}</span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-[var(--app-muted)]" />
      </button>
      <div tabIndex={0} className="dropdown-content z-30 mt-2 max-h-72 w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-[var(--app-border)] bg-white p-3 shadow-xl">
        <div className="space-y-1">
          {options.map((option) => {
            const checked = selected.includes(option)
            return (
              <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-brand-50">
                <input type="checkbox" className="checkbox checkbox-sm checkbox-success" checked={checked} onChange={() => onChange(toggleFilterValue(selected, option))} />
                <span className="min-w-0 truncate">{option}</span>
              </label>
            )
          })}
          {!options.length ? <p className="px-3 py-2 text-sm text-[var(--app-muted)]">No live options available.</p> : null}
        </div>
      </div>
      {selected.length ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selected.map((item) => (
            <button key={item} type="button" className="badge badge-outline gap-1 border-brand-300 bg-brand-50 text-brand-800" onClick={() => onChange(removeFilterValue(selected, item))}>
              <span className="max-w-40 truncate">{item}</span><X className="h-3 w-3" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
