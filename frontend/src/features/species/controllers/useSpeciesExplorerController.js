import { useCallback, useEffect, useState } from 'react'

import { fetchSpeciesExplorerOptions, fetchSpeciesExplorerPage } from '@/services/catalogService'

const speciesPageSize = 5

export const speciesExplorerInitialFilters = {
  search: '',
  subgenus: '',
  province: '',
  municipality: '',
  diet: '',
}

const labels = {
  subgenus: 'All Subgenus',
  province: 'All Provinces',
  municipality: 'All Municipalities',
  diet: 'All Diet',
}

export function useSpeciesExplorerController() {
  const [filters, setFilters] = useState(speciesExplorerInitialFilters)
  const [page, setPage] = useState(1)
  const [records, setRecords] = useState([])
  const [filterOptions, setFilterOptions] = useState({})
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    fetchSpeciesExplorerOptions().then(setFilterOptions).catch(() => setFilterOptions({}))
  }, [])

  useEffect(() => {
    let active = true
    setStatus('loading')
    fetchSpeciesExplorerPage({ ...filters, page, limit: speciesPageSize })
      .then((result) => {
        if (!active) return
        setRecords(result.rows)
        setPagination(result.pagination || { page, totalPages: 1, total: result.rows.length })
        setStatus('live')
      })
      .catch(() => {
        if (!active) return
        setRecords([])
        setPagination({ page: 1, totalPages: 1, total: 0 })
        setStatus('empty')
      })
    return () => { active = false }
  }, [filters, page])

  const options = Object.fromEntries(Object.entries(filterOptions).map(([key, values]) => [
    key,
    [labels[key] || `All ${key}`, ...(values || [])],
  ]))

  const handleFilterChange = useCallback((nextFilters) => {
    setFilters({ ...speciesExplorerInitialFilters, ...nextFilters })
    setPage(1)
  }, [])

  return {
    breadcrumbs: [{ label: 'Home', to: '/' }, { label: 'Species' }],
    filters: Object.fromEntries(Object.entries(filters).map(([key, value]) => [key, value || labels[key] || value])),
    filterOptions: options,
    handleFilterChange,
    handlePageChange: setPage,
    pagination: { ...pagination, page },
    records,
    resultCount: status === 'loading' ? 'Loading' : pagination.total,
  }
}
