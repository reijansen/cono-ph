import { useState } from 'react'
import { Search } from 'lucide-react'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import SelectWithChevron from '@/components/ui/SelectWithChevron'
import { cn } from '@/utils/cn'

function TogglePill({ label, enabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition',
        enabled
          ? 'border-brand-300 bg-brand-50 text-brand-800'
          : 'border-[var(--app-border)] bg-white text-[var(--app-text)] hover:border-brand-200',
      )}
    >
      <span className="font-medium">{label}</span>
      <span
        className={cn(
          'inline-flex h-6 w-11 items-center rounded-full p-0.5 transition',
          enabled ? 'justify-end bg-brand-700' : 'justify-start bg-[#b8b8b8]',
        )}
      >
        <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
      </span>
    </button>
  )
}

function SelectField({ label, value, options = [], onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-black">{label}</label>
      <SelectWithChevron value={value} onChange={(event) => onChange(event.target.value)} selectClassName="pr-12">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </SelectWithChevron>
    </div>
  )
}

export default function PublicationSidebar({
  filters = {},
  options = {},
  onFilterChange = () => {},
}) {
  const [localFilters, setLocalFilters] = useState(filters)

  const updateLocalFilters = (patch) => {
    setLocalFilters((current) => ({ ...current, ...patch }))
  }

  const handleResetFilters = () => {
    const resetFilters = {
      search: '',
      year: 'All Years',
      journal: 'All Journals',
      hasDoi: false,
    }

    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const handleApplyFilters = () => {
    onFilterChange(localFilters)
  }

  return (
    <Card className="space-y-5 bg-[#ece8e8] p-4 sm:p-5">
      <div className="space-y-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-muted)]" />
          <Input
            type="search"
            placeholder="Search by.."
            aria-label="Search publications"
            value={localFilters.search || ''}
            onChange={(event) => updateLocalFilters({ search: event.target.value })}
            className="pl-11"
          />
        </label>

        <div className="space-y-4">
          <SelectField label="Year Published" value={localFilters.year || 'All Years'} options={options.year} onChange={(value) => updateLocalFilters({ year: value })} />
          <SelectField label="Journal" value={localFilters.journal || 'All Journals'} options={options.journal} onChange={(value) => updateLocalFilters({ journal: value })} />

          <TogglePill
            label="Has DOI"
            enabled={Boolean(localFilters.hasDoi)}
            onClick={() => updateLocalFilters({ hasDoi: !localFilters.hasDoi })}
          />
        </div>
      </div>

      <div className="grid gap-3 pt-1 sm:grid-cols-2">
        <Button variant="outline" size="md" className="bg-white text-[var(--app-text)]" onClick={handleResetFilters}>
          Reset All
        </Button>
        <Button variant="primary" size="md" className="bg-brand-700" onClick={handleApplyFilters}>
          Apply Filter
        </Button>
      </div>
    </Card>
  )
}
