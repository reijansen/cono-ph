import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchBiomarkerExplorerOptions, fetchBiomarkerExplorerPage } from '@/services/catalogService'

const pageSize = 10
const initialFilters = { search: '', markerType: '', species: '', province: '', status: [], hasAccession: false }

export function useBiomarkersExplorerController() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState([])
  const [filterOptions, setFilterOptions] = useState({})
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })

  useEffect(() => { fetchBiomarkerExplorerOptions().then(setFilterOptions).catch(() => setFilterOptions({})) }, [])
  useEffect(() => {
    let active = true
    fetchBiomarkerExplorerPage({ ...filters, status: filters.status.join(','), page, limit: pageSize })
      .then((result) => { if (active) { setRows(result.rows); setPagination(result.pagination) } })
      .catch(() => { if (active) { setRows([]); setPagination({ page: 1, totalPages: 1, total: 0 }) } })
    return () => { active = false }
  }, [filters, page])

  const handleFilterChange = useCallback((nextFilters) => { setFilters({ ...initialFilters, ...nextFilters }); setPage(1) }, [])
  const openBiomarker = useCallback((biomarkerId) => navigate(`/biomarkers/${biomarkerId}`), [navigate])
  const handleRowKeyDown = useCallback((event, biomarkerId) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openBiomarker(biomarkerId) } }, [openBiomarker])

  return {
    breadcrumbs: [{ label: 'Home', to: '/' }, { label: 'Biomarkers' }],
    filters: { ...filters, markerType: filters.markerType || 'All Marker Types', species: filters.species || 'All Species', province: filters.province || 'All Provinces' },
    filterOptions: { markerType: ['All Marker Types', ...(filterOptions.markerType || [])], species: ['All Species', ...(filterOptions.species || [])], province: ['All Provinces', ...(filterOptions.province || [])], status: filterOptions.status || [] },
    handleFilterChange, handlePageChange: setPage, handleRowKeyDown,
    meta: { title: 'Biomarkers Explorer', subtitle: 'Explore biomarker records, marker types, and linked sequence evidence from Philippine cone snails.' },
    openBiomarker, pagination: { ...pagination, page }, resultCount: `${(pagination.total || 0).toLocaleString()} results`, rows,
  }
}
