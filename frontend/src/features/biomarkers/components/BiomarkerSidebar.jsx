import { useState } from 'react'
import { Search } from 'lucide-react'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import SelectWithChevron from '@/components/ui/SelectWithChevron'
import { cn } from '@/utils/cn'

const defaultStatusOptions = ['Published', 'Under Review', 'Unpublished']

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

export default function BiomarkerSidebar({
  filters = {},
  options = {},
  onFilterChange = () => {},
}) {
  const [localFilters, setLocalFilters] = useState(filters)

  const statusOptions = options.status || defaultStatusOptions

  const updateLocalFilters = (patch) => {
    setLocalFilters((current) => ({ ...current, ...patch }))
  }

  const handleStatusToggle = (status) => {
    const currentStatuses = localFilters.status || []
    const nextStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((item) => item !== status)
      : [...currentStatuses, status]

    updateLocalFilters({ status: nextStatuses })
  }

  const handleResetFilters = () => {
    const resetFilters = {
      search: '',
      project: 'All Projects',
      markerType: 'All Marker Types',
      species: 'All Species',
      province: 'All Provinces',
      municipality: 'All Municipalities',
      sequencingPlatform: 'All Platforms',
      status: [],
      hasAccession: false,
      hasSequenceData: false,
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
            aria-label="Search biomarkers"
            value={localFilters.search || ''}
            onChange={(e) => updateLocalFilters({ search: e.target.value })}
            className="pl-11"
          />
        </label>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-black">Project</label>
            <SelectWithChevron
              value={localFilters.project || 'All Projects'}
              onChange={(e) => updateLocalFilters({ project: e.target.value })}
              selectClassName="pr-12"
            >
              {(options.project || []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-black">Marker Type</label>
            <SelectWithChevron
              value={localFilters.markerType || 'All Marker Types'}
              onChange={(e) => updateLocalFilters({ markerType: e.target.value })}
              selectClassName="pr-12"
            >
              {(options.markerType || []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-black">Species</label>
            <SelectWithChevron
              value={localFilters.species || 'All Species'}
              onChange={(e) => updateLocalFilters({ species: e.target.value })}
              selectClassName="pr-12"
            >
              {(options.species || []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-black">Province</label>
            <SelectWithChevron
              value={localFilters.province || 'All Provinces'}
              onChange={(e) => updateLocalFilters({ province: e.target.value })}
              selectClassName="pr-12"
            >
              {(options.province || []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-black">Municipality</label>
            <SelectWithChevron
              value={localFilters.municipality || 'All Municipalities'}
              onChange={(e) => updateLocalFilters({ municipality: e.target.value })}
              selectClassName="pr-12"
            >
              {(options.municipality || []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-black">Status of Data</label>
            <div className="space-y-2">
              {statusOptions.map((status) => {
                const checked = (localFilters.status || []).includes(status)

                return (
                  <label
                    key={status}
                    className="flex cursor-pointer items-center gap-3 text-sm text-[var(--app-muted)]"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleStatusToggle(status)}
                      className="h-4 w-4 rounded border-[var(--app-border)] text-brand-700 focus:ring-brand-300"
                    />
                    <span>{status}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-black">Sequencing Platform</label>
            <SelectWithChevron
              value={localFilters.sequencingPlatform || 'All Platforms'}
              onChange={(e) => updateLocalFilters({ sequencingPlatform: e.target.value })}
              selectClassName="pr-12"
            >
              {(options.sequencingPlatform || []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>
          </div>

          <div className="space-y-3 pt-1">
            <TogglePill
              label="Has Accession"
              enabled={Boolean(localFilters.hasAccession)}
              onClick={() => updateLocalFilters({ hasAccession: !localFilters.hasAccession })}
            />
            <TogglePill
              label="Has Sequence Data"
              enabled={Boolean(localFilters.hasSequenceData)}
              onClick={() => updateLocalFilters({ hasSequenceData: !localFilters.hasSequenceData })}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button type="button" variant="outline" onClick={handleResetFilters}>
          Reset All
        </Button>
        <Button type="button" onClick={handleApplyFilters}>
          Apply Filter
        </Button>
      </div>
    </Card>
  )
}
