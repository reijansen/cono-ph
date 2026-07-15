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

const publicationFilterOptions = {
  year: ['All Years', '2026', '2025', '2024', '2023', '2022'],
  journal: ['All Journals', 'Frontiers in Marine Science', 'Marine Drugs', 'Toxins', 'Molecular Ecology Resources'],
  evidenceType: ['All Evidence Types', 'Species record', 'Conopeptide evidence', 'Biomarker evidence', 'Transcriptome'],
  province: ['All Provinces', 'Cebu', 'Bohol', 'Palawan', 'Marinduque', 'Samar'],
  status: ['Published', 'Under Review', 'Preprint'],
}

const publicationExplorerInitialFilters = {
  search: '',
  year: 'All Years',
  journal: 'All Journals',
  evidenceType: 'All Evidence Types',
  province: 'All Provinces',
  status: [],
  hasDoi: false,
}

const publicationPagination = {
  page: 1,
  totalPages: 8,
}

const isDefaultOption = (value) => !value || value.startsWith('All ')
const normalize = (value) => String(value ?? '').toLowerCase()

function rowMatchesFilters(row, filters) {
  const searchTerm = normalize(filters.search).trim()
  const searchableText = normalize(Object.values(row).join(' '))

  if (searchTerm && !searchableText.includes(searchTerm)) return false
  if (!isDefaultOption(filters.year) && row.year !== filters.year) return false
  if (!isDefaultOption(filters.journal) && row.journal !== filters.journal) return false
  if (!isDefaultOption(filters.evidenceType) && row.evidenceType !== filters.evidenceType) return false
  if (!isDefaultOption(filters.province) && row.province !== filters.province) return false
  if ((filters.status || []).length > 0 && !filters.status.includes(row.status)) return false
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

  const rows = useMemo(
    () => rowsSource.filter((row) => rowMatchesFilters(row, filters)),
    [filters, rowsSource],
  )

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
    filterOptions: publicationFilterOptions,
    handleFilterChange,
    handlePageChange,
    meta: publicationExplorerMeta,
    pagination: { ...publicationPagination, page },
    resultCount: rowsStatus === 'loading' ? 'Loading backup data...' : `${rows.length.toLocaleString()} results`,
    rows,
  }
}
