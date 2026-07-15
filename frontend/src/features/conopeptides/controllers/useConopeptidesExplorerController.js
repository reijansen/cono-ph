import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { loadConopeptideBackupRows } from '@/features/conopeptides/data/conopeptideBackupData'

const conopeptideExplorerBreadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Conopeptides' },
]

const conopeptideExplorerMeta = {
  title: 'Conopeptides Explorer',
  subtitle: 'Explore conopeptide precursors and predicted mature peptides from Philippine cone snails.',
}

const conopeptideFilterOptions = {
  project: ['All Projects', 'ConoPH Core', 'Visayas Survey', 'Mindanao Survey'],
  superfamily: ['All Superfamilies', 'A', 'M', 'O1', 'O2', 'T', 'I', 'S', 'Unknown'],
  province: ['All Provinces', 'Cebu', 'Bohol', 'Palawan', 'Samar'],
  municipality: ['All Municipalities', 'Oslob', 'Moalboal', 'Danao', 'Bantayan'],
  cysteineFramework: ['All Cysteine Frameworks', 'Framework I', 'Framework II', 'Framework III', 'Framework VI/VII'],
  status: ['Published', 'Under Review', 'Unpublished'],
}

const conopeptidePagination = {
  page: 1,
  totalPages: 68,
}

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
  const [rowsSource, setRowsSource] = useState([])

  useEffect(() => {
    let active = true

    async function loadRows() {
      try {
        const backupRows = await loadConopeptideBackupRows()
        if (active && backupRows.length > 0) {
          setRowsSource(backupRows)
        }
      } catch {
        if (active) {
          setRowsSource([])
        }
      }
    }

    loadRows()

    return () => {
      active = false
    }
  }, [])

  const rows = useMemo(
    () => rowsSource.filter((row) => rowMatchesFilters(row, filters)),
    [filters, rowsSource],
  )

  const resultCount = `${rows.length.toLocaleString()} results`

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
