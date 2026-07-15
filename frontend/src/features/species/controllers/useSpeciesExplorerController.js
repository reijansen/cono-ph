import { useCallback, useMemo, useState } from 'react'

import {
  speciesExplorerCount,
  speciesExplorerRecords,
  speciesFilterOptions,
} from '@/features/species/data/speciesExplorerData'

export const speciesExplorerInitialFilters = {
  search: '',
  project: 'All Projects',
  subgenus: 'All Subgenus',
  province: 'All Provinces',
  municipality: 'All Municipalities',
  status: [],
  diet: 'All Diet',
  sequencingPlatform: 'All Platforms',
  rawDataInNcbiSra: false,
}

const isDefaultOption = (value) => !value || value.startsWith('All ')
const normalize = (value) => String(value ?? '').toLowerCase()

function rowMatchesFilters(row, filters) {
  const searchTerm = normalize(filters.search).trim()
  const searchableText = normalize(Object.values(row).join(' '))

  if (searchTerm && !searchableText.includes(searchTerm)) return false
  if (!isDefaultOption(filters.project) && row.project !== filters.project) return false
  if (!isDefaultOption(filters.subgenus) && row.subgenus !== filters.subgenus) return false
  if (!isDefaultOption(filters.province) && row.province !== filters.province) return false
  if (!isDefaultOption(filters.municipality) && row.municipality !== filters.municipality) return false
  if (!isDefaultOption(filters.diet) && row.diet !== filters.diet) return false
  if (!isDefaultOption(filters.sequencingPlatform) && row.sequencingPlatform !== filters.sequencingPlatform) return false
  if ((filters.status || []).length > 0 && !filters.status.includes(row.status)) return false
  if (filters.rawDataInNcbiSra && !row.rawDataInNcbiSra) return false

  return true
}

export function useSpeciesExplorerController() {
  const [filters, setFilters] = useState(speciesExplorerInitialFilters)

  const records = useMemo(
    () => speciesExplorerRecords.filter((row) => rowMatchesFilters(row, filters)),
    [filters],
  )

  const handleFilterChange = useCallback((nextFilters) => {
    setFilters(nextFilters)
  }, [])

  return {
    breadcrumbs: [
      { label: 'Home', to: '/' },
      { label: 'Species' },
    ],
    filters,
    filterOptions: speciesFilterOptions,
    handleFilterChange,
    records,
    resultCount: records.length === speciesExplorerRecords.length ? speciesExplorerCount : records.length,
  }
}
