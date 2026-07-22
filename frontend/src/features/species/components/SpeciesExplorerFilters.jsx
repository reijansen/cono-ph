import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SearchInput from '@/components/ui/SearchInput'
import SelectWithChevron from '@/components/ui/SelectWithChevron'

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

export default function SpeciesExplorerFilters({
  filters = {},
  options = {},
  onFilterChange = () => {},
}) {
  const updateFilters = (patch) => {
    onFilterChange({ ...filters, ...patch })
  }

  const resetFilters = () => {
    onFilterChange({
      search: '',
      subgenus: 'All Subgenus',
      province: 'All Provinces',
      municipality: 'All Municipalities',
      diet: 'All Diet',
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
          onKeyDown={(event) => {
            if (event.key === 'Enter') onFilterChange(filters)
          }}
        />
        <div className="space-y-4">
          <SelectField label="Subgenus" options={options.subgenus || []} value={filters.subgenus || 'All Subgenus'} onChange={(value) => updateFilters({ subgenus: value })} />
          <SelectField label="Province" options={options.province || []} value={filters.province || 'All Provinces'} onChange={(value) => updateFilters({ province: value })} />
          <SelectField label="Municipality" options={options.municipality || []} value={filters.municipality || 'All Municipalities'} onChange={(value) => updateFilters({ municipality: value })} />
          <SelectField label="Diet Type" options={options.diet || []} value={filters.diet || 'All Diet'} onChange={(value) => updateFilters({ diet: value })} />
        </div>
      </div>

      <div className="grid gap-3 pt-1 sm:grid-cols-2">
        <Button variant="outline" size="md" className="bg-white text-[var(--app-text)]" onClick={resetFilters}>
          Reset All
        </Button>
        <Button variant="primary" size="md" className="bg-brand-700" onClick={() => onFilterChange(filters)}>
          Apply Filter
        </Button>
      </div>
    </Card>
  )
}
