import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import MultiSelectFilter from '@/components/ui/MultiSelectFilter'

export default function PublicationSidebar({ filters = {}, options = {}, onFilterChange = () => {} }) {
  const update = (patch) => onFilterChange({ ...filters, ...patch })
  const reset = () => onFilterChange({ search: '', year: [], journal: [] })
  return (
    <Card className="space-y-4 bg-[#ece8e8] p-4 sm:p-5">
      <Input type="search" placeholder="Search by.." aria-label="Search publications" value={filters.search || ''} onChange={(event) => update({ search: event.target.value })} onKeyDown={(event) => { if (event.key === 'Enter') update({ search: filters.search || '' }) }} />
      <div className="space-y-3"><MultiSelectFilter label="Publication years" options={options.year || []} value={filters.year} onChange={(value) => update({ year: value })} /><MultiSelectFilter label="Journals" options={options.journal || []} value={filters.journal} onChange={(value) => update({ journal: value })} /></div>
      <div className="grid gap-3 pt-1 sm:grid-cols-2"><Button variant="outline" className="bg-white" onClick={reset}>Reset All</Button><Button onClick={() => onFilterChange(filters)}>Apply</Button></div>
    </Card>
  )
}
