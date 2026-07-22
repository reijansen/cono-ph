import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchConopeptideExplorerOptions, fetchConopeptideExplorerPage } from '@/services/catalogService'

const pageSize = 10
export const conopeptideExplorerInitialFilters = { search: '', species: '', superfamily: '', cysteineFramework: '', hasMaturePeptideSequence: 'all' }

export function useConopeptidesExplorerController() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState(conopeptideExplorerInitialFilters)
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState([])
  const [filterOptions, setFilterOptions] = useState({})
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })

  useEffect(() => { fetchConopeptideExplorerOptions().then(setFilterOptions).catch(() => setFilterOptions({})) }, [])
  useEffect(() => {
    let active = true
    fetchConopeptideExplorerPage({ ...filters, page, limit: pageSize })
      .then((result) => { if (active) { setRows(result.rows); setPagination(result.pagination) } })
      .catch(() => { if (active) { setRows([]); setPagination({ page: 1, totalPages: 1, total: 0 }) } })
    return () => { active = false }
  }, [filters, page])

  const handleFilterChange = useCallback((nextFilters) => { setFilters({ ...conopeptideExplorerInitialFilters, ...nextFilters }); setPage(1) }, [])
  const openConopeptide = useCallback((accession) => navigate(`/conopeptides/${accession}`), [navigate])
  const handleRowKeyDown = useCallback((event, accession) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openConopeptide(accession) } }, [openConopeptide])

  return {
    breadcrumbs: [{ label: 'Home', to: '/' }, { label: 'Conopeptides' }],
    filters: { ...filters, species: filters.species || 'All Species', superfamily: filters.superfamily || 'All Superfamilies', cysteineFramework: filters.cysteineFramework || 'All Cysteine Frameworks' },
    filterOptions: { species: ['All Species', ...(filterOptions.species || [])], superfamily: ['All Superfamilies', ...(filterOptions.superfamily || [])], cysteineFramework: ['All Cysteine Frameworks', ...(filterOptions.cysteineFramework || [])] },
    handleFilterChange, handlePageChange: setPage, handleRowKeyDown,
    meta: { title: 'Conopeptides Explorer', subtitle: 'Explore conopeptide precursors and predicted mature peptides from Philippine cone snails.' },
    openConopeptide, pagination: { ...pagination, page }, resultCount: `${(pagination.total || 0).toLocaleString()} results`, rows,
  }
}
