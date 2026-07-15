import { useCallback, useEffect, useMemo, useState } from 'react'

import { loadPublicationBackupRows } from '@/features/publications/data/publicationBackupData'

const publicationExplorerBreadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Publications' },
]

const publicationExplorerMeta = {
  title: 'Publications Explorer',
  subtitle: 'Browse publications linked to Philippine cone snail, conopeptide, and biomarker evidence.',
}

const publicationExplorerInitialFilters = {
  search: '',
  year: 'All Years',
  journal: 'All Journals',
  hasDoi: false,
}

const publicationPageSize = 5
const publicationPagination = {
  page: 1,
  totalPages: 1,
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
  if (!isDefaultOption(filters.year) && row.year !== filters.year) return false
  if (!isDefaultOption(filters.journal) && row.journal !== filters.journal) return false
  if (filters.hasDoi && row.doi === 'Unavailable') return false

  return true
}

export function usePublicationsExplorerController() {
  const [filters, setFilters] = useState(publicationExplorerInitialFilters)
  const [page, setPage] = useState(publicationPagination.page)
  const [rowsSource, setRowsSource] = useState([])
  const [rowsStatus, setRowsStatus] = useState('loading')

  useEffect(() => {
    let active = true

    async function loadRows() {
      setRowsStatus('loading')

      try {
        const backupRows = await loadPublicationBackupRows()
        if (active) {
          setRowsSource(backupRows)
          setRowsStatus('backup')
        }
      } catch {
        if (active) {
          setRowsSource([])
          setRowsStatus('empty')
        }
      }
    }

    loadRows()

    return () => {
      active = false
    }
  }, [])

  const filteredRows = useMemo(
    () => rowsSource.filter((row) => rowMatchesFilters(row, filters)),
    [filters, rowsSource],
  )

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / publicationPageSize))
  const rows = useMemo(
    () => filteredRows.slice((page - 1) * publicationPageSize, page * publicationPageSize),
    [filteredRows, page],
  )
  const filterOptions = useMemo(
    () => ({
      year: uniqueOptions('All Years', rowsSource, 'year'),
      journal: uniqueOptions('All Journals', rowsSource, 'journal'),
    }),
    [rowsSource],
  )

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const handleFilterChange = useCallback((nextFilters) => {
    setFilters(nextFilters)
    setPage(1)
  }, [])

  const handlePageChange = useCallback((nextPage) => {
    setPage(nextPage)
  }, [])

  return {
    breadcrumbs: publicationExplorerBreadcrumbs,
    filters,
    filterOptions,
    handleFilterChange,
    handlePageChange,
    meta: publicationExplorerMeta,
    pagination: { ...publicationPagination, page, totalPages },
    resultCount: rowsStatus === 'loading' ? 'Loading backup data...' : `${filteredRows.length.toLocaleString()} results`,
    rows,
  }
}
