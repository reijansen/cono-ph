import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SearchInput from '@/components/ui/SearchInput'
import SelectWithChevron from '@/components/ui/SelectWithChevron'

const defaultStatusOptions = ['Published', 'Under Review', 'Unpublished']

function SelectField({ label, options, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-black">{label}</label>
      <SelectWithChevron
        value={value}
        onChange={(event) => onChange(event.target.value)}
        selectClassName="pr-12"
      >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
      </SelectWithChevron>
    </div>
  )
}

function CheckboxGroup({ selectedStatuses, onToggleStatus }) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-black">Status of Data</div>
      <div className="space-y-1.5 text-sm text-[var(--app-muted)]">
        {defaultStatusOptions.map((label) => (
          <label key={label} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedStatuses.includes(label)}
              onChange={() => onToggleStatus(label)}
              className="h-4 w-4 rounded border-[var(--app-border)]"
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function ToggleField({ enabled, onToggle }) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-black">Raw Data in NCBI SRA</div>
      <button
        type="button"
        aria-pressed={enabled}
        onClick={onToggle}
        className="flex h-8 w-14 items-center rounded-full bg-black/45 p-1 transition"
      >
        <span className={enabled ? 'ml-auto h-6 w-6 rounded-full bg-white shadow-sm transition' : 'h-6 w-6 rounded-full bg-white shadow-sm transition'} />
      </button>
    </div>
  )
}

export default function SpeciesExplorerFilters({
  filters = {},
  options = {},
  onFilterChange = () => {},
}) {
  const updateFilters = (patch) => {
    onFilterChange({ ...filters, ...patch })
  }

  const toggleStatus = (status) => {
    const currentStatuses = filters.status || []
    const nextStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((item) => item !== status)
      : [...currentStatuses, status]

    updateFilters({ status: nextStatuses })
  }

  const resetFilters = () => {
    onFilterChange({
      search: '',
      project: 'All Projects',
      subgenus: 'All Subgenus',
      province: 'All Provinces',
      municipality: 'All Municipalities',
      status: [],
      diet: 'All Diet',
      sequencingPlatform: 'All Platforms',
      rawDataInNcbiSra: false,
    })
  }

  return (
    <Card className="space-y-5 bg-[#ece8e8] p-4 sm:p-5">
      <div className="space-y-4">
        <SearchInput
          placeholder="Search by.."
          aria-label="Search species"
          value={filters.search || ''}
          onChange={(event) => updateFilters({ search: event.target.value })}
        />
        <div className="space-y-4">
          <SelectField label="Project" options={options.project || []} value={filters.project || 'All Projects'} onChange={(value) => updateFilters({ project: value })} />
          <SelectField label="Subgenus" options={options.subgenus || []} value={filters.subgenus || 'All Subgenus'} onChange={(value) => updateFilters({ subgenus: value })} />
          <SelectField label="Province" options={options.province || []} value={filters.province || 'All Provinces'} onChange={(value) => updateFilters({ province: value })} />
          <SelectField label="Municipality" options={options.municipality || []} value={filters.municipality || 'All Municipalities'} onChange={(value) => updateFilters({ municipality: value })} />
          <CheckboxGroup selectedStatuses={filters.status || []} onToggleStatus={toggleStatus} />
          <SelectField label="Organisms Diet" options={options.diet || []} value={filters.diet || 'All Diet'} onChange={(value) => updateFilters({ diet: value })} />
          <SelectField label="Sequencing Platform" options={options.sequencingPlatform || []} value={filters.sequencingPlatform || 'All Platforms'} onChange={(value) => updateFilters({ sequencingPlatform: value })} />
          <ToggleField enabled={Boolean(filters.rawDataInNcbiSra)} onToggle={() => updateFilters({ rawDataInNcbiSra: !filters.rawDataInNcbiSra })} />
        </div>
      </div>

      <div className="grid gap-3 pt-1 sm:grid-cols-2">
        <Button variant="outline" size="md" className="bg-white text-[var(--app-text)]" onClick={resetFilters}>
          Reset All
        </Button>
        <Button variant="primary" size="md" className="bg-brand-700">
          Apply Filter
        </Button>
      </div>
    </Card>
  )
}
