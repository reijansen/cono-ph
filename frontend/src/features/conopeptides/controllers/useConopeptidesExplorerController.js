import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  conopeptideExplorerBreadcrumbs,
  conopeptideExplorerMeta,
  conopeptideExplorerRows,
  conopeptideFilterOptions,
  conopeptidePagination,
} from '@/features/conopeptides/data/conopeptideMockData'

export const conopeptideExplorerInitialFilters = {
  search: '',
  project: 'All Projects',
  superfamily: 'All Superfamilies',
  province: 'All Provinces',
  municipality: 'All Municipalities',
  cysteineFramework: 'All Cysteine Frameworks',
  status: [],
  hasPredictedPeptide: 'all',
}

const isDefaultOption = (value) => !value || value.startsWith('All ')
const normalize = (value) => String(value ?? '').toLowerCase()

function rowMatchesFilters(row, filters) {
  const searchTerm = normalize(filters.search).trim()
  const searchableText = normalize(Object.values(row).join(' '))

  if (searchTerm && !searchableText.includes(searchTerm)) return false
  if (!isDefaultOption(filters.superfamily) && row.superfamily !== filters.superfamily) return false
  if (!isDefaultOption(filters.province) && row.province !== filters.province) return false
  if (!isDefaultOption(filters.cysteineFramework) && row.framework !== filters.cysteineFramework) return false
  if (filters.hasPredictedPeptide === 'yes' && !row.predictedPeptide) return false

  return true
}

export function useConopeptidesExplorerController() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState(conopeptideExplorerInitialFilters)
  const [page, setPage] = useState(conopeptidePagination.page)

  const rows = useMemo(
    () => conopeptideExplorerRows.filter((row) => rowMatchesFilters(row, filters)),
    [filters],
  )

  const resultCount = rows.length === conopeptideExplorerRows.length
    ? '3,671 results'
    : `${rows.length.toLocaleString()} results`

  const handleFilterChange = useCallback((nextFilters) => {
    setFilters(nextFilters)
    setPage(1)
  }, [])

  const handlePageChange = useCallback((nextPage) => {
    setPage(nextPage)
  }, [])

  const openConopeptide = useCallback(
    (accession) => {
      navigate(`/conopeptides/${accession}`)
    },
    [navigate],
  )

  const handleRowKeyDown = useCallback(
    (event, accession) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        openConopeptide(accession)
      }
    },
    [openConopeptide],
  )

  return {
    breadcrumbs: conopeptideExplorerBreadcrumbs,
    filters,
    filterOptions: conopeptideFilterOptions,
    handleFilterChange,
    handlePageChange,
    handleRowKeyDown,
    meta: conopeptideExplorerMeta,
    openConopeptide,
    pagination: { ...conopeptidePagination, page },
    resultCount,
    rows,
  }
}
