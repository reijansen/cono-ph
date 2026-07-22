import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import MultiSelectFilter from '@/components/ui/MultiSelectFilter'

export default function BiomarkerSidebar({ filters = {}, options = {}, onFilterChange = () => {} }) {
  const update = (patch) => onFilterChange({ ...filters, ...patch })
  const reset = () => onFilterChange({ search: '', markerType: [], species: [], province: [], status: [], hasAccession: false })
  return (
    <Card className="space-y-4 bg-[#ece8e8] p-4 sm:p-5">
      <Input type="search" placeholder="Search by.." aria-label="Search biomarkers" value={filters.search || ''} onChange={(event) => update({ search: event.target.value })} onKeyDown={(event) => { if (event.key === 'Enter') update({ search: filters.search || '' }) }} />
      <div className="space-y-3">
        <MultiSelectFilter label="Gene markers" options={options.markerType || []} value={filters.markerType} onChange={(value) => update({ markerType: value })} />
        <MultiSelectFilter label="Species names" options={options.species || []} value={filters.species} onChange={(value) => update({ species: value })} />
        <MultiSelectFilter label="Provinces" options={options.province || []} value={filters.province} onChange={(value) => update({ province: value })} />
        <MultiSelectFilter label="Validation status" options={options.status || []} value={filters.status} onChange={(value) => update({ status: value })} />
        <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-2xl border border-[var(--app-border)] bg-white px-4 text-sm"><span>Has external accession</span><input type="checkbox" className="toggle toggle-success" checked={Boolean(filters.hasAccession)} onChange={(event) => update({ hasAccession: event.target.checked })} /></label>
      </div>
      <div className="grid gap-3 pt-1 sm:grid-cols-2"><Button variant="outline" className="bg-white" onClick={reset}>Reset All</Button><Button onClick={() => onFilterChange(filters)}>Apply Filters</Button></div>
    </Card>
  )
}
