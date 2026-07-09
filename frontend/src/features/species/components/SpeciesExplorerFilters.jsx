import { useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SearchInput from '@/components/ui/SearchInput'
import SelectWithChevron from '@/components/ui/SelectWithChevron'

/**
 * Filters component for species explorer
 * Manages filter state and passes changes to parent
 */
export default function SpeciesExplorerFilters({ filters = {}, onFilterChange = () => {} }) {
  const [localSearch, setLocalSearch] = useState(filters.search || '')

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value)
  }

  const handleApplyFilters = () => {
    onFilterChange({
      search: localSearch,
    })
  }

  const handleResetFilters = () => {
    setLocalSearch('')
    onFilterChange({
      search: '',
      sortBy: 'created_at',
      order: 'DESC',
    })
  }

  return (
    <Card className="space-y-5 bg-[#ece8e8] p-4 sm:p-5">
      <div className="space-y-4">
        <SearchInput
          placeholder="Search species..."
          aria-label="Search species"
          value={localSearch}
          onChange={handleSearchChange}
        />
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-black">Sort By</label>
            <SelectWithChevron
              value={filters.sortBy || 'created_at'}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              selectClassName="pr-12"
            >
              <option value="created_at">Date Created</option>
              <option value="scientific_name">Scientific Name</option>
              <option value="common_name">Common Name</option>
              <option value="num_related_publications">Publications</option>
            </SelectWithChevron>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-black">Order</label>
            <SelectWithChevron
              value={filters.order || 'DESC'}
              onChange={(e) => onFilterChange({ order: e.target.value })}
              selectClassName="pr-12"
            >
              <option value="DESC">Descending</option>
              <option value="ASC">Ascending</option>
            </SelectWithChevron>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
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
