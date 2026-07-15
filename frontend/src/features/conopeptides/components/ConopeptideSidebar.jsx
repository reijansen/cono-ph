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

export default function ConopeptideSidebar({
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
      species: 'All Species',
      superfamily: 'All Superfamilies',
      cysteineFramework: 'All Cysteine Frameworks',
      hasPredictedPeptide: 'all',
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
            aria-label="Search conopeptides"
            value={localFilters.search || ''}
            onChange={(e) => updateLocalFilters({ search: e.target.value })}
            className="pl-11"
          />
        </label>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-black">Scientific Name</label>
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
            <label className="text-sm font-semibold text-black">Gene Superfamily</label>
            <SelectWithChevron
              value={localFilters.superfamily || 'All Superfamilies'}
              onChange={(e) => updateLocalFilters({ superfamily: e.target.value })}
              selectClassName="pr-12"
            >
              {(options.superfamily || []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-black">Cysteine Framework</label>
            <SelectWithChevron
              value={localFilters.cysteineFramework || 'All Cysteine Frameworks'}
              onChange={(e) => updateLocalFilters({ cysteineFramework: e.target.value })}
              selectClassName="pr-12"
            >
              {(options.cysteineFramework || []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectWithChevron>
          </div>

          <div className="space-y-2">
            <TogglePill
              label="Has Mature Peptide Sequence"
              enabled={localFilters.hasPredictedPeptide === 'yes'}
              onClick={() =>
                updateLocalFilters({
                  hasPredictedPeptide:
                    localFilters.hasPredictedPeptide === 'yes' ? 'all' : 'yes',
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="grid gap-3 pt-1 sm:grid-cols-2">
        <Button
          variant="outline"
          size="md"
          className="bg-white text-[var(--app-text)]"
          onClick={handleResetFilters}
        >
          Reset All
        </Button>
        <Button
          variant="primary"
          size="md"
          className="bg-brand-700"
          onClick={handleApplyFilters}
        >
          Apply Filter
        </Button>
      </div>
    </Card>
  )
}
