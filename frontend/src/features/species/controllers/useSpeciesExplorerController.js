import { useCallback, useEffect, useMemo, useState } from 'react'

import { loadSpeciesBackupRecords } from '@/features/species/data/speciesBackupData'

const speciesPageSize = 5

export const speciesExplorerInitialFilters = {
  search: '',
  subgenus: 'All Subgenus',
  province: 'All Provinces',
  municipality: 'All Municipalities',
  diet: 'All Diet',
}

const isDefaultOption = (value) => !value || value.startsWith('All ')
const normalize = (value) => String(value ?? '').toLowerCase()
const uniqueOptions = (label, rows, field) => [
  label,
  ...Array.from(new Set(rows.map((row) => row[field]).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
]

function rowMatchesFilters(row, filters) {
  const searchTerm = normalize(filters.search).trim()
  const searchableText = normalize(Object.values(row).join(' '))

  if (searchTerm && !searchableText.includes(searchTerm)) return false
  if (!isDefaultOption(filters.subgenus) && row.subgenus !== filters.subgenus) return false
  if (!isDefaultOption(filters.province) && row.province !== filters.province) return false
  if (!isDefaultOption(filters.municipality) && row.municipality !== filters.municipality) return false
  if (!isDefaultOption(filters.diet) && row.diet !== filters.diet) return false

  return true
}

export function useSpeciesExplorerController() {
  const [filters, setFilters] = useState(speciesExplorerInitialFilters)
  const [page, setPage] = useState(1)
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

  const filteredRecords = useMemo(
    () => recordsSource.filter((row) => rowMatchesFilters(row, filters)),
    [filters, recordsSource],
  )

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / speciesPageSize))
  const records = useMemo(
    () => filteredRecords.slice((page - 1) * speciesPageSize, page * speciesPageSize),
    [filteredRecords, page],
  )
  const filterOptions = useMemo(
    () => ({
      subgenus: uniqueOptions('All Subgenus', recordsSource, 'subgenus'),
      province: uniqueOptions('All Provinces', recordsSource, 'province'),
      municipality: uniqueOptions('All Municipalities', recordsSource, 'municipality'),
      diet: uniqueOptions('All Diet', recordsSource, 'diet'),
    }),
    [recordsSource],
  )

  const handleFilterChange = useCallback((nextFilters) => {
    setFilters(nextFilters)
    setPage(1)
  }, [])

  const handlePageChange = useCallback((nextPage) => {
    setPage(nextPage)
  }, [])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  return {
    breadcrumbs: [
      { label: 'Home', to: '/' },
      { label: 'Species' },
    ],
    filters,
    filterOptions,
    handleFilterChange,
    handlePageChange,
    pagination: { page, totalPages },
    records,
    resultCount: filteredRecords.length,
  }
}
