import { useCallback, useEffect, useState } from 'react'

import { fetchPublicationExplorerOptions, fetchPublicationExplorerPage } from '@/services/catalogService'

const pageSize = 5
const initialFilters = { search: '', year: '', journal: '' }

export function usePublicationsExplorerController() {
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState([])
  const [filterOptions, setFilterOptions] = useState({})
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [status, setStatus] = useState('loading')

  useEffect(() => { fetchPublicationExplorerOptions().then(setFilterOptions).catch(() => setFilterOptions({})) }, [])
  useEffect(() => {
    let active = true
    setStatus('loading')
    fetchPublicationExplorerPage({ ...filters, page, limit: pageSize })
      .then((result) => { if (active) { setRows(result.rows); setPagination(result.pagination); setStatus('live') } })
      .catch(() => { if (active) { setRows([]); setPagination({ page: 1, totalPages: 1, total: 0 }); setStatus('empty') } })
    return () => { active = false }
  }, [filters, page])

  const handleFilterChange = useCallback((nextFilters) => { setFilters({ ...initialFilters, ...nextFilters }); setPage(1) }, [])
  const options = { year: ['All Years', ...(filterOptions.year || [])], journal: ['All Journals', ...(filterOptions.journal || [])] }

  return {
    breadcrumbs: [{ label: 'Home', to: '/' }, { label: 'Publications' }],
    filters: { ...filters, year: filters.year || 'All Years', journal: filters.journal || 'All Journals' },
    filterOptions: options,
    handleFilterChange,
    handlePageChange: setPage,
    meta: { title: 'Publications Explorer', subtitle: 'Browse publications linked to Philippine cone snail, conopeptide, and biomarker evidence.' },
    pagination: { ...pagination, page },
    resultCount: status === 'loading' ? 'Loading data...' : `${(pagination.total || 0).toLocaleString()} results`,
    rows,
  }
}
