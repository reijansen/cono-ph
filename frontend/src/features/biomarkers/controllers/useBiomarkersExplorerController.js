import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  biomarkerExplorerBreadcrumbs,
  biomarkerExplorerInitialFilters,
  biomarkerExplorerMeta,
  biomarkerExplorerResultCount,
  biomarkerExplorerRows,
  biomarkerFilterOptions,
  biomarkerPagination,
} from '@/features/biomarkers/data/biomarkerMockData'

const isDefaultOption = (value) => !value || value.startsWith('All ')
const normalize = (value) => String(value ?? '').toLowerCase()

function rowMatchesFilters(row, filters) {
  const searchTerm = normalize(filters.search).trim()
  const searchableText = normalize(Object.values(row).join(' '))

  if (searchTerm && !searchableText.includes(searchTerm)) return false
  if (!isDefaultOption(filters.markerType) && row.markerType !== filters.markerType) return false
  if (!isDefaultOption(filters.species) && row.species !== filters.species) return false
  if (!isDefaultOption(filters.province) && row.province !== filters.province) return false
  if ((filters.status || []).length > 0 && !filters.status.includes(row.status)) return false
  if (filters.hasAccession && row.accession === 'Unavailable') return false
  if (filters.hasSequenceData && row.sequenceLength === 'Unavailable') return false

  return true
}

export function useBiomarkersExplorerController() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState(biomarkerExplorerInitialFilters)
  const [page, setPage] = useState(biomarkerPagination.page)

  const rows = useMemo(
    () => biomarkerExplorerRows.filter((row) => rowMatchesFilters(row, filters)),
    [filters],
  )

  const resultCount = rows.length === biomarkerExplorerRows.length
    ? biomarkerExplorerResultCount
    : `${rows.length.toLocaleString()} results`

  const handleFilterChange = useCallback((nextFilters) => {
    setFilters(nextFilters)
    setPage(1)
  }, [])

  const handlePageChange = useCallback((nextPage) => {
    setPage(nextPage)
  }, [])

  const openBiomarker = useCallback(
    (biomarkerId) => {
      navigate(`/biomarkers/${biomarkerId}`)
    },
    [navigate],
  )

  const handleRowKeyDown = useCallback(
    (event, biomarkerId) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        openBiomarker(biomarkerId)
      }
    },
    [openBiomarker],
  )

  return {
    breadcrumbs: biomarkerExplorerBreadcrumbs,
    filters,
    filterOptions: biomarkerFilterOptions,
    handleFilterChange,
    handlePageChange,
    handleRowKeyDown,
    meta: biomarkerExplorerMeta,
    openBiomarker,
    pagination: { ...biomarkerPagination, page },
    resultCount,
    rows,
  }
}
