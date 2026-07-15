import { useCallback, useEffect, useMemo, useState } from 'react'

import { loadSpeciesBackupRecords } from '@/features/species/data/speciesBackupData'

const speciesFilterOptions = {
  project: ['All Projects', 'ConoPH Core', 'Visayas Survey', 'Mindanao Survey'],
  subgenus: ['All Subgenus', 'Tesseliconus', 'Stephanoconus', 'Rhizoconus'],
  province: ['All Provinces', 'Cebu', 'Bohol', 'Palawan', 'Samar'],
  municipality: ['All Municipalities', 'Moalboal', 'Oslob', 'Danao', 'Bantayan'],
  diet: ['All Diet', 'Molluscivore', 'Piscivore', 'Wormivore'],
  sequencingPlatform: ['All Platforms', 'Illumina HiSeq', 'Oxford Nanopore', 'PacBio'],
}

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
  const [recordsSource, setRecordsSource] = useState([])

  useEffect(() => {
    let active = true

    async function loadRecords() {
      try {
        const backupRecords = await loadSpeciesBackupRecords()
        if (active && backupRecords.length > 0) {
          setRecordsSource(backupRecords)
        }
      } catch {
        if (active) {
          setRecordsSource([])
        }
      }
    }

    loadRecords()

    return () => {
      active = false
    }
  }, [])

  const records = useMemo(
    () => recordsSource.filter((row) => rowMatchesFilters(row, filters)),
    [filters, recordsSource],
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
    resultCount: records.length,
  }
}
