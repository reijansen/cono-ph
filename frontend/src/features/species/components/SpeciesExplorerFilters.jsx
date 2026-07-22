import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import MultiSelectFilter from '@/components/ui/MultiSelectFilter'

export default function SpeciesExplorerFilters({ filters = {}, options = {}, onFilterChange = () => {} }) {
  const update = (patch) => onFilterChange({ ...filters, ...patch })
  const reset = () => onFilterChange({ search: '', subgenus: [], province: [], municipality: [], diet: [] })
  return (
    <Card className="space-y-4 bg-[#ece8e8] p-4 sm:p-5">
      <Input type="search" placeholder="Search by.." aria-label="Search species" value={filters.search || ''} onChange={(event) => update({ search: event.target.value })} onKeyDown={(event) => { if (event.key === 'Enter') update({ search: filters.search || '' }) }} />
      <div className="space-y-3">
        <MultiSelectFilter label="Subgenera" options={options.subgenus || []} value={filters.subgenus} onChange={(value) => update({ subgenus: value })} />
        <MultiSelectFilter label="Provinces" options={options.province || []} value={filters.province} onChange={(value) => update({ province: value })} />
        <MultiSelectFilter label="Municipalities" options={options.municipality || []} value={filters.municipality} onChange={(value) => update({ municipality: value })} />
        <MultiSelectFilter label="Diet type" options={options.diet || []} value={filters.diet} onChange={(value) => update({ diet: value })} />
      </div>
      <div className="grid gap-3 pt-1 sm:grid-cols-2"><Button variant="outline" className="bg-white" onClick={reset}>Reset All</Button><Button onClick={() => onFilterChange(filters)}>Apply Filters</Button></div>
    </Card>
  )
}
